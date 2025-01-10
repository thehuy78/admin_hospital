import React, { useCallback, useEffect, useRef, useState } from 'react';
import LoadingPage from '../../../shared/Config/LoadingPage';
import Chart from 'chart.js/auto';
import '../style/Dashboard.scss';

//hook
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
//function
import GetImageFireBase from "../../../shared/function/GetImageFireBase"
import { formatDateNotTime } from '../../../shared/function/FomatDate';
import { SelectStyle, CaculatorPer, findItem } from "../data/dataDashboard"
import { formatNumberWithDot } from "../../../shared/function/FomatNumber"
//json data
import { labelData, labelSet, labelValue } from "../data/LabelChartBookingHours"
import { labelDataAge } from "../data/LabelChartBookingByAge"
import { labelSetDoW, labelValueDoW } from "../data/LabelChartBookingByDayOfWeek"
//component
import ChartBookingByHours from '../component/ChartBookingByHours';
import ChartBookingByAge from '../component/ChartBookingByAge';
import ChartBookingByDayOfWeek from '../component/ChartBookingByDayOfWeek';
import { CaculatorPercentfn } from '../../../shared/function/CaculatorPercent';
import { jwtDecode } from 'jwt-decode';
import { createNotification } from '../../../shared/Config/Notifications';
import SelectInput from '../../../shared/component/InputFilter/SelectInput';


const day = [
  {
    value: 1,
    label: "Today"
  },
  {
    value: 7,
    label: "Last weeks"
  },
  {
    value: 30,
    label: "Last month"
  },
  {
    value: 365,
    label: "Last years"
  }
]


