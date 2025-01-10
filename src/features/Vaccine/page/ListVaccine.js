import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { status, headerjson, ListVaccinePage, fee } from "../data/DataVaccine"

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
import swal from 'sweetalert';
import TextArea from '../../../shared/component/InputData/TextArea';
import InputComponent from '../../../shared/component/InputData/InputComponent';
import RichTextEditor from '../../../shared/component/InputData/RichTextEditor';

export default function ListVaccine() {
  //datafetch
  const [vaccine, setVaccine] = useState();
  //filter
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    fee: []
  });

  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token_hospital"]);

  const [page, setPage] = useState({
    page: 0,
    size: 9,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAdminContext()
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter]);

  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var f = {
          status: filter.status,
          search: filter.search,
          fee: filter.fee,
          page: page.page,
          size: page.size,
          codehospital: tokenjwt.hospital
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "vaccine/getbyhospital", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setVaccine(rs.data.data.content)
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
  }, [token, filter, page])

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
    "code", "name", "fee", "floor", "zone", "createDate", "status"
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



  const changeStatus = async (id) => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("GET", `vaccine/changestatus/${id}`, token)
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


  const [mocupCreate, setMocupCreate] = useState(false);
  const [mocupEdit, setMocupEdit] = useState(false);
  const [valueForm, setValueForm] = useState({
    id: '',
    name: '',
    code: '',
    floor: null,
    zone: '',
    fee: null,
    description: ''
  })
  const [errorForm, setErrorForm] = useState({
    name: '',
    code: '',
    floor: '',
    zone: '',
    fee: '',
    description: ''
  })

  const hanldeUpdate = async (e) => {
    try {
      e.preventDefault()
      if (errorForm.name !== '' || errorForm.code !== '' || errorForm.zone !== '' || errorForm.floor !== '' || errorForm.fee !== '' || errorForm.description !== '') {
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
          fee: valueForm.fee,
          description: valueForm.description,
          id: valueForm.id,
          hospitalId: tokenjwt.hospitalId,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "vaccine/update", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupEdit(false)
          setValueForm({
            code: '',
            name: '',
            floor: null,
            zone: '',
            fee: null,
            description: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            floor: '',
            zone: '',
            fee: '',
            description: '',

          })
          fetchdata()
          swal("Update", "Update Vaccine Success!", "success");
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
        setErrorForm((prev) => ({ ...prev, floor: 'Floor is required' }));
        valid = false;
      }

      if (valueForm.zone === '') {
        setErrorForm((prev) => ({ ...prev, zone: 'Zone is required' }));
        valid = false;
      }

      if (valueForm.fee === null) {
        setErrorForm((prev) => ({ ...prev, fee: 'Fee is required' }));
        valid = false;
      }

      if (valueForm.description === '') {
        setErrorForm((prev) => ({ ...prev, description: 'Description is required' }));
        valid = false;
      }
      if (errorForm.name !== ''
        || errorForm.code !== ''
        || errorForm.zone !== ''
        || errorForm.floor !== ''
        || errorForm.fee !== ''
        || errorForm.description !== ''
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
          fee: valueForm.fee,
          description: valueForm.description,

          hospitalId: tokenjwt.hospitalId,
          userId: tokenjwt.id,
        }
        var rs = await apiRequestAutherize("post", "vaccine/create", token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          setMocupCreate(false)
          setValueForm({
            code: '',
            name: '',
            floor: null,
            zone: '',
            fee: null,
            description: '',
            id: null
          })
          setErrorForm({
            code: '',
            name: '',
            floor: '',
            zone: '',
            fee: '',
            description: '',

          })
          fetchdata()
          swal("Create", "Create Vaccine Success!", "success");
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
  return (
    <ListVaccinePage>
      <LoadingPage key={"lvc"} isloading={isLoading} />


      <section className='section_filter'>
        <div className='left'>
          <i class="fa-solid fa-plus add_new_button__" onClick={() => setMocupCreate(true)}></i>
          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className='right'>
          <SelectInput
            defaultVl={fee.find(option => option.value === filter.fee)}
            options={fee} multi={false}
            placeholder="Filter by Fee"
            fnChangeOption={(selected) => {
              setFilter((prev) => ({ ...prev, fee: selected.value }));
            }}
          />
          <div>
            <SelectInput key={1}
              defaultVl={status.find(status => status.value === filter.status)}
              multi={false}
              options={status}
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
                  {headerjson &&
                    headerjson.length > 0 &&
                    headerjson.map((item, index) => (
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
              {headerjson &&
                headerjson.length > 0 &&
                headerjson.map((item, index) => (
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
              {vaccine &&
                vaccine.length > 0 ? (
                vaccine.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: filterColumn.includes("code hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.hospitalCode}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("name hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.hospitalName}
                    </td>
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
                        display: filterColumn.includes("fee")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.fee}
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
                        display: filterColumn.includes("description")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <div>
                        <span
                          data-tooltip-id="tooltip" // Tạo ID cho tooltip
                          data-tooltip-content={item.description} // Nội dung của tooltip
                          style={{
                            maxWidth: '200px', // Chiều rộng tối đa cho text
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            cursor: 'pointer',
                          }}
                        >
                          {item.description}
                        </span>
                        <ReactTooltip id="tooltip" place="top" effect="solid" />
                      </div>
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("createDate")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDate(item.createDate)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("updateDate")
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
                      {item.emailUser}
                    </td>

                    <td
                      style={{
                        display: filterColumn.includes("status")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <p onClick={() => changeStatus(item.id)} className={item.status && item.status.toLowerCase() === "active" ? "active" : "deactive"}>{item.status}</p>
                    </td>
                    <td>
                      <div className='list_action'>
                        <Link className='link_tag' to={`/admin/booking/vaccine/${item.code}`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Details"} class="fa-solid fa-eye"></i></Link>
                        <i data-tooltip-id="tooltip"
                          data-tooltip-content={"Edit"} class="fa-solid fa-pen-to-square"
                          onClick={() => {
                            setValueForm({
                              code: item.code,
                              name: item.name,
                              fee: item.fee,
                              floor: item.floor,
                              zone: item.zone,
                              description: item.description,
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
                  <td colSpan={headerjson.length + 1} style={{ textAlign: "center" }}>
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
                fee: null,
                description: '',
                id: null,
                floor: null,
                zone: ''
              })
              setErrorForm({
                code: '',
                name: '',
                fee: '',
                description: '',
                floor: '',
                zone: ''

              })
            }}>X</p>
            <p className='title'>Edit Vaccine</p>
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
              <div className='row_2'>
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

                <InputComponent
                  Textlabel={"Fee"}
                  defaultValue={valueForm.fee}
                  isRequire={true}
                  err={errorForm.fee}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var fee = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      fee: fee
                    }))
                    if (fee.trim() !== '') {

                      if (fee > 10000 && fee < 1000000000) {
                        setErrorForm((prev) => ({
                          ...prev,
                          fee: ''
                        }))
                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          fee: 'Fee betweent [10.000 - 1000000000]'
                        }))
                      }
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        fee: 'Fee is required'
                      }))
                    }

                  }}
                />
              </div>
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
              <RichTextEditor
                Textlabel={"Description"}
                defaultValue={valueForm.description}
                isRequire={true}
                err={errorForm.description}
                typeInput={"Text"}
                fnChange={(value) => {
                  console.log(value);
                  var description = value
                  setValueForm((prev) => ({
                    ...prev,
                    description: description
                  }))
                  if (description.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: 'description is required'
                    }))
                  }

                }}
              />

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
                fee: null,
                description: '',
                id: null,
                floor: null,
                zone: ''
              })
              setErrorForm({
                code: '',
                name: '',
                fee: '',
                description: '',
                floor: '',
                zone: ''

              })
            }}>X</p>
            <p className='title'>Create New Vaccine</p>
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
              <div className='row_2'>
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

                <InputComponent
                  Textlabel={"Fee"}

                  isRequire={true}
                  err={errorForm.fee}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var fee = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      fee: fee
                    }))
                    if (fee.trim() !== '') {

                      if (fee > 10000 && fee < 1000000000) {
                        setErrorForm((prev) => ({
                          ...prev,
                          fee: ''
                        }))
                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          fee: 'Fee betweent [10.000 - 1000000000]'
                        }))
                      }
                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        fee: 'Fee is required'
                      }))
                    }

                  }}
                />
              </div>
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
              <RichTextEditor
                Textlabel={"Description"}
                defaultValue={valueForm.description}
                isRequire={true}
                err={errorForm.description}
                typeInput={"Text"}
                fnChange={(value) => {
                  console.log(value);
                  var description = value
                  setValueForm((prev) => ({
                    ...prev,
                    description: description
                  }))
                  if (description.trim() !== '') {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: ''
                    }))
                  } else {
                    setErrorForm((prev) => ({
                      ...prev,
                      description: 'description is required'
                    }))
                  }

                }}
              />

              <div className='box_btn'>
                <button type='submit'>Create</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </ListVaccinePage>
  );
}
