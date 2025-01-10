import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { headerjson, ListDepartmentPage, statusDeparment } from "../data/DataDepartment"

import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { renderPagination } from '../../../shared/function/Pagination';
import { formatDate } from '../../../shared/function/FomatDate';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { jwtDecode } from 'jwt-decode';
import InputComponent from '../../../shared/component/InputData/InputComponent';
import swal from 'sweetalert';

export default function ListDepartment() {
  //datafetch
  const [department, setDepartment] = useState();
  const [header, setHeader] = useState(headerjson);


  //filter
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });
  const [mocupCreate, setMocupCreate] = useState(false);
  const [mocupEdit, setMocupEdit] = useState(false);
  const [valueForm, setValueForm] = useState({
    id: '',
    name: '',
    code: '',
    floor: null,
    zone: ''
  })
  const [errorForm, setErrorForm] = useState({
    name: '',
    code: '',
    floor: '',
    zone: ''
  })

  const hanldeUpdate = async (e) => {
    try {
      e.preventDefault()
      if (errorForm.name !== '' || errorForm.code !== '' || errorForm.zone !== '' || errorForm.floor !== '') {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var data = {
          name: valueForm.name,
          code: valueForm.code,
          floor: valueForm.floor,
          zone: valueForm.zone,
          id: valueForm.id,
          hospitalId: tokenjwt.hospitalId,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "department/update", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupEdit(false)
          setValueForm({
            code: '',
            name: '',
            floor: null,
            zone: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            floor: '',
            zone: '',

          })
          fetchdata()
          swal("Update", "Update Department Success!", "success");
        } else {
          if (rs?.data?.message === "Duplicate code") {
            setErrorForm((prev) => ({
              ...prev,
              code: `Code is exist`
            }))
          }
          swal("Update", rs.data.message, "error");
        }

      }

    } catch (error) {
      swal("Update", error, "error");
    }
  }


  const handleCreate = async (e) => {
    try {
      e.preventDefault()
      var valid = true;
      if (valueForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: 'Name is required' }));
        valid = false;
      }

      if (valueForm.code === '') {
        setErrorForm((prev) => ({ ...prev, code: 'Code is required' }));
        valid = false;
      }


      if (valueForm.floor === null) {
        setErrorForm((prev) => ({ ...prev, floor: 'floor is required' }));
        valid = false;
      }

      if (valueForm.zone === '') {
        setErrorForm((prev) => ({ ...prev, zone: 'zone is required' }));
        valid = false;
      }
      if (errorForm.name !== ''
        || errorForm.code !== ''
        || errorForm.floor !== ''
        || errorForm.zone !== ''
      ) {
        valid = false;
      }
      if (!valid) {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var data = {
          name: valueForm.name,
          code: valueForm.code,
          floor: valueForm.floor,
          zone: valueForm.zone,
          hospitalId: tokenjwt.hospitalId,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "department/create", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupCreate(false)
          setValueForm({
            code: '',
            name: '',
            floor: null,
            zone: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            floor: '',
            zone: '',

          })
          fetchdata()
          swal("Create", "Create Department Success!", "success");
        } else {
          if (rs?.data?.message === "Duplicate code") {
            setErrorForm((prev) => ({
              ...prev,
              code: `Code is exist`
            }))
          }
          swal("Create", rs.data.message, "error");
        }

      }

    } catch (error) {
      swal("Create", error, "error");
    }
  }


  const changeStatus = async (id) => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `department/changestatus/${id}`, token)
        if (rs && rs.data && rs.data.status === 200) {
          fetchdata()
          createNotification("success", "Change Status Success", "Success")();
        } else {

          createNotification("error", "Change Status Fail", "Fail")();
        }
        console.log(rs);
      }
    } catch (error) {
      createNotification("error", "Change Status Fail", "Fail")();
    }

  }



  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token_hospital"]);

  const [page, setPage] = useState({
    page: 0,
    size: 8,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAdminContext()
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter]);

  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var tokens = jwtDecode(token);
        var f = {
          status: filter.status,
          search: filter.search,
          page: page.page,
          size: page.size,
          codehospital: tokens.hospital
        }

        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "department/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setDepartment(rs.data.data.content)
          setTotalPage(rs.data.data.totalPages)
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()

      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
        setTimeout(() => {
          removeCookie("token_hospital", { path: '/admin_hospital' });
        }, 1000);

      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token, filter, page, removeCookie])

  useEffect(() => {
    setTimeout(() => {
      fetchdata();
    }, 300);
  }, [fetchdata]);

  const handlePage = (value) => {
    console.log(value);
    setPage((prev) => ({
      ...prev, page: value - 1
    }))
  }

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


  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "code", "name", "floor", "zone", "doctorCount", "create", "status"
  ]);
  const handleFilterColumn = (e) => {
    const value = e.target.value;
    console.log(value);
    if (filterColumn.includes(value)) {
      setFilterColumn(filterColumn.filter((item) => item !== value));
    } else {
      setFilterColumn([...filterColumn, value]);
    }
  };

  return (
    <ListDepartmentPage>
      <LoadingPage key={"ldpm"} isloading={isLoading} />


      <section className='section_filter'>
        <div className='left'>
          <i class="fa-solid fa-plus add_new_button__" onClick={() => setMocupCreate(true)}></i>
          <SearchInput fnChangeCallback={handelChangeSearch} />

        </div>
        <div className='right'>

          <div>
            <SelectInput key={1}
              defaultVl={statusDeparment.find(status => status.value === filter.status)}
              multi={false}
              options={statusDeparment}
              fnChangeOption={(selected) => {
                setFilter((prev) => ({ ...prev, status: selected.value }));
              }}
            />
          </div>
          <div className="r_b_filter_column">
            <div
              className="b_filter_column"
              onClick={() => {
                setShowFilterColumn((prev) => !prev);
              }}
            >
              <i className="fa-brands fa-slack"></i>
            </div>
            {showFilterColumn && (
              <div className="overlay">
                <div className="triangle"></div>
                <div className="list_action">
                  {header &&
                    header.length > 0 &&
                    header.map((item, index) => (
                      <div key={index}>
                        <input
                          type="checkbox"
                          checked={filterColumn.includes(item)}
                          value={item}
                          onChange={handleFilterColumn}
                        />
                        <label>{item}</label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              {header &&
                header.length > 0 &&
                header.map((item, index) => (
                  <th
                    className={item}
                    key={index}
                    style={{
                      display: filterColumn.includes(item)
                        ? "table-cell"
                        : "none",
                    }}
                  >
                    {item}
                  </th>
                ))}
              <th>Action</th>
            </thead>
            <tbody>
              {department &&
                department.length > 0 ? (
                department.map((item, index) => (
                  <tr key={index}>

                    <td
                      style={{
                        display: filterColumn.includes("code")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.code}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("name")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("floor")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.floor}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("zone")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.zone}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("doctorCount")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.doctorCount}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("create")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.createDate)}
                    </td>

                    <td
                      style={{
                        display: filterColumn.includes("update")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.updateDate)}
                    </td>

                    <td
                      style={{
                        display: filterColumn.includes("last edit")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.userId}
                    </td>

                    <td
                      style={{
                        display: filterColumn.includes("status")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <p className={item.status && item.status.toLowerCase() === "active" ? "active" : "deactive"} onClick={() => changeStatus(item.id)}>{item.status}</p>
                    </td>
                    <td>
                      <div className='list_action'>

                        <Link className='link_tag' to={`/admin/department/${item.code}/${item.id}/doctor`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Doctor"} class="fa-solid fa-user-doctor"></i></Link>

                        <i data-tooltip-id="tooltip"
                          data-tooltip-content={"Edit"}
                          class="fa-solid fa-pen-to-square"
                          onClick={() => {
                            setValueForm({
                              code: item.code,
                              name: item.name,
                              floor: item.floor,
                              zone: item.zone,
                              id: item.id
                            })
                            setMocupEdit(true)
                          }}
                        ></i>
                      </div>

                      <ReactTooltip id="tooltip" place="top" effect="solid" />
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={header.length + 1} style={{ textAlign: "center" }}>
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
      </section>
      {mocupEdit && (
        <div className='mocup_edit_box'>
          <div className='container'>
            <p className='close' onClick={() => {
              setMocupEdit(false)
              setValueForm({
                code: '',
                name: '',
                floor: null,
                zone: '',
                id: null
              })
              setErrorForm({
                code: '',
                name: '',
                floor: '',
                zone: '',

              })
            }}>X</p>
            <p className='title'>Edit Department</p>
            <form onSubmit={hanldeUpdate}>
              <InputComponent
                Textlabel={"Name"}
                defaultValue={valueForm.name}
                isRequire={true}
                typeInput={"Text"}
                err={errorForm.name}
                fnChange={(value) => {
                  var name = value.target.value.trim()
                  setValueForm((prev) => ({
                    ...prev,
                    name: name
                  }))
                  if (name.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: 'Name is required'
                    }))
                  }

                }}
                Textplacehoder={"Input name department.."}
              />
              <InputComponent
                Textlabel={"Code"}
                defaultValue={valueForm.code}
                err={errorForm.code}
                isRequire={true}
                typeInput={"Text"}
                fnChange={(value) => {
                  var code = value.target.value.trim()
                  var tokens = jwtDecode(token);
                  setValueForm((prev) => ({
                    ...prev,
                    code: code
                  }))

                  if (code.trim() !== '') {
                    if (code.trim().startsWith(tokens.hospital + "-")) {
                      setErrorForm((prev) => ({
                        ...prev,
                        code: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        code: `Code is StartWith ${tokens.hospital}-`
                      }))

                    }

                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      code: `Code is required`
                    }))

                  }

                }}
              />
              <div className='row_2'>
                <InputComponent
                  Textlabel={"Floor"}
                  defaultValue={valueForm.floor}
                  isRequire={true}
                  err={errorForm.floor}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var floor = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      floor: floor
                    }))
                    if (floor.trim() !== '') {
                      setErrorForm((prev) => ({
                        ...prev,
                        floor: ''
                      }))
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        floor: 'Floor is required'
                      }))
                    }

                  }}
                />
                <InputComponent
                  Textlabel={"Zone"}
                  defaultValue={valueForm.zone}
                  isRequire={true}
                  err={errorForm.zone}
                  typeInput={"Text"}
                  fnChange={(value) => {
                    var zone = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      zone: zone
                    }))
                    if (zone.trim() !== '') {
                      setErrorForm((prev) => ({
                        ...prev,
                        zone: ''
                      }))
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        zone: 'Zone is required'
                      }))
                    }

                  }}
                />
              </div>
              <div className='box_btn'>
                <button type='submit'>Update</button>
              </div>

            </form>
          </div>
        </div>
      )}


      {mocupCreate && (
        <div className='mocup_edit_box'>
          <div className='container'>
            <p className='close' onClick={() => {
              setMocupCreate(false)
              setValueForm({
                code: '',
                name: '',
                floor: null,
                zone: '',
                id: null
              })
              setErrorForm({
                code: '',
                name: '',
                floor: '',
                zone: '',

              })
            }}>X</p>
            <p className='title'>Create New Department</p>
            <form onSubmit={handleCreate}>
              <InputComponent
                Textlabel={"Name"}

                isRequire={true}
                typeInput={"Text"}
                err={errorForm.name}
                fnChange={(value) => {
                  var name = value.target.value.trim()
                  setValueForm((prev) => ({
                    ...prev,
                    name: name
                  }))
                  if (name.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      name: 'Name is required'
                    }))
                  }

                }}

              />
              <InputComponent
                Textlabel={"Code"}

                err={errorForm.code}
                isRequire={true}
                typeInput={"Text"}
                fnChange={(value) => {
                  var code = value.target.value.trim()
                  var tokens = jwtDecode(token);
                  setValueForm((prev) => ({
                    ...prev,
                    code: code
                  }))

                  if (code.trim() !== '') {
                    if (code.trim().startsWith(tokens.hospital + "-")) {
                      setErrorForm((prev) => ({
                        ...prev,
                        code: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        code: `Code is StartWith ${tokens.hospital}-`
                      }))

                    }

                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      code: `Code is required`
                    }))

                  }

                }}
              />
              <div className='row_2'>
                <InputComponent
                  Textlabel={"Floor"}

                  isRequire={true}
                  err={errorForm.floor}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var floor = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      floor: floor
                    }))
                    if (floor.trim() !== '') {
                      setErrorForm((prev) => ({
                        ...prev,
                        floor: ''
                      }))
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        floor: 'Floor is required'
                      }))
                    }

                  }}
                />
                <InputComponent
                  Textlabel={"Zone"}

                  isRequire={true}
                  err={errorForm.zone}
                  typeInput={"Text"}
                  fnChange={(value) => {
                    var zone = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      zone: zone
                    }))
                    if (zone.trim() !== '') {
                      setErrorForm((prev) => ({
                        ...prev,
                        zone: ''
                      }))
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        zone: 'Zone is required'
                      }))
                    }

                  }}
                />
              </div>
              <div className='box_btn'>
                <button type='submit'>Create</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </ListDepartmentPage>
  );
}
