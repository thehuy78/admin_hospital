import React, { useCallback, useEffect, useState } from "react";
import { EventPage, status } from "../data/EventData";
import LoadingPage from "../../../shared/Config/LoadingPage";
import SearchInput from "../../../shared/component/InputFilter/SearchInput";
import { Link } from "react-router-dom";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { renderPagination } from "../../../shared/function/Pagination";
import { formatDate } from "../../../shared/function/FomatDate";
import SelectInput from "../../../shared/component/InputFilter/SelectInput";
import { createNotification } from "../../../shared/Config/Notifications";
import { useCookies } from "react-cookie";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import swal from 'sweetalert';
import RichTextEditor from "../../../shared/component/InputData/RichTextEditor"
import { Tooltip as ReactTooltip } from 'react-tooltip';
import InputComponent from "../../../shared/component/InputData/InputComponent"
import { jwtDecode } from "jwt-decode";
export default function EventList() {
  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState([]);
  const [, , removeCookie] = useCookies(["authorize_token_admin"]);
  const [page, setPage] = useState({
    page: 0,
    size: 7,
  });
  const [filter, setFilter] = useState({
    search: "",
    status: "active"
  })
  const [totalPage, setTotalPage] = useState(0);
  const { token } = useAdminContext();
  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev,
      page: value - 1,
    }));
  };
  const [timeoutId, setTimeoutId] = useState(null);
  const handelChangeSearch = (e) => {
    const newValue = e.target.value;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const handler = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search: newValue }));
    }, 1000);
    setTimeoutId(handler);
  };
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var f = {
          status: filter.status,
          search: filter.search,
          page: page.page,
          size: page.size,

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "eventVaccine/getAll", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setEventList(rs.data.data.content)
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
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [page, filter, token, removeCookie],);
  useEffect(() => {
    fetchData()
  }, [fetchData]);


  return (
    <EventPage>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <section className="section_filter">
        <div className="left">

          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className="right">

        </div>
      </section>
      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              <th>Event Code</th>
              <th>Event Name</th>
              <th>Create Date</th>

              <th>Action</th>
            </thead>
            <tbody>
              {eventList && eventList.length > 0 ? (
                eventList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>

                    <td>{formatDate(item.createDate)}</td>



                    <td>
                      <div className='list_action'>
                        <Link className='link_tag' to={`/admin/event/details/${item.id}`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Details"} class="fa-solid fa-eye"></i></Link>

                      </div>
                      <ReactTooltip id="tooltip" place="top" effect="solid" />
                    </td>
                  </tr>
                ))
              ) : (
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
            <div className="pagination">
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page - 1 }));
                }}
                disabled={page.page + 1 === 1}
              >
                Prev
              </button>
              {renderPagination(page.page + 1, totalPage, handlePage)}
              <button
                onClick={() => {
                  setPage((prev) => ({ ...prev, page: page.page + 1 }));
                }}
                disabled={page.page + 1 === totalPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

    </EventPage>
  );
}
