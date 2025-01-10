import React, { useCallback, useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { OptionFilter, OptionSendNoti } from "../data/dataNotification"
import { useAdminContext } from '../../../shared/hook/ContextToken';
import RangeDateInput from '../../../shared/component/InputFilter/RangeDateInput';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { createNotification } from '../../../shared/Config/Notifications';
import { renderPagination } from '../../../shared/function/Pagination';
import { formatDate } from '../../../shared/function/FomatDate';
import LoadingPage from "../../../shared/Config/LoadingPage"
import styled from 'styled-components';
import swal from 'sweetalert';
import { jwtDecode } from 'jwt-decode';
const NotificationPage = styled.div`

  
  padding:0 0 1rem;
  border-radius: 0.5rem;

 
  .sec1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      p {
        font-weight: 800;
        font-size: var(--fz_medium);
      }
    }
    .right {
      display: flex;
      gap: 1rem;
      align-items: center;
      .send_noti_btn {
        height: 2.5rem;
        padding: 0 1rem;
        background-color: green;
        color: white;
        font-weight: 700;
        border-radius: 0.3rem;
        height: 2.5rem;
        outline: none;
        overflow: hidden;
        border: 1px solid var(--shadow-black);
        box-shadow: 0 0 2px var(--shadow-black);
      }
    }
  }
  .sec2 {
    padding-top: 1rem;
    gap: 1rem;
    .table_container {
      min-height: 28rem;
      .table_ {
        border-collapse: collapse;
        width: 100%;
        transition: width 1s ease-in;
        // min-height: 28rem;
        thead {
          background-color: var(--cl_3);
          th {
            padding: 0.5rem 0.3rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;
          }
        }
        tbody {
          background-color: white;
          tr {
            border-bottom: 0.05rem solid var(--shadow-black);
            td {
              height: 45px;
              padding: 0 0.5rem;
              text-align: center;
              font-size: var(--fz_small);
              width: max-content;
              white-space: nowrap;
              .active {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: green;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
              }
              .deactive {
                padding: 0.2rem;
                font-size: var(--fz_smallmax);
                background-color: orange;
                border-radius: 0.5rem;
                cursor: pointer;
                color: white;
              }
              .b_action___ {
                display: flex;
                gap: 1rem;
                justify-content: center;
                .link_tag {
                  i {
                    display: flex;
                    align-items: center;
                    background-color: var(--cl_1);
                    justify-content: center;
                    padding: 0.4rem;
                    border-radius: 0.2rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    .form_create {
      width: 100%;
      transition: width 1s ease-in;
    }
    .box_table_,
    .form_create {
      transition: flex-basis 1s ease-in-out;
    }
    .form_create {
      background-color: var(--cl_3);
      padding: 1rem;
      .btn_close {
        text-align: right;
        cursor: pointer;
        span {
          background-color: white;
          padding: 0.3rem 0.5rem;
          font-size: var(--fz_smallmax);
        }
      }
      .title {
        text-align: center;
        font-size: var(--fz_medium);
        color: white;
        font-weight: 800;
        padding-bottom: 1rem;
      }
      div {
        p {
          font-size: var(--fz_small);
          text-transform: uppercase;
          font-weight: 700;
          padding: 0.2rem 0;
          color: var(--white);
        }
        textarea {
          width: 100%;
          line-height: 1.2rem;
          padding: 0.7rem 0.5rem;
          border: none;
          outline: none;
          min-height: 10rem;
          border-radius: 0.3rem;
          border: 0.05rem solid var(--shadow-black);
          box-shadow: 0 0 2px var(--shadow-black);

          &:focus {
            border: 1px solid var(--active);
          }
        }
      }
      .btn_submit_noti {
        display: flex;
        padding: 1rem 0;

        justify-content: center;
        button {
          width: 100%;
          padding: 0.5rem 0;
          background-color: var(--cl_4);
          color: white;
          outline: none;
          border: none;
          font-weight: 800;
          border-radius: 0.5rem;
          letter-spacing: 0.1rem;
          box-shadow:
            -2px -2px 6px -2px var(--cl_1),
            2px 2px 2px var(--cl_2);
        }
      }
    }
  }

`;


export default function Notification() {
  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 29);
  const startDate = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0);
  const [dateRange, setDateRange] = useState([startDate, endDate]);
  const { token } = useAdminContext()
  const [type, setType] = useState('')
  const [createActive, setCreateActive] = useState(false)
  const [notification, setNotification] = useState()

  const [, , removeCookie] = useCookies(["token_hospital"]);
  const [page, setPage] = useState({
    page: 0,
    size: 4,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var tokenJwt = jwtDecode(token);

        var filter = {
          idUser: tokenJwt.id,
          type: type,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
          page: page.page,
          size: page.size

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("POST", "notification/getall", token, filter)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setNotification(rs.data.data.content)
          setTotalPage(rs.data.data.totalPages)
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
        setTimeout(() => {
          removeCookie("authorize_token_admin", { path: '/admin_sem4' });
        }, 1000);

      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    }
    finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);

    }
  }, [token, dateRange, removeCookie, page, type])

  useEffect(() => {
    setTimeout(() => {
      fetchData()
    }, 300);

  }, [fetchData]);
  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev, page: value - 1
    }))
  }

  const handleDelete = async (id) => {
    try {

      if (token) {
        var rs = await apiRequestAutherize("GET", `notification/deleted/${id}`, token);
        if (rs?.data && rs.data.status === 200) {
          createNotification("success", "Deleted success", "Success")()
          fetchData()
        } else {
          createNotification("error", rs.data?.message && rs.data.message, "Error")()
        }
      }

    } catch (error) {
      createNotification("error", error.message && error.message, "Error")()
    }
  }



  const [listChecked, setListChecked] = useState([])

  const handleChecked = (id) => {
    setListChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }

  useEffect(() => {
    console.log(listChecked);
  }, [listChecked]);



  const handleDeleteMulti = async () => {
    try {

      if (token) {
        var rs = await apiRequestAutherize("POST", `notification/deletedMulti`, token, { checked: listChecked });
        if (rs?.data && rs.data.status === 200) {
          createNotification("success", rs.data.message, "Success")()
          setListChecked([])
          fetchData()
        } else {
          createNotification("error", rs.data?.message && rs.data.message, "Error")()
        }
      }

    } catch (error) {
      createNotification("error", error.message && error.message, "Error")()
    }
  }

  const handleDeleteAll = async () => {
    try {
      if (token) {
        var tokenJwt = jwtDecode(token);
        var rs = await apiRequestAutherize("GET", `notification/deletedAll/${tokenJwt.id}`, token);
        console.log(rs);
        if (rs?.data && rs.data.status === 200) {
          createNotification("success", rs.data.message, "Success")()
          setListChecked([])
          fetchData()
          setCheckAll(false)
        } else {

          createNotification("error", rs.data?.message && rs.data.message, "Error")()
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [checkAll, setCheckAll] = useState(false)
  return (
    <NotificationPage>
      <LoadingPage isloading={isLoading} />
      <ReactTooltip id="all" place="bottom" effect="solid" />
      <ReactTooltip id="customer" place="bottom" effect="solid" />
      <ReactTooltip id="admin" place="bottom" effect="solid" />
      <div className='sec1'>
        <div className='left'>
          <p>List Notification</p>

        </div>
        <div className='right'>


          <SelectInput multi={false} key={"ono"}
            defaultVl={OptionFilter.find(op => op.value === type)}
            options={OptionFilter}
            fnChangeOption={(e) => { setType(e.value) }} />
          <RangeDateInput defaultValue={dateRange} fnChangeValue={(e) => { setDateRange(e) }} />
          <i class="fa-solid fa-trash-can add_new_button__" onClick={checkAll ? handleDeleteAll : handleDeleteMulti}></i>
        </div>
      </div>
      <div className='sec2' style={{ display: "flex" }}>
        <div className='box_table_' style={{ flexBasis: createActive ? '70%' : '100%' }}>
          <div className='table_container'>
            <table className='table_'>
              <thead>
                <tr>
                  <th><input type='checkbox' checked={checkAll} onChange={() => setCheckAll((prev) => !prev)} /></th>
                  <th>Content</th>
                  <th>Type</th>
                  <th>Create</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notification && notification.length > 0 ? notification.map((item, index) => (
                  <tr key={index}>
                    <td><input type='checkbox' checked={checkAll ? true : listChecked.includes(item.id) ? true : false} onChange={() => handleChecked(item.id)} /></td>
                    <td style={{
                      maxWidth: "300px",


                      WebkitLineClamp: 1,
                      overflow: "hidden",

                      textOverflow: "ellipsis",


                    }}>{item.description}</td>
                    <td>{item.type}</td>
                    <td>{formatDate(item.createDate)}</td>
                    <td><i class="fa-solid fa-trash" style={{ cursor: "pointer" }} onClick={() => handleDelete(item.id)}></i></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Not data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            {totalPage > 0 && (
              <div className='pagination'>
                <button
                  onClick={() => { setPage((prev) => ({ ...prev, page: page.page - 1 })) }}
                  disabled={page.page + 1 === 1}
                >
                  Prev
                </button>
                {renderPagination(page.page + 1, totalPage, handlePage)}
                <button
                  onClick={() => { setPage((prev) => ({ ...prev, page: page.page + 1 })) }}
                  disabled={page.page + 1 === totalPage}
                >
                  Next
                </button>
              </div>

            )}
          </div>
        </div>

      </div>
    </NotificationPage>
  )
}
