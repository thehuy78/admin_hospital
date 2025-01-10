import React, { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useAdminContext } from '../../shared/hook/ContextToken';
import { jwtDecode } from 'jwt-decode';
import { apiRequestAutherize } from '../../shared/hook/Api/ApiAuther';
import { createNotification } from '../../shared/Config/Notifications';
import LoadingPage from '../../shared/Config/LoadingPage';
import '../../Test.scss'
import GetImageFireBase from "../../shared/function/GetImageFireBase"
import { formatDateBlogDetail } from '../../shared/function/FomatDate';
import styled from 'styled-components';
export default function HospitalInformation() {

  const [hospital, setHospital] = useState({})
  const [service, setService] = useState([])
  const { token } = useAdminContext()
  const [isLoading, setIsLoading] = useState(true)
  const [, , removeCookie] = useCookies(["token_hospital"]);
  const fetchData = useCallback(async () => {
    try {
      if (token) {
        var hospital = jwtDecode(token);
        var rs = await apiRequestAutherize("GET", `hospital/getbyid/${hospital.hospitalId}`, token)
        var rsservice = await apiRequestAutherize("GET", `services/servicehospital/${hospital.hospital}`, token)
        console.log(rsservice);
        if (rs && rs.data && rs.data.status === 200) {
          setHospital(rs.data.data)
        }
        if (rsservice && rsservice.data && rsservice.data.status === 200) {
          setService(rsservice.data.data)
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
    }
    finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 400);
    }
  }, [token])
  useEffect(() => {
    fetchData()
  }, [fetchData]);
  return hospital && (
    <div>
      <LoadingPage isloading={isLoading} />

      <HospitalPage>

        <div className='container'>

          <div className='left'>
            <div className='box_logo'>
              <img src={GetImageFireBase(hospital.logo)} alt='' />
            </div>
            <p className='name'>
              {hospital.name}
            </p>
            <p className='title_box_img'>Image Hospital</p>
            <div className='box_img'>
              {hospital.image && hospital.image.split("; ").map((item, index) => (
                <img src={GetImageFireBase(item)} alt='' key={index} />
              ))}
            </div>
            <div className='list_service'>
              {service && service.length > 0 && service.filter((op) => op.name !== 'Doc Appointments').map((item, index) => (
                <div className='item'>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='right'>
            <p className='title'>Information {hospital.name}</p>

            <p>Code: <span>{hospital.code && hospital.code}</span></p>
            <p>Type: <span>{hospital.typeName && hospital.typeName}</span></p>

            <p>Address: <span>{hospital.address && hospital.address}, {hospital.district && hospital.district}, {hospital.province && hospital.province}</span></p>

            <div className='row'>
              <p>Work Day: <span>{hospital.workDay && hospital.workDay}</span></p>
              <p>Open Time: <span>{hospital.openTime && hospital.openTime}</span></p>
              <p>CloseTime: <span>{hospital.closeTime && hospital.closeTime}</span></p>
            </div>
            <p>Create Date: <span>{hospital.createDate && formatDateBlogDetail(hospital.createDate)}</span></p>
            <p>Update Date: <span>{hospital.updateDate && formatDateBlogDetail(hospital.updateDate)}</span></p>
            <p>Description: {hospital && hospital.description && (<span dangerouslySetInnerHTML={{ __html: hospital.description }}></span>)} </p>


          </div>
        </div>
      </HospitalPage>
    </div>
  )
}

const HospitalPage = styled.div`
  padding: 0.5rem;
  width: 100%;
  height: 100vh;
  .container {
    display: grid;
    gap: 3rem;
    padding: 2rem;
    width: 100%;
    border-radius: 1rem;
    // box-shadow: 0 0 1rem var(--shadow-black);
    background-color: white;
    min-height: 20vh;
    grid-template-columns: 2fr 3.5fr;
  }
  .left,
  .right {
    width: 100%;
  }
  .left {
    .box_logo {
      width: 100%;
      display: flex;
      justify-content: center;
      img {
        max-width: 150px;
      }
    }
    .name {
      text-transform: capitalize;
      text-align: center;
      padding: 0.5rem 0;
      font-weight: 800;
      font-size: var(--fz_medium);
    }
    .title_box_img {
      padding-top: 1rem;
      padding-bottom: 0.4rem;
      font-weight: 800;
    }
    .box_img {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.1rem;
      img {
        width: 100%;
        cursor: pointer;
      }
    }
      .list_service {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
      padding: 1rem 0;
      .item {
        background-color: var(--cl_3);
        border-radius: 0.5rem;
        box-shadow: 1px 1px 1px var(--cl_2);
        color: white;
        p {
          font-size: var(--fz_smallmax);
          text-align: center;
          padding:1rem 1rem;
        }
      }
    }
  }
  .right {
    p {
      padding: 0.5rem 0;
      font-weight: 800;
      span {
        padding-left: 1rem;
      }
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    .title {
      font-size: var(--fz_large);
      color: orange;
      text-transform: uppercase;
      text-align: center;
      padding-bottom: 2rem;
    }
    
  }

`
