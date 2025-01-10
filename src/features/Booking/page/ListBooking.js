import React, { useCallback, useEffect, useState } from "react";
import LoadingPage from "../../../shared/Config/LoadingPage";
import SelectInput from "../../../shared/component/InputFilter/SelectInput";
import SearchInput from "../../../shared/component/InputFilter/SearchInput";
import { ListBookingPage, theadTopic, typebooking, gender, revenue } from "../data/DataBooking";
import { Link, useNavigate, useParams } from "react-router-dom";
import { renderPagination } from "../../../shared/function/Pagination";
import { apiRequestAutherize } from "../../../shared/hook/Api/ApiAuther";
import { createNotification } from "../../../shared/Config/Notifications";
import { useAdminContext } from "../../../shared/hook/ContextToken";
import { useCookies } from "react-cookie";
import { formatDate, formatDateNotTime } from "../../../shared/function/FomatDate";
import { NotificationContainer } from "react-notifications";
import { convertExcelFile } from "../../../shared/function/CreateExcel";
import RangeDateInput from "../../../shared/component/InputFilter/RangeDateInput";
import { jwtDecode } from "jwt-decode";



export default function ListBooking() {
  const today = new Date();
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 60);
  const startDate = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0);
  const [dateRange, setDateRange] = useState([startDate, endDate]);


  const [filter, setFilter] = useState({
    type: "",
    search: '',
    gender: '',
    hospital: '',
    revenue: []
  });
  const { type, id } = useParams()
  const [booking, setBooking] = useState()
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token_hospital"]);
  const [page, setPage] = useState({
    page: 0,
    size: 10,
  })
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAdminContext()
  useEffect(() => {
    setPage((prev) => ({ ...prev, page: 0 }))
  }, [filter, dateRange]);

  const [optionHospital, setOptionHospital] = useState()
  const fetchHospital = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("get", "hospital/getname", token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          var result = rs.data.data
          result.unshift({ code: '', name: "All" });
          setOptionHospital(result)
        }
      }
    } catch (error) {
    }

  }, [token])
  const formattedOptions = (options) => {
    return options.map(option => ({
      value: option.code,
      label: option.name
    }));
  }

  useEffect(() => {
    fetchHospital()
  }, [fetchHospital]);




  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var hospitalCode = jwtDecode(token).hospital
        var f = {
          gender: filter.gender,
          revenue: filter.revenue,
          type: filter.type,
          search: filter.search,
          typeUrl: type === "list" ? "" : type,
          idUrl: id === "all" ? "" : id,
          hospitalCode: hospitalCode,
          page: page.page,
          size: page.size,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        }
        console.log(f);
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "booking/getall", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          setBooking(rs.data.data.content)
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
  }, [token, filter, page, type, id, dateRange, removeCookie])

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




  const [showFilterOption, setShowFilterOption] = useState(false);
  const [showFilterColumn, setShowFilterColumn] = useState(false);
  const [filterColumn, setFilterColumn] = useState([
    "email",
    "name",
    "gender",
    "province",
    "bookingDate",
    "bookingTime",
    "typeName",
    "type",
    "status",
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


  const exPortExcel = async () => {
    try {
      if (token) {
        var hospitalCode = jwtDecode(token).hospital
        var f = {
          gender: filter.gender,
          revenue: filter.revenue,
          type: filter.type,
          search: filter.search,
          typeUrl: type === "list" ? "" : type,
          idUrl: id === "all" ? "" : id,
          hospitalCode: hospitalCode,
          page: page.page,
          size: page.size,
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        }
        var rs = await apiRequestAutherize("post", "report/booking", token, f)
        console.log(rs);
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          const byteCharacters = atob(rs.data.data);
          const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
          );
          const byteArray = new Uint8Array(byteNumbers);

          // Tạo file blob
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          // Tạo link download
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "bookings.xlsx");
          document.body.appendChild(link);
          link.click();
          link.remove();
          createNotification('success', "Export File Success", "Success")()
          // convertExcelFile(rs.data.data, `booking ${type === "list" ? filter.hospital : ""} ${type === "list" ? "" : type}${formatDateNotTime(dateRange[0])}-${formatDateNotTime(dateRange[1])}`)
        }
      }
    } catch (error) {
      createNotification('error', "Export File Fails", "Export Fails")()
    }

  }
  return (
    <ListBookingPage>
      <NotificationContainer />
      <LoadingPage isloading={isLoading} />
      <section className='brums_nav'>
        <span onClick={() => { navigate(-1) }}><i className="fa-solid fa-arrow-left"></i> Back</span>
      </section>
      <section className="section_filter">
        <div className="left">


          <SearchInput
            fnChangeCallback={handelChangeSearch}
          />
        </div>
        <div className="right">

          <RangeDateInput defaultValue={dateRange} fnChangeValue={(e) => { setDateRange(e) }} />
          <div className="box_filter_option_conponent">
            <div
              className="filter_option"
              onClick={() => {
                setShowFilterOption((prev) => !prev);
              }}
            >
              <i className="fa-solid fa-filter"></i>

            </div>
            {showFilterOption && (
              <div className="list_option">
                <span className="triangle"></span>{" "}
                {/* Triangle connecting the filter to the dropdown */}
                <div className="container_list_option">
                  <div className="item">
                    <span>Gender</span>
                    <SelectInput
                      defaultVl={gender.find(
                        (option) => option.value === filter.gender
                      )}
                      options={gender}
                      multi={false}
                      fnChangeOption={(selected) => {
                        setFilter((prev) => ({
                          ...prev,
                          gender: selected.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="item">
                    <span>Revenue</span>
                    <SelectInput
                      defaultVl={revenue.find(
                        (option) => option.value === filter.revenue
                      )}
                      options={revenue}
                      multi={false}
                      fnChangeOption={(selected) => {
                        setFilter((prev) => ({
                          ...prev,
                          revenue: selected.value,
                        }));
                      }}
                    />
                  </div>

                  {type === "list" && (
                    <div className="item">
                      <span>Type</span>
                      <SelectInput
                        key={1}
                        defaultVl={typebooking.find(
                          (type) => type.value === filter.type
                        )}
                        multi={false}
                        options={typebooking}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, type: selected.value }));
                        }}
                      />
                    </div>
                  )}

                  {type === "list" && optionHospital && optionHospital.length > 0 && (
                    <div className="item">
                      <span>Hospital</span>
                      <SelectInput minWidth={"auto"}
                        options={formattedOptions(optionHospital)}
                        defaultVl={formattedOptions(optionHospital).find(op => op.value === filter.hospital)}
                        multi={false}
                        fnChangeOption={(selected) => {
                          setFilter((prev) => ({ ...prev, hospital: selected.value }));
                        }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="r_b_filter_column">
            <div
              className="b_filter_column"
              onClick={exPortExcel}
            >
              <i className="fa-solid fa-download"></i>
            </div>
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
                  {theadTopic &&
                    theadTopic.length > 0 &&
                    theadTopic.map((item, index) => (
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
              {theadTopic &&
                theadTopic.length > 0 &&
                theadTopic.map((item, index) => (
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
              {booking &&
                booking.length > 0 ? (
                booking.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        display: filterColumn.includes("email")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.userEmail}
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
                        display: filterColumn.includes("phone")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.phone}
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
                        display: filterColumn.includes("dob")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDateNotTime(item.dob)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("province")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.province}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("identifier")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.identifier}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("bookingDate")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {formatDateNotTime(item.bookingDate)}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("bookingTime")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.bookingTime}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("type")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.typeName}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("revenue")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.revenue}
                    </td>

                    <td
                      style={{
                        display: filterColumn.includes("profit")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.profit}
                    </td>
                    <td
                      style={{
                        display: filterColumn.includes("hospital")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      {item.hospitalName}
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
                        display: filterColumn.includes("status")
                          ? "table-cell"
                          : "none",
                      }}
                    >
                      <p className={item.status && item.status.toLowerCase() === "active" ? "active" : "deactive"}>{item.status}</p>
                    </td>
                    <td>
                      <Link className='link_tag' to={`/admin/booking/detail/${item.id}`}>
                        <p className='view_'>Details</p>
                      </Link>
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td colSpan={theadTopic.length + 1} style={{ textAlign: "center" }}>
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
    </ListBookingPage>
  );
}
