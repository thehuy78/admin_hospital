import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminContext } from '../../../shared/hook/ContextToken';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { createNotification } from '../../../shared/Config/Notifications';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { jwtDecode } from 'jwt-decode';
import { formatNumberWithDot } from '../../../shared/function/FomatNumber';
import { EventVaccineDetailsPage } from '../data/EventData';
import SelectInput from "../../../shared/component/InputFilter/SelectInput"
export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAdminContext();
  const [hospitalInEvent, setHospitalInEvent] = useState([])
  const fetchData = useCallback(async () => {
    try {
      if (token && id) {
        setIsLoading(true)
        var jwt = jwtDecode(token);
        console.log(jwt);
        var data = {
          idEvent: id,
          hospitalId: jwt.hospitalId
        }
        var rs = await apiRequestAutherize("GET", `eventVaccine/get/${id}`, token)
        var rs1 = await apiRequestAutherize("POST", `hospitalEvent/getByEvent`, token, data)
        console.log(rs1);
        if (rs1 && rs1.data && rs1.data.status === 200) {

          setHospitalInEvent(rs1.data.data);
        }
        if (rs && rs.data && rs.data.status) {
          switch (rs.data.status) {
            case 200:

              setEvent(rs.data.data)
              break;
            case 300:
              createNotification('error', rs.data.message, 'Failed')();
              break;
            case 400:
              createNotification('error', rs.data.message, 'Error')();
              break;
            default:
              break;
          }
        }
      }

    } catch (error) {
      if (error.response && error.response.status === 403) {
        createNotification("warning", "Your role is not accessible", "Warning")()
      } else if (error.response && error.response.status === 401) {
        createNotification("error", "Login session expired", "Error")()
      } else {
        createNotification("error", error.message && error.message, "Error")()
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token, id])

  useEffect(() => {
    fetchData()
  }, [fetchData]);
  const navigate = useNavigate();







  const [vaccine, setVaccine] = useState([])
  const fetchdata = useCallback(async () => {
    try {
      if (token) {
        var jwt = jwtDecode(token);
        var f = {
          status: "active",
          search: "",
          fee: [],
          page: 0,
          size: 1000,
          codehospital: jwt.hospital
        }
        var rs = await apiRequestAutherize("post", "vaccine/getbyhospital", token, f)

        if (rs && rs.data && rs.data.status === 200) {
          var vc = rs.data.data.content

          // Tạo tập hợp vaccineId từ hospitalInEvent
          const hospitalVaccineIds = new Set(hospitalInEvent.map((item) => item.vaccineId));

          // Lọc các item không có trong hospitalInEvent
          const itemsNotInHospitalInEvent = vc.filter((op) => !hospitalVaccineIds.has(op.id));

          // Cập nhật state với kết quả
          setVaccine(itemsNotInHospitalInEvent);
        }
      }
    } catch (error) {
      createNotification("error", error.message && error.message, "Error")()
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token, hospitalInEvent])

  useEffect(() => {
    fetchdata()
  }, [fetchdata]);


  const [vaccineChoice, setVaccineChoice] = useState([])
  const formattedOptions = (options) => {
    return options.map(option => ({
      value: option.id,
      label: option.name
    }));
  }

  const renderItemChoice = (itemId, list) => {
    const rs = list.find((op) => op.id === itemId);
    if (rs) {
      return (
        <div key={itemId} style={{
          backgroundColor: "var(--cl_3)", display: "flex",
          justifyContent: "space-between",
          padding: "0.3rem 0.5rem",
          alignItems: "center"
        }}>
          <p>{rs.name}</p>
          <button onClick={() => handleAddVaccine(rs.id)}
            style={{
              backgroundColor: "white",
              padding: "0.2rem 0.5rem",
              outline: "none", border: "none",
              fontSize: "var(--fz_smallmax)"
            }}>Send Request</button>
        </div>
      );
    }
    return null;
  };

  const handleAddVaccine = async (vaccinceid) => {
    try {
      if (token && id) {
        var jwt = jwtDecode(token);
        var f = {
          idEvent: id,
          idVaccine: vaccinceid,
          idUser: jwt.id,

        }
        setIsLoading(true)
        var rs = await apiRequestAutherize("post", "hospitalEvent/requestAddVaccine", token, f)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          fetchData()
          var result = vaccineChoice.filter((op) => op !== vaccinceid)
          setVaccineChoice(result)
          createNotification("success", "Send Request Success", "Success")()
        } else {
          createNotification("error", rs.data.message, "Error")()
        }
      }
    } catch (error) {
      createNotification("error", error.message && error.message, "Error")()
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }



  const handleRemoveVaccine = async (id) => {
    try {
      if (token) {
        setIsLoading(true)
        var rs = await apiRequestAutherize("GET", `hospitalEvent/remove/${id}`, token)
        console.log(rs.data);
        if (rs && rs.data && rs.data.status === 200) {
          fetchData()

          createNotification("success", rs.data.message, "Success")()
        } else {
          createNotification("error", rs.data.message, "Error")()
        }
      }
    } catch (error) {
      createNotification("error", error.message && error.message, "Error")()
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }
  return event && (
    <EventVaccineDetailsPage>
      <LoadingPage key={"ltt"} isloading={isLoading} />
      <section className='brums_nav'>
        <span onClick={() => { navigate(-1) }}><i class="fa-solid fa-arrow-left"></i> Back</span>
      </section>
      <div className='top_content'>
        <p className='name__'>Vaccination program: {event.name}</p>
      </div>
      <div className='bottom_content'>
        <div className='left_content'>
          <SelectInput
            multi={false}

            options={vaccine && vaccine.length > 0 && formattedOptions(vaccine)}
            fnChangeOption={(e) => {
              setVaccineChoice((prev) => {
                // Kiểm tra xem e.value đã có trong danh sách hay chưa
                if (prev.includes(e.value)) {
                  // Nếu đã có, loại bỏ nó khỏi danh sách
                  return prev.filter((item) => item !== e.value);
                } else {
                  // Nếu chưa có, thêm vào danh sách
                  return [...prev, e.value];
                }
              });
            }}
          />
          <div className="list_vaccine_choice" style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            {vaccineChoice && vaccineChoice.length > 0 && vaccineChoice.map((item, index) => (
              renderItemChoice(item, vaccine)
            ))}
          </div>
          <div className="list_vacc">
            {hospitalInEvent && hospitalInEvent.length > 0 && hospitalInEvent.map((item, index) => (
              <div key={index} className='box_hospital__'>
                <div className='box_vaccine__list'>
                  <p className='v_name'><span className={item.status.toLowerCase() === "active" ? "status_active_dot" : "status_deactive_dot"}></span>Vaccine: {item.vaccineName}</p>
                  <div className='row__'>
                    <p className='v_code'>Code: {item.vaccineCode}</p>
                    <p className='v_fee'>Fee: {formatNumberWithDot(item.vaccineFee)}</p>
                  </div>
                </div>
                <div className="box_del">
                  <i class="fa-solid fa-trash" onClick={() => handleRemoveVaccine(item.id)}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='right_content'>
          <p className='code__'>Code: {event.code}</p>
          <p className='description__'
            dangerouslySetInnerHTML={{ __html: event.description }}
          >
          </p>
        </div>
      </div>
    </EventVaccineDetailsPage>
  )
}





