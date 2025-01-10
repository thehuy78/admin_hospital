import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import { createNotification } from '../../../shared/Config/Notifications';
import { useCookies } from 'react-cookie';
import { NotificationContainer } from 'react-notifications';
import { formatDate, formatDateBlogDetail, formatDateNotTime } from '../../../shared/function/FomatDate';
import { formatNumberWithDot } from '../../../shared/function/FomatNumber';
import { BookingDetailPage } from '../data/DataBooking';
import LoadingPage from '../../../shared/Config/LoadingPage';
import SendMail from "../../../shared/component/Mocup/SendMail"
export default function BookingDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [, , removeCookie] = useCookies(["token_hospital"]);
  const { token } = useAdminContext()
  const [booking, setBooking] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [formSendMail, setFormSendMail] = useState(false)
  const [mailCurrent, setMailCurrent] = useState()
  const fetchBookingById = useCallback(async () => {
    if (id && token) {
      try {
        var rs = await apiRequestAutherize("Get", `booking/get/${id}`, token)
        console.log(rs);
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
        if (rs && rs.data && rs.data.status === 200) {
          setBooking(rs.data.data)
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
        }, 500);
      }
    }
  }, [id, token, removeCookie])

  useEffect(() => {
    fetchBookingById()
  }, [fetchBookingById]);

  return booking && (
    <BookingDetailPage className='bookingdetail_Page'>
      <NotificationContainer />
      <LoadingPage key={"dtbk"} isloading={isLoading} />
      <section className='brums_nav'>
        <span onClick={() => { navigate(-1) }}><i className="fa-solid fa-arrow-left"></i> Back</span>
      </section>
      <section className='details'>
        <div className='left'>
          <p className='id_booking'>ID: {booking.id}</p>
          <div className='patient_info'>
            <p className='title'>Patient information</p>
            <div className='tt_cn'>
              <div>
                <p>Name:</p>
                <p>{booking.name}</p>
              </div>
              <div>
                <p>Dob:</p>
                <p>{formatDateNotTime(booking.dob)}</p>
              </div>
              <div>
                <p>Gender</p>
                <p>{booking.gender}</p>
              </div>
            </div>
            <div>
              <p>Address: </p>
              <p>{booking.address}, {booking.ward}, {booking.district}, {booking.province} </p>
            </div>
            <div>
              <p>Identifier number:</p>
              <p>{booking.identifier}</p>
            </div>
            <div>
              <p>Job:</p>
              <p>{booking.job}</p>
            </div>

          </div>

          <div className='hospital_info'>
            <p className='title'>Hospital information</p>
            <div className='content'>
              <div className='info'>
                <div className='tt_cn'>
                  <div>
                    <p>Hospital:</p>
                    <p>{booking.hospitalName}</p>
                  </div>
                  <div>
                    <p>Code:</p>
                    <p>{booking.hospitalCode}</p>
                  </div>
                </div>
                {booking.doctorName && (

                  <div>
                    <p>Doctor:</p>
                    <p>{booking.doctoLevel} {booking.doctorName} [{booking.doctorCode}]</p>
                  </div>

                )}
                {booking.packName && (
                  <div>
                    <p>Package:</p>
                    <p>{booking.packName} [{booking.packCode}]</p>
                  </div>
                )}
                {booking.testName && (
                  <div>
                    <p>Testing:</p>
                    <p>{booking.testName} [{booking.testCode}]</p>
                  </div>
                )}
                {booking.vaccineName && (
                  <div>
                    <p>Vaccine:</p>
                    <p>{booking.vaccineName} [{booking.vaccineCode}]</p>
                  </div>
                )}




              </div>
              <div className='logo'>
                <img alt='' src={booking.hospitalLogo} />
              </div>
            </div>
          </div>


          <div className='time_info'>
            <p className='title'>Examination time</p>
            <div>
              <p>Medical examination day: </p>
              <p>{formatDateBlogDetail(booking.scheduleDate)}</p>
            </div>
            <div>
              <p>Medical examination time: </p>
              <p>{booking.scheduleTime}</p>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='info_account'>
            <p className='title'>Status Booking</p>
            <div>
              <p>Status:</p>
              <p>{booking.status}</p>
            </div>
            <div>
              <p>Create Date:</p>
              <p>{formatDate(booking.createDate)}</p>
            </div>

          </div>
          <div className='info_account'>
            <p className='title'>Account Infomation</p>
            <div>
              <p>Email:</p>
              <p>{booking.email}</p>
            </div>
            <div>
              <p>FullName:</p>
              <p>{booking.firstName} {booking.lastName}</p>
            </div>
            <div>
              <p>Verify:</p>
              <p>{booking.verify ? "Verified" : "Not Verified"}</p>
            </div>
          </div>
          <div className='info_account'>
            <p className='title'>Transaction</p>
            <div>
              <p>Payment:</p>
              <p>Online</p>
            </div>
            <div>
              <p>Revenue:</p>
              <p>{formatNumberWithDot(booking.revenue)} VNĐ</p>
            </div>
            <div>
              <p>Profit:</p>
              <p>{formatNumberWithDot(booking.profit)} VNĐ</p>
            </div>
          </div>
          <div className='btn_send'>
            <button onClick={() => {
              setFormSendMail(true)
              setMailCurrent(booking.email)
            }}>Send mail user</button>
          </div>
        </div>

      </section>
      {mailCurrent && formSendMail && (
        <SendMail email={mailCurrent} fnClose={() => { setFormSendMail(prev => !prev) }} />
      )}

    </BookingDetailPage>
  )
}