export default function Dashboard() {
  const [isloading, setIsloading] = useState(false);
  const { token } = useAdminContext();

  const currentDate = new Date();
  const [tokenJwt, setTokenJwt] = useState();

  useEffect(() => {
    if (token) {
      setTokenJwt(jwtDecode(token))
    }
  }, [token]);

  const [totalRevenueProfit, setTotalRevenueProfit] = useState()
  const fetchTotalRevenue = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var rs = await apiRequestAutherize("GET", `chart/revenue/${tokenjwt.hospital}`, token)

        if (rs && rs.data && rs.data.status === 200) {
          setTotalRevenueProfit(rs.data.data)
        }
      }

    } catch (error) {

    }
  }, [token])


  const [bookingByHours, setBookingByHours] = useState()
  const fetchCountBookingByHours = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var datadto = {
          hospitalCode: tokenjwt.hospital,
          type: "Booking",
          service: "",
          time: 1
        }
        var rs = await apiRequestAutherize("POST", `analysis/chart1`, token, datadto)

        if (rs && rs.data && rs.data.status === 200) {
          var data = rs.data.data
          if (data) {
            // Lọc ra chỉ số `count` cho từng giờ từ 0 đến 23
            const todayCounts = data.currentPeriod.map(item => item.bookingsCount);
            const yesterdayCounts = data.previousPeriod.map(item => item.bookingsCount);
            // Tạo mảng kết quả chứa hai mảng `count`
            const result = [todayCounts, yesterdayCounts];
            setBookingByHours(result)
          } else {

          }
        }
      }

    } catch (error) {

    }
  }, [token])








  const [dayChartByType, setDayChartByType] = useState(7)
  const [bookingGroupByType, setBookingGroupByType] = useState([])
  const fetchCountByType = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var data = {
          hospitalCode: tokenjwt.hospital,
          type: "Booking",
          service: "",
          time: dayChartByType
        }
        var rs = await apiRequestAutherize("POST", "analysis/serviceHospital", token, data)

        if (rs && rs.data && rs.data.status === 200) {
          setBookingGroupByType(rs.data.data)
        }
      }
    } catch (error) {
    }
  }, [token, dayChartByType])
  useEffect(() => {
    fetchCountByType()
  }, [fetchCountByType]);




  useEffect(() => {
    fetchTotalRevenue()
  }, [fetchTotalRevenue]);
  useEffect(() => {
    fetchCountBookingByHours()
  }, [fetchCountBookingByHours]);



  const [doctorTop, setDoctorTop] = useState([])
  const [dayDoctorTop, setDayDoctorTop] = useState(7)
  const fetchTopDoctor = useCallback(async () => {
    try {
      if (token) {
        var tokenjwt = jwtDecode(token)
        var data = {
          hospitalId: tokenjwt.hospitalId,
          day: dayDoctorTop
        }
        var rs = await apiRequestAutherize("POST", "doctor/topdoctor", token, data)
        if (rs && rs.data && rs.data.status === 200) {
          setDoctorTop(rs.data.data)

        } else {
          createNotification("warning", rs.data.message, "Warning")()
        }
        console.log(rs);
      }
    } catch (error) {
      createNotification("warning", error, "Warning")()
    }
  }, [token, dayDoctorTop])

  useEffect(() => {
    fetchTopDoctor()
  }, [fetchTopDoctor]);


  const [booking, setBooking] = useState([])
  const fetchBooking = useCallback(async () => {
    try {
      if (token) {
        const today = new Date();
        const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate());
        const startDate = new Date(thirtyDaysAgo.getFullYear(), thirtyDaysAgo.getMonth(), thirtyDaysAgo.getDate(), 0, 0, 0, 0);

        var hospitalCode = jwtDecode(token).hospital
        var f = {
          gender: '',
          revenue: [],
          type: '',
          search: '',
          typeUrl: "",
          idUrl: "",
          hospitalCode: hospitalCode,
          page: 0,
          size: 200,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }

        var rs = await apiRequestAutherize("post", "booking/getall", token, f)

        if (rs && rs.data && rs.data.status === 200) {
          setBooking(rs.data.data.content)

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
    }
  }, [token])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking]);


  return (
    <div className='dashboard_P'>
      <LoadingPage isloading={isloading} />
      <div className='row_1_'>
        <div className='left'>
          <div className='item'>
            <p className='title'>
              <span>Revenue </span><span>Today</span>
            </p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeRevenue ? (
              <div className='css_line'>
                <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="gradientRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red", stopOpacity: 0.8 }} />
                        <stop offset="70%" style={{ stopColor: totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red", stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>

                    {/* Vẽ vùng bên dưới đường biểu đồ, dùng gradient */}
                    <path
                      d="M10,270 
      C50,260, 90,250, 130,230 
      S170,240, 210,230 
      S250,210, 290,220 
      S330,200, 370,210 
      S410,190, 450,180 
      L500,300 L10,300 Z"
                      fill="url(#gradientRevenue)" // Sử dụng gradient dành cho doanh thu
                    />

                    {/* Vẽ đường biểu đồ */}
                    <path
                      d="M10,270 
      C50,260, 90,250, 130,230 
      S170,240, 210,230 
      S250,210, 290,220 
      S330,200, 370,210 
      S410,190, 450,180"
                      stroke={totalRevenueProfit?.percentChangeRevenue >= 0 ? "green" : "red"}
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            ) : (<></>)}
            <p className='number'>
              {totalRevenueProfit && totalRevenueProfit.totalRevenue && formatNumberWithDot(totalRevenueProfit.totalRevenue)} VNĐ
            </p>
            {totalRevenueProfit && totalRevenueProfit.percentChangeRevenue ? (
              <p className={totalRevenueProfit.percentChangeRevenue > 0 ? "up" : "down"}>
                {totalRevenueProfit.percentChangeRevenue > 0 ? (
                  <i className="fa-solid fa-arrow-up-wide-short"></i>
                ) : (
                  <i className="fa-solid fa-arrow-down-wide-short"></i>
                )}
                {totalRevenueProfit.percentChangeRevenue.toFixed(2)}%
              </p>
            ) : (<></>)}
          </div>
        </div>
        <div className='right'>
          <div className='item'>
            <p className='namehospital'>{tokenJwt?.hospitalName}</p>
          </div>

        </div>
      </div>
      <div className='row_2_'>
        <div className='left'>
          <div className='item'>
            <div className='b_info'>
              <p>Booking</p>
              <div>{formatDateNotTime(currentDate)}</div>
            </div>
            {bookingByHours && bookingByHours.length > 0 && (
              <ChartBookingByHours labelData={labelData} labelSet={labelSet} lableValue={labelValue} bookingData={bookingByHours} key={"l_2_1"} />
            )}

          </div>

        </div>
        <div className='right'>
          <div className='item'>
            <div className='b_info'>
              <p>Top Doctor</p>
              <SelectStyle defaultValue={dayDoctorTop} onChange={(e) => setDayDoctorTop(e.target.value)}>
                <option value={1}>To day</option>
                <option value={7}>Last Weeks</option>
                <option value={30}>Last Month</option>
                <option value={365}>Last Years</option>
              </SelectStyle>
            </div>
            <div className='list_doctor_top'>
              {doctorTop && doctorTop.length > 0 && doctorTop.map((item, index) => (
                <div className='item_doctor' key={index}>
                  <p>{index + 1}</p>
                  <div className='box_avatar'>
                    <img alt='' src={GetImageFireBase(item.avatar)} />
                  </div>
                  <div className='box_name_code'>
                    <p>{item.name}</p>
                    <p>{item.code}</p>
                  </div>
                  <p className='count_chedule'>{item.countBooking} Shedule</p>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
      <div className='row_3_'>

        <div className='box_booking_list'>

          <div className='header_tb'>
            <p>No</p>
            <p>Type</p>
            <p>Name</p>
            <p>Gender</p>
            <p>Phone</p>
            <p>Schedule</p>
            <p>Revenue</p>
            <p>Create Date</p>

          </div>

          <div className='body_tb'>
            {booking && booking.length > 0 && booking.map((item, index) => (
              <div className='item' key={item.id}>
                <p>{index + 1}</p>
                <div className='box_img'>
                  <img alt='' src={GetImageFireBase(iconItemBooking(item.typeName))} />
                </div>
                <p>{item.name} </p>
                <p>{item.gender} </p>
                <p>{item.phone} </p>
                <p>{formatDateNotTime(item.bookingDate)}-{item.bookingTime} </p>
                <p>{item.revenue} </p>
                <p>{formatDate(item.createDate)} </p>
              </div>
            ))}
          </div>
        </div>


      </div>

    </div >
  );
}

const iconItemBooking = (type) => {
  switch (type.toLowerCase()) {
    case 'doctor':
      return 'image2.png'
    case 'vaccine':
      return 'image6.png'
    case 'testing':
      return 'image5.png'
    default:
      return 'image4.png'
  }
}
const formatDate = (datetimeStr) => {
  const date = new Date(datetimeStr);
  const now = new Date();

  // Tính toán sự chênh lệch giữa ngày hiện tại và ngày truyền vào
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Nếu ngày truyền vào là ngày hiện tại
  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes} phút trước`;
    }
    return `${diffInSeconds} giây trước`;
  }

  // Nếu ngày truyền vào trong tuần (vượt quá ngày hôm nay nhưng không quá 7 ngày)
  if (diffInDays <= 7) {
    return `${diffInDays} ngày trước`;
  }

  // Nếu ngày đã vượt quá 7 ngày, hiển thị theo định dạng ngày/tháng/năm
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Trả về theo định dạng ngày/tháng/năm giờ:phút
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};


