import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { headerjson, ListDoctorPage, fee, leveldoctor, timeWork, gender, genderForm, leveldoctorForm, timeWorkForm, workdayForm } from "../data/DataDoctor"
import SearchInput from '../../../shared/component/InputFilter/SearchInput';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequestAutherize, apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { renderPagination } from '../../../shared/function/Pagination';
import FormatWorkday from '../../../shared/function/FomatWorkday';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';
import GetImageFireBase from '../../../shared/function/GetImageFireBase';
import { jwtDecode } from 'jwt-decode';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import swal from 'sweetalert';
import SelectOption from '../../../shared/component/InputData/SelectOption';
import TextArea from '../../../shared/component/InputData/TextArea';
import InputComponent from '../../../shared/component/InputData/InputComponent';
import InputImageCrop from '../../../shared/component/InputData/InputImageCrop';
import InputImageAvatar from '../../../shared/component/InputData/InputImageAvatar';
export default function ListDoctor() {
  //datafetch
  const [doctor, setDoctor] = useState();
  const [header, setHeader] = useState(headerjson);
  //filter
  const [filter, setFilter] = useState({
    level: '',
    timeWork: '',
    gender: '',
    search: '',
    fee: []

  });
  const [, , removeCookie] = useCookies(["token_hospital"]);
  const navigate = useNavigate()
  const { code, id } = useParams()
  const [page, setPage] = useState({
    page: 0,
    size: 6,
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
        var hospitalCode = jwtDecode(token).hospital
        var f = {
          level: filter.level,
          timeWork: filter.timeWork,
          gender: filter.gender,
          fee: filter.fee,
          search: filter.search,
          page: page.page,
          size: page.size,
          codehospital: hospitalCode,
          codedepartment: code
        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "doctor/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setDoctor(rs.data.data.content)
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
  }, [token, filter, page, code, removeCookie])


  useEffect(() => {

    fetchdata();

  }, [fetchdata, filter, page, code]);

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



  const [showFilterOption, setShowFilterOption] = useState(false);
  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "name",
    "avatar",
    "daywork",
    "timework",
    "level",
    "gender",
    "fee",
    "status",
    "room",
    "pattient",
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
        var rs = await apiRequestAutherize("GET", `doctor/changestatus/${id}`, token)
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
    level: '',
    gender: '',
    avatar: '',
    dayWork: [],
    timeWork: [],
    room: null,
    patient: null,
    avatarFile: null,
    fee: null,

  })
  const [errorForm, setErrorForm] = useState({
    name: '',
    code: '',
    level: '',
    gender: '',
    avatar: '',
    dayWork: '',
    timeWork: '',
    room: '',
    patient: '',
    fee: '',
  })


  const handleCreate = async (e) => {
    try {
      e.preventDefault()
      var valid = true;
      if (valueForm.dayWork.length <= 0) {
        setErrorForm((prev) => ({ ...prev, dayWork: 'dayWork is required' }));
        valid = false;
      }
      if (valueForm.timeWork.length <= 0) {
        setErrorForm((prev) => ({ ...prev, timeWork: 'timeWork is required' }));
        valid = false;
      }
      if (valueForm.room === null) {
        setErrorForm((prev) => ({ ...prev, room: 'room is required' }));
        valid = false;
      }
      if (valueForm.patient === null) {
        setErrorForm((prev) => ({ ...prev, patient: 'patient is required' }));
        valid = false;
      }

      if (valueForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: 'Name is required' }));
        valid = false;
      }
      if (valueForm.code === '') {
        setErrorForm((prev) => ({ ...prev, code: 'Code is required' }));
        valid = false;
      }

      if (valueForm.level === '') {
        setErrorForm((prev) => ({ ...prev, level: 'level is required' }));
        valid = false;
      }

      if (valueForm.gender === '') {
        setErrorForm((prev) => ({ ...prev, gender: 'gender is required' }));
        valid = false;
      }

      if (valueForm.fee === null) {
        setErrorForm((prev) => ({ ...prev, fee: 'Fee is required' }));
        valid = false;
      }

      if (valueForm.avatarFile === null) {
        setErrorForm((prev) => ({ ...prev, avatar: 'avatar is required' }));
        valid = false;
      }
      if (
        errorForm.name !== ''
        || errorForm.code !== ''
        || errorForm.level !== ''
        || errorForm.gender !== ''
        || errorForm.avatar !== ''
        || errorForm.dayWork !== ''
        || errorForm.timeWork !== ''
        || errorForm.room !== ''
        || errorForm.patient !== ''
        || errorForm.fee !== ''
      ) {
        valid = false;
      }
      console.log(valueForm.dayWork);
      if (!valid) {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      setIsLoading(true)
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var sort = sortWorkdays(valueForm.dayWork);
        var workday = sort[0] + '';
        if (sort.length > 1) {
          for (let index = 1; index < sort.length; index++) {
            workday += "-" + sort[index];
          }
        }

        var sortTimeWork = sortTimeWorks(valueForm.timeWork);
        var timework = sortTimeWork[0] + '';
        if (sortTimeWork.length > 1) {
          for (let index = 1; index < sortTimeWork.length; index++) {
            timework += ";" + sortTimeWork[index];
          }
        }
        var doctor = new FormData();

        doctor.append("code", valueForm.code)
        doctor.append("name", valueForm.name)
        doctor.append("workDay", workday)
        doctor.append("timeWork", timework)
        doctor.append("level", valueForm.level)
        doctor.append("gender", valueForm.gender)
        doctor.append("fee", valueForm.fee)
        doctor.append("room", valueForm.room)
        doctor.append("patients", valueForm.patient)
        doctor.append("departmentId", id)
        doctor.append("hospitalId", tokenjwt.hospitalId)
        doctor.append("userId", tokenjwt.id)
        if (valueForm.avatarFile !== null) {
          doctor.append("avatar", valueForm.avatarFile);
        }

        var rs = await apiRequestAutherizeForm("post", "doctor/create", token, doctor)
        console.log(rs);
        setIsLoading(false)
        if (rs && rs.data && rs.data.status === 200) {
          setMocupCreate(false)
          setValueForm({
            id: '',
            name: '',
            code: '',
            level: '',
            gender: '',
            avatar: '',
            dayWork: [],
            timeWork: [],
            room: null,
            patient: null,
            avatarFile: null,
            fee: null,
          })
          setErrorForm({
            name: '',
            code: '',
            level: '',
            gender: '',
            avatar: '',
            dayWork: '',
            timeWork: '',
            room: '',
            patient: '',
            fee: '',

          })
          fetchdata()
          swal("Create", "Create Doctor Success!", "success");
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
      swal("Create", "errr", "error");
    } finally {
      setIsLoading(false)
    }
  }



  const handleUpdate = async (e) => {
    try {
      e.preventDefault()
      var valid = true;
      if (valueForm.dayWork.length <= 0) {
        setErrorForm((prev) => ({ ...prev, dayWork: 'dayWork is required' }));
        valid = false;
      }
      if (valueForm.timeWork.length <= 0) {
        setErrorForm((prev) => ({ ...prev, timeWork: 'timeWork is required' }));
        valid = false;
      }
      if (valueForm.room === null) {
        setErrorForm((prev) => ({ ...prev, room: 'room is required' }));
        valid = false;
      }
      if (valueForm.patient === null) {
        setErrorForm((prev) => ({ ...prev, patient: 'patient is required' }));
        valid = false;
      }

      if (valueForm.name === '') {
        setErrorForm((prev) => ({ ...prev, name: 'Name is required' }));
        valid = false;
      }
      if (valueForm.code === '') {
        setErrorForm((prev) => ({ ...prev, code: 'Code is required' }));
        valid = false;
      }

      if (valueForm.level === '') {
        setErrorForm((prev) => ({ ...prev, level: 'level is required' }));
        valid = false;
      }

      if (valueForm.gender === '') {
        setErrorForm((prev) => ({ ...prev, gender: 'gender is required' }));
        valid = false;
      }

      if (valueForm.fee === null) {
        setErrorForm((prev) => ({ ...prev, fee: 'Fee is required' }));
        valid = false;
      }

      if (valueForm.avatarFile === null && valueForm.avatar === "") {
        setErrorForm((prev) => ({ ...prev, avatar: 'avatar is required' }));
        valid = false;
      }
      if (
        errorForm.name !== ''
        || errorForm.code !== ''
        || errorForm.level !== ''
        || errorForm.gender !== ''
        || errorForm.avatar !== ''
        || errorForm.dayWork !== ''
        || errorForm.timeWork !== ''
        || errorForm.room !== ''
        || errorForm.patient !== ''
        || errorForm.fee !== ''
      ) {
        valid = false;
      }
      console.log(valueForm.dayWork);
      if (!valid) {
        swal("Validation", "Data invalid!", "error");
        return;
      }
      setIsLoading(true)
      if (token) {
        var tokenjwt = jwtDecode(token)
        console.log(tokenjwt);
        var sort = sortWorkdays(valueForm.dayWork);
        var workday = sort[0] + '';
        if (sort.length > 1) {
          for (let index = 1; index < sort.length; index++) {
            workday += "-" + sort[index];
          }
        }
        var sortTimeWork = sortTimeWorks(valueForm.timeWork);
        var timework = sortTimeWork[0] + '';
        if (sortTimeWork.length > 1) {
          for (let index = 1; index < sortTimeWork.length; index++) {
            timework += ";" + sortTimeWork[index];
          }
        }
        var doctor = new FormData();
        doctor.append("id", valueForm.id)
        doctor.append("code", valueForm.code)
        doctor.append("name", valueForm.name)
        doctor.append("workDay", workday)
        doctor.append("timeWork", timework)
        doctor.append("level", valueForm.level)
        doctor.append("gender", valueForm.gender)
        doctor.append("fee", valueForm.fee)
        doctor.append("room", valueForm.room)
        doctor.append("patients", valueForm.patient)
        doctor.append("departmentId", id)
        doctor.append("hospitalId", tokenjwt.hospitalId)
        doctor.append("userId", tokenjwt.id)
        if (valueForm.avatarFile !== null) {
          doctor.append("avatar", valueForm.avatarFile);
        }
        console.log(doctor);
        var rs = await apiRequestAutherizeForm("post", "doctor/update", token, doctor)
        console.log(rs);
        setIsLoading(false)
        if (rs && rs.data && rs.data.status === 200) {
          setMocupEdit(false)
          setValueForm({
            id: '',
            name: '',
            code: '',
            level: '',
            gender: '',
            avatar: '',
            dayWork: [],
            timeWork: [],
            room: null,
            patient: null,
            avatarFile: null,
            fee: null,
          })
          setErrorForm({
            name: '',
            code: '',
            level: '',
            gender: '',
            avatar: '',
            dayWork: '',
            timeWork: '',
            room: '',
            patient: '',
            fee: '',

          })
          fetchdata()
          swal("Update", "Update Doctor Success!", "success");
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
      console.log(error);
      swal("Update", "errr", "error");
    } finally {
      setIsLoading(false)
    }
  }


  const sortWorkdays = (workdays) => {
    const weekdaysOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    workdays.sort((a, b) => weekdaysOrder.indexOf(a) - weekdaysOrder.indexOf(b));

    return workdays;
  }

  const sortTimeWorks = (timework) => {
    const timeworkOrder = [
      "05:00-06:00", "05:30-06:30", "06:00-07:00", "06:30-07:30", "07:00-08:00", "07:30-08:30",
      "08:00-09:00", "08:30-09:30", "09:00-10:00", "09:30-10:30", "10:00-11:00", "10:30-11:30",
      "11:00-12:00", "12:30-13:30", "13:00-14:00", "13:30-14:30", "14:00-15:00", "14:30-15:30",
      "15:00-16:00", "15:30-16:30", "16:00-17:00", "16:30-17:30", "17:00-18:00", "18:30-19:30"];
    timework.sort((a, b) => timeworkOrder.indexOf(a) - timeworkOrder.indexOf(b));

    return timework;
  }
  return (
    <ListDoctorPage>
      <LoadingPage key={"ldt"} isloading={isLoading} />
      <section className='brums_nav'>
        {doctor && doctor.length > 0 ? (
          <>

            <span>{doctor[0].departmentName}</span>
            <i className="fa-solid fa-angle-right"></i>
            <span>List Doctor</span>
          </>
        ) : (
          <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>
        )}
      </section>


      <section className='section_filter'>
        <div className='left'>
          <i class="fa-solid fa-plus add_new_button__" onClick={() => setMocupCreate(true)}></i>
          <SearchInput fnChangeCallback={handelChangeSearch} />
        </div>
        <div className='right'>
          <div className='box_filter_option_conponent'>
            <div className='filter_option' onClick={() => {
              setShowFilterOption(prev => !prev);
            }}>
              <i className="fa-solid fa-filter"></i>
              <p>Filter Options</p>
            </div>
            {
              showFilterOption && (
                <div className="list_option">
                  <span className='triangle'></span>
                  <div className='container_list_option'>
                    <div className='item'>
                      <span>Gender</span>
                      <SelectInput
                        defaultVl={gender.find(option => option.value === filter.gender)}
                        options={gender} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, gender: selected.value }));
                        }}
                      />
                    </div>
                    {/* <div className='item'>
                      <span>TimeWork</span>
                      <SelectInput
                        defaultVl={timeWork.find(option => option.value === filter.timeWork)}
                        options={timeWork} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, timeWork: selected.value }));
                        }}
                      />
                    </div> */}
                    <div className='item'>
                      <span>Fee</span>
                      <SelectInput
                        defaultVl={fee.find(option => option.value === filter.fee)}
                        options={fee} multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, fee: selected.value }));
                        }}
                      />
                    </div>
                    <div className='item'>
                      <span>Degee</span>
                      <SelectInput key={1}
                        defaultVl={leveldoctor.find(type => type.value === filter.level)}
                        multi={false}
                        options={leveldoctor}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, level: selected.value }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            }

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
              {doctor &&
                doctor.length > 0 ? (
                doctor.map((item, index) => (
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
                        display: filterColumn.includes("avatar")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <div style={{ width: "60px", margin: "auto" }}>
                        <img style={{ width: "100%", aspectRatio: "1/1", borderRadius: "50%" }} alt='' src={GetImageFireBase(item.avatar)} />
                      </div>

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
                        display: filterColumn.includes("daywork")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {FormatWorkday(item.workDay)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("timework")
                          ? "table-cell"
                          : "none",

                      }}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={item.timeWork.split(";").join(" ")}
                    >
                      <p
                        style={{
                          maxWidth: '200px', // Chiều rộng tối đa cho text
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'inline-block',
                          cursor: 'pointer',
                        }}
                      >
                        {item.timeWork.split(";").join(" ")}
                      </p>


                    </td>
                    <ReactTooltip id="timework" place="top" effect="solid" />
                    <td
                      style={{
                        display: filterColumn.includes("level")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.level}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("gender")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.gender}
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
                        display: filterColumn.includes("room")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.room}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("pattient")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.patients}
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
                        <Link className='link_tag' to={`/admin/booking/doctor/${item.code}`}><i data-tooltip-id="tooltip"
                          data-tooltip-content={"View Details"} class="fa-solid fa-eye"></i></Link>
                        <i data-tooltip-id="tooltip"
                          data-tooltip-content={"Edit"} class="fa-solid fa-pen-to-square"
                          onClick={() => {
                            setMocupEdit(true)
                            setValueForm({
                              id: item.id,
                              name: item.name,
                              code: item.code,
                              level: item.level,
                              gender: item.gender,
                              avatar: item.avatar,
                              dayWork: item.workDay.split("-"),
                              timeWork: item.timeWork.split(";"),
                              room: item.room,
                              patient: item.patients,
                              avatarFile: null,
                              fee: item.fee,
                            })
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
          <div className='container' style={{ maxWidth: "900px" }}>
            <p className='close' onClick={() => {
              setMocupEdit(false)
              setValueForm({
                id: '',
                name: '',
                code: '',
                level: '',
                gender: '',
                avatar: '',
                dayWork: '',
                timeWork: '',
                room: null,
                patient: null,
                avatarFile: null,
                fee: null,
              })
              setErrorForm({
                name: '',
                code: '',
                level: '',
                gender: '',
                avatar: '',
                dayWork: '',
                timeWork: '',
                room: '',
                patient: '',
                fee: '',
              })
            }}>X</p>
            <p className='title'>Update Doctor</p>
            <form onSubmit={handleUpdate}>
              <div className='row_73'>
                <div>
                  <InputComponent Textlabel={"Name"}
                    isRequire={true}
                    typeInput={"Text"}
                    defaultValue={valueForm.name}
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

                    }
                    }
                  />
                  <div className='row_2'>
                    <SelectOption
                      Textlabel={"Work Day"}
                      options={workdayForm}
                      multi={true}
                      defaultVl={workdayForm.filter(type => valueForm.dayWork.includes(type.value))}
                      isRequire={true}
                      nameLabel={"label"}
                      nameValue={"value"}
                      err={errorForm.dayWork}
                      fnChangeOption={(value) => {
                        console.log(value);
                        setValueForm((prev) => ({
                          ...prev,
                          dayWork: value ? value.map(option => option.value) : []
                        }))
                        if (value.length > 0) {
                          setErrorForm((prev) => ({
                            ...prev,
                            dayWork: ''
                          }))
                        } else {
                          setErrorForm((prev) => ({
                            ...prev,
                            dayWork: 'Work Day is Required'
                          }))
                        }


                      }}
                    />
                    <SelectOption
                      Textlabel={"Time Work"}
                      options={timeWorkForm}
                      multi={true}
                      defaultVl={timeWorkForm.filter(type => valueForm.timeWork.includes(type.value))}
                      isRequire={true}
                      nameLabel={"label"}
                      nameValue={"value"}
                      err={errorForm.timeWork}
                      fnChangeOption={(value) => {
                        setValueForm((prev) => ({
                          ...prev,
                          timeWork: value ? value.map(option => option.value) : []
                        }))
                        if (value.length > 0) {
                          setErrorForm((prev) => ({
                            ...prev,
                            timeWork: ''
                          }))
                        } else {
                          setErrorForm((prev) => ({
                            ...prev,
                            timeWork: 'Time Work is Required'
                          }))
                        }


                      }}
                    />
                  </div>
                </div>
                <div className='b_img_'>
                  <InputImageAvatar
                    Textlabel={"Avatar"}
                    defaultImg={valueForm.avatar}
                    isRequire={true}
                    aspectWH={1 / 1}
                    err={errorForm.avatar}
                    fnChange={(value) => {
                      setValueForm((prev) => ({
                        ...prev,
                        avatarFile: value
                      }))
                      if (value) {
                        setErrorForm((prev) => ({
                          ...prev,
                          avatar: ""
                        }))
                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          avatar: "Avatar is required"
                        }))
                      }
                    }}
                  />
                </div>
              </div>

              <div className='row_3'>
                <InputComponent
                  Textlabel={"Code"}
                  defaultValue={valueForm.code}
                  err={errorForm.code}
                  isRequire={true}
                  typeInput={"Text"}
                  fnChange={(value) => {
                    var codeS = value.target.value.trim()

                    setValueForm((prev) => ({
                      ...prev,
                      code: codeS
                    }))

                    if (codeS.trim() !== '') {
                      if (codeS.trim().startsWith(code + "-")) {
                        setErrorForm((prev) => ({
                          ...prev,
                          code: ''
                        }))

                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          code: `Code is StartWith ${code}-`
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
                <SelectOption
                  Textlabel={"Degee"}
                  options={leveldoctorForm}
                  multi={false}
                  defaultVl={leveldoctorForm.find((op) => op.value.toLowerCase() === valueForm.level.toLowerCase())}
                  isRequire={true}
                  nameLabel={"label"}
                  nameValue={"value"}
                  err={errorForm.level}
                  fnChangeOption={(value) => {
                    setValueForm((prev) => ({
                      ...prev,
                      level: value.value
                    }))
                    setErrorForm((prev) => ({
                      ...prev,
                      level: ''
                    }))

                  }}
                />
                <SelectOption
                  Textlabel={"Gender"}
                  options={genderForm}
                  defaultVl={genderForm.find((op) => op.value.toLowerCase() === valueForm.gender.toLowerCase())}
                  multi={false}
                  isRequire={true}
                  nameLabel={"label"}
                  nameValue={"value"}
                  err={errorForm.gender}
                  fnChangeOption={(value) => {
                    setValueForm((prev) => ({
                      ...prev,
                      gender: value.value
                    }))
                    setErrorForm((prev) => ({
                      ...prev,
                      gender: ''
                    }))

                  }}
                />


              </div>
              <div className='row_3'>
                <InputComponent
                  Textlabel={"Room"}
                  defaultValue={valueForm.room}
                  isRequire={true}
                  err={errorForm.room}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var room = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      room: room
                    }))
                    if (room.trim() > 0) {


                      setErrorForm((prev) => ({
                        ...prev,
                        room: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        room: 'room is required'
                      }))
                    }

                  }}
                />


                <InputComponent
                  Textlabel={"Patient"}
                  defaultValue={valueForm.patient}
                  isRequire={true}
                  err={errorForm.patient}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var patient = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      patient: patient
                    }))
                    if (patient.trim() > 0) {


                      setErrorForm((prev) => ({
                        ...prev,
                        patient: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        patient: 'patient is required'
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




              <div className='box_btn'>
                <button type='submit'>Update</button>
              </div>

            </form>
          </div>
        </div>
      )}

      {mocupCreate && (
        <div className='mocup_edit_box'>
          <div className='container' style={{ maxWidth: "900px" }}>
            <p className='close' onClick={() => {
              setMocupCreate(false)
              setValueForm({
                id: '',
                name: '',
                code: '',
                level: '',
                gender: '',
                avatar: '',
                dayWork: [],
                timeWork: [],
                room: null,
                patient: null,
                avatarFile: null,
                fee: null,
              })
              setErrorForm({
                name: '',
                code: '',
                level: '',
                gender: '',
                avatar: '',
                dayWork: '',
                timeWork: '',
                room: '',
                patient: '',
                fee: '',
              })
            }}>X</p>
            <p className='title'>Create New Doctor</p>
            <form onSubmit={handleCreate}>
              <div className='row_73'>
                <div>
                  <InputComponent Textlabel={"Name"}
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

                    }
                    }
                  />
                  <div className='row_2'>
                    <SelectOption
                      Textlabel={"Work Day"}
                      options={workdayForm}
                      multi={true}
                      isRequire={true}
                      nameLabel={"label"}
                      nameValue={"value"}
                      err={errorForm.dayWork}
                      fnChangeOption={(value) => {
                        console.log(value);
                        setValueForm((prev) => ({
                          ...prev,
                          dayWork: value ? value.map(option => option.value) : []
                        }))
                        if (value.length > 0) {
                          setErrorForm((prev) => ({
                            ...prev,
                            dayWork: ''
                          }))
                        } else {
                          setErrorForm((prev) => ({
                            ...prev,
                            dayWork: 'Work Day is Required'
                          }))
                        }


                      }}
                    />
                    <SelectOption
                      Textlabel={"Time Work"}
                      options={timeWorkForm}
                      multi={true}

                      isRequire={true}
                      nameLabel={"label"}
                      nameValue={"value"}
                      err={errorForm.timeWork}
                      fnChangeOption={(value) => {
                        setValueForm((prev) => ({
                          ...prev,
                          timeWork: value ? value.map(option => option.value) : []
                        }))
                        if (value.length > 0) {
                          setErrorForm((prev) => ({
                            ...prev,
                            timeWork: ''
                          }))
                        } else {
                          setErrorForm((prev) => ({
                            ...prev,
                            timeWork: 'Time Work is Required'
                          }))
                        }

                      }}
                    />
                  </div>
                </div>
                <div className='b_img_'>
                  <InputImageAvatar
                    Textlabel={"Avatar"}
                    isRequire={true}
                    aspectWH={1 / 1}
                    err={errorForm.avatar}
                    fnChange={(value) => {
                      setValueForm((prev) => ({
                        ...prev,
                        avatarFile: value
                      }))
                      if (value) {
                        setErrorForm((prev) => ({
                          ...prev,
                          avatar: ""
                        }))
                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          avatar: "Avatar is required"
                        }))
                      }
                    }}
                  />
                </div>
              </div>

              <div className='row_3'>
                <InputComponent
                  Textlabel={"Code"}
                  // defaultValue={code + "-"}
                  err={errorForm.code}
                  isRequire={true}
                  typeInput={"Text"}
                  fnChange={(value) => {
                    var codeS = value.target.value.trim()
                    var tokens = jwtDecode(token);
                    setValueForm((prev) => ({
                      ...prev,
                      code: codeS
                    }))

                    if (codeS.trim() !== '') {
                      if (codeS.trim().startsWith(code + "-")) {
                        setErrorForm((prev) => ({
                          ...prev,
                          code: ''
                        }))

                      } else {
                        setErrorForm((prev) => ({
                          ...prev,
                          code: `Code is StartWith ${code}-`
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
                <SelectOption
                  Textlabel={"Degee"}
                  options={leveldoctorForm}
                  multi={false}

                  isRequire={true}
                  nameLabel={"label"}
                  nameValue={"value"}
                  err={errorForm.level}
                  fnChangeOption={(value) => {
                    setValueForm((prev) => ({
                      ...prev,
                      level: value.value
                    }))
                    setErrorForm((prev) => ({
                      ...prev,
                      level: ''
                    }))

                  }}
                />
                <SelectOption
                  Textlabel={"Gender"}
                  options={genderForm}
                  multi={false}
                  isRequire={true}
                  nameLabel={"label"}
                  nameValue={"value"}
                  err={errorForm.gender}
                  fnChangeOption={(value) => {
                    setValueForm((prev) => ({
                      ...prev,
                      gender: value.value
                    }))
                    setErrorForm((prev) => ({
                      ...prev,
                      gender: ''
                    }))

                  }}
                />


              </div>
              <div className='row_3'>
                <InputComponent
                  Textlabel={"Room"}

                  isRequire={true}
                  err={errorForm.room}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var room = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      room: room
                    }))
                    if (room.trim() > 0) {


                      setErrorForm((prev) => ({
                        ...prev,
                        room: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        room: 'room is required'
                      }))
                    }

                  }}
                />


                <InputComponent
                  Textlabel={"Patient"}

                  isRequire={true}
                  err={errorForm.patient}
                  typeInput={"Number"}
                  fnChange={(value) => {
                    var patient = value.target.value.trim()
                    setValueForm((prev) => ({
                      ...prev,
                      patient: patient
                    }))
                    if (patient.trim() > 0) {


                      setErrorForm((prev) => ({
                        ...prev,
                        patient: ''
                      }))

                    } else {
                      setErrorForm((prev) => ({
                        ...prev,
                        patient: 'patient is required'
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




              <div className='box_btn'>
                <button type='submit'>Create</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </ListDoctorPage>
  );
}

