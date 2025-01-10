import React, { useCallback, useEffect, useState } from "react";
import SearchInput from "../../shared/component/InputFilter/SearchInput";
import SelectInput from "../../shared/component/InputFilter/SelectInput";
import { useAdminContext } from "../../shared/hook/ContextToken";
import { useCookies } from "react-cookie";
import { dayoffjson, headerjson, ListDayOff } from "./data/dataDayOff";
import swal from "sweetalert";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { renderPagination } from "../../shared/function/Pagination";
import GetImageFireBase from "../../shared/function/GetImageFireBase";
import { formatDate, formatDateNotTime } from "../../shared/function/FomatDate";
import InputComponent from "../../shared/component/InputData/InputComponent";
import MultiSelectCalendar from "../../shared/component/InputData/MultiSelectCalendar";
import { apiRequestAutherize } from "../../shared/hook/Api/ApiAuther";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import SelectOption from "../../shared/component/InputData/SelectOption";
import { createNotification } from "../../shared/Config/Notifications";
import LoadingPage from "../../shared/Config/LoadingPage";

export default function DayOff() {
  const [totalPage, setTotalPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAdminContext();
  const [, , removeCookie] = useCookies(["token_hospital"]);
  const [doctor, setDoctor] = useState([]);
  const [page, setPage] = useState({ page: 0, size: 7 });
  const [dayOff, setDayOff] = useState();
  const [header, setHeader] = useState(headerjson);

  const [mocupCreate, setMocupCreate] = useState(false);
  const [valueForm, setValueForm] = useState({ doctorId: [], description: '', dayoff: "" });
  const [errorForm, setErrorForm] = useState({ doctorId: "", description: '', dayoff: "" });

  const handlePage = (value) => {
    setPage((prev) => ({ ...prev, page: value - 1 }));
  };

  const fetchDoctor = useCallback(async () => {
    try {
      if (token) {
        const tokenjwt = jwtDecode(token);
        const rs = await apiRequestAutherize(
          "GET",
          `doctor/getbyhospital/${tokenjwt.hospitalId}`,
          token
        );

        if (rs && rs.data && rs.data.status === 200) {
          setDoctor(rs.data.data);
        } else {
          createNotification("error", "Fetch Doctor Error", "Error")();
        }
      }
    } catch (error) {
      console.error("Fetch Doctor Error:", error);
      createNotification("error", "Fetch Doctor Error", error.message || "Error")();
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token);
        var data = {
          page: page.page,
          size: page.size,
          search: '',
          status: '',
          idHospital: tokenjwt.hospitalId
        }
        var rs = await apiRequestAutherize("POST", "offline/get", token, data);
        console.log(rs);
        setIsLoading(false)
        if (rs && rs.data && rs.data.status === 200) {
          setDayOff(rs.data.data.content)
          setTotalPage(rs.data.data.totalPages)
        } else {
          createNotification('error', rs.data.message, "Error")()
        }
      }
    } catch (error) {
      createNotification('error', error, "Error")()
    } finally {
      setIsLoading(false)
    }
  }, [token, page])

  useEffect(() => {
    fetchData()
  }, [fetchData]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  const renderObject = (id, data) => {
    const doctor = data.find((d) => d.id === id);
    if (doctor) {
      return (
        <BoxDoctor key={id}>
          <img alt="" src={GetImageFireBase(doctor.avatar)} />
          <div className="b_doctor_name">
            <p>{doctor.level}. {doctor.name}</p>
            <p>Code: {doctor.code}</p>
          </div>
        </BoxDoctor>
      );
    }
    return null;
  };

  const handleSelectChange = (value) => {
    const selectedValues = value ? value.map((option) => option.id) : [];
    setValueForm((prev) => ({ ...prev, doctorId: selectedValues }));
    setErrorForm((prev) => ({
      ...prev,
      doctorId: selectedValues.length > 0 ? "" : "Doctor is Required",
    }));
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setValueForm((prev) => ({ ...prev, description: description }))
    setErrorForm((prev) => ({
      ...prev,
      description: description.trim() !== '' ? "" : "Description is Required",
    }));



  };

  const handlePrevPage = () => {
    if (page.page > 0) {
      setPage((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (page.page < totalPage - 1) {
      setPage((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleCreate = async (e) => {
    try {
      e.preventDefault();
      var valid = true;
      if (valueForm.dayoff === "") {
        valid = false;
        setErrorForm((prev) => ({
          ...prev,
          dayoff: "Day off is Required",
        }));
      }
      if (valueForm.doctorId.length <= 0) {
        valid = false;
        setErrorForm((prev) => ({
          ...prev,
          doctorId: "Doctor is Required",
        }));
      }
      if (valueForm.description.trim() === '') {
        valid = false;
        setErrorForm((prev) => ({
          ...prev,
          description: "Descripton is Required",
        }));
      }
      if (valid === false) {
        swal("Validation", "Data invalid!", "error");
        return;
      } else {
        if (token) {
          var tokenjwt = jwtDecode(token);
          var data = {
            idDoctor: valueForm.doctorId,
            day: valueForm.dayoff,
            description: valueForm.description,
            userId: tokenjwt.id
          }

          var rs = await apiRequestAutherize("POST", "offline/create", token, data);
          if (rs && rs.data && rs.data.status === 200) {
            fetchData()
            setMocupCreate(false)
            setValueForm(
              { doctorId: [], description: '', dayoff: "" }
            )
            setErrorForm({ doctorId: "", description: '', dayoff: "" })
            swal("Create", "Create Day Off Success!", "success");
          } else {
            swal("Create", rs.data.message, "error");
          }
        }
        console.log(valueForm);
      }
      // Handle form submission logic here
    } catch (error) {
      swal("Create", error.toString(), "error");
    }
  };

  const handleCreateChangeDate = (value) => {

    const mysqlFormattedDates = value.map((date) => {
      const jsDate = new Date(date);
      const year = jsDate.getFullYear();
      const month = String(jsDate.getMonth() + 1).padStart(2, '0');
      const day = String(jsDate.getDate()).padStart(2, '0');
      const hours = String(jsDate.getHours()).padStart(2, '0');
      const minutes = String(jsDate.getMinutes()).padStart(2, '0');
      const seconds = String(jsDate.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    });


    const date = mysqlFormattedDates.join("; ");
    if (date !== '') {
      setValueForm((prev) => ({ ...prev, dayoff: date }));
      setErrorForm((prev) => ({
        ...prev,
        dayoff: "",
      }));
    } else {
      setValueForm((prev) => ({ ...prev, dayoff: date }));
      setErrorForm((prev) => ({
        ...prev,
        dayoff: "Day off is Required",
      }));
    }

  }

  return (
    <ListDayOff>

      <LoadingPage isloading={isLoading} />
      <section className="section_filter">
        <div className="left">
          <i
            className="fa-solid fa-plus add_new_button__"
            onClick={() => setMocupCreate(true)}
          ></i>
          <SearchInput />
        </div>
        <div className="right">
          <SelectInput key={1} />
        </div>
      </section>


      <section className="section_list">
        <div className="data_table">
          <table className="table_">
            <thead>
              {header &&
                header.map((item, index) => (
                  <th key={index} className={item} style={{ display: "table-cell" }}>
                    {item}
                  </th>
                ))}
            </thead>
            <tbody>
              {dayOff && dayOff.length > 0 ? (
                dayOff.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{ }</td>
                    <td>
                      <div className="box_doctor">
                        <img alt="" src={GetImageFireBase(item.avatar)} />
                        <div className="b_doctor_name">
                          <p>{item.doctorName}</p>
                          <p>{item.doctorCode}</p>
                        </div>
                      </div>
                    </td>
                    <td>{item.day && item.day.split("; ").map((item, index) => (
                      <p>{formatDateNotTime(item)}</p>
                    ))}</td>
                    <td>{item.description}</td>
                    <td>{formatDate(item.createDate)}</td>
                    <td>{item.user}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={header.length + 1} style={{ textAlign: "center" }}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPage > 0 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page.page === 0}>
              Prev
            </button>
            {renderPagination(page.page + 1, totalPage, handlePage)}
            <button onClick={handleNextPage} disabled={page.page + 1 === totalPage}>
              Next
            </button>
          </div>
        )}
      </section>

      {/* Modal for Creating Day Off */}
      {mocupCreate && (
        <div className="mocup_edit_box">
          <div className="container" style={{ maxWidth: "900px" }}>
            <p
              className="close"
              onClick={() => {
                setMocupCreate(false);
                setValueForm({ doctorId: [], dayoff: "" });
                setErrorForm({ doctorId: "", dayoff: "" });
              }}
            >
              X
            </p>
            <p className="title">Create Day Off</p>
            <form onSubmit={handleCreate}>
              <div className="row_2">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <SelectOption
                    Textlabel={"Doctor"}
                    options={doctor}
                    multi={true}
                    isRequire={true}
                    nameLabel={"name"}
                    nameValue={"id"}
                    err={errorForm.doctorId}
                    fnChangeOption={handleSelectChange}
                  />
                  {valueForm.doctorId.map((id) => renderObject(id, doctor))}
                  <InputComponent
                    Textlabel={"Description"}
                    err={errorForm.description}
                    isRequire={true}
                    typeInput={"Text"}
                    Textplacehoder={"Lý do nghĩ..."}
                    fnChange={handleDescriptionChange}
                  />
                </div>
                <MultiSelectCalendar err={errorForm.dayoff} fnCallback={handleCreateChangeDate} />
              </div>
              <div className="box_btn" style={{ paddingTop: "1rem" }}>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ListDayOff>
  );
}

const BoxDoctor = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background-color: var(--cl_2);
  img {
    width: 50px;
    height: 50px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  .b_doctor_name {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: start;
    gap: 0.3rem;
    p:first-child {
      font-weight: 700;
    }
    p:last-child {
      font-size: var(--fz_smallmax);
    }
  }
`;
