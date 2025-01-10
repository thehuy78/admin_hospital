
import React, { useCallback, useEffect, useState } from 'react'
import SelectInput from '../../../shared/component/InputFilter/SelectInput'
import { optionTypeData, optionTypeServices, optionTimeChart, optionChart, AnalysisPage } from "../data/dataAnalysis"
import { useAdminContext } from '../../../shared/hook/ContextToken'
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther'
import ChartBookingByDayOfWeek from '../../Dashboard/component/ChartBookingByDayOfWeek'
import ChartBookingByHours from '../../Dashboard/component/ChartBookingByHours'
import ChartBookingByAge from '../../Dashboard/component/ChartBookingByAge'
import LoadingPage from '../../../shared/Config/LoadingPage'
import { NotificationContainer } from 'react-notifications'
import ChartMapProvince from '../../Dashboard/component/ChartMapProvince'
import { jwtDecode } from 'jwt-decode'
export default function Analysis() {
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAdminContext()
  const [btnTypeChart, setBtnTypeChart] = useState("column")
  //data render chart

  const [typeData, setTypeData] = useState(optionTypeData[0].value)
  const [typeServices, setTypeServices] = useState(optionTypeServices[0].value)
  const [timeChart, setTimechart] = useState(optionTimeChart[0].value)

  const [label, setLabel] = useState()
  const [data, setData] = useState()
  const [labelSet, setLabelSet] = useState()
  const [LabelValue, setLabelValue] = useState()
  const drawChart1 = async () => {
    try {
      if (token) {
        var tokenJwt = jwtDecode(token)
        var data = {
          hospitalCode: tokenJwt.hospital,
          type: typeData,
          service: typeServices,
          time: timeChart
        }
        var rs = await apiRequestAutherize("post", 'analysis/chart1', token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          var dt = rs.data.data
          var lb = []
          var dataChart = []
          var curent = []
          var prev = []
          if (dt.currentPeriod.length === 7) {
            lb = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            if (timeChart === 7) {
              setLabelSet(["This Week", "Last Week"])

            } else {
              setLabelSet(["This Month", "Last Month"])
            }

            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue(["Day of Week", "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Day of Week", "Profit"])
              } else {
                setLabelValue(["Day of Week", "Booking"])
                curent.push(e.bookingsCount)
              }

            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }

            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 24) {
            lb = ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h",
              "8h", "9h", "10h", "11h", "12h", "13h", "14h",
              "15h", "16h", "17h", "18h", "19h", "20h", "21h",
              "22h", "23h"]
            setLabelSet(["Today", "Yesterday"])
            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                setLabelValue(["Hours", "Revenue"])
                curent.push(e.totalRevenue)
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Hours", "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue(["Hours", "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          }
          else if (dt.currentPeriod.length === 12) {
            lb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            setLabelSet(["This Year", "Last Year"])
            dt.currentPeriod.forEach(e => {
              if (typeData === "revenue") {
                curent.push(e.totalRevenue)
                setLabelValue(["Month", "Revenue"])
              } else if (typeData === "profit") {
                curent.push(e.totalProfit)
                setLabelValue(["Month", "Profit"])
              } else {
                curent.push(e.bookingsCount)
                setLabelValue(["Month", "Booking"])
              }
            });
            dt.previousPeriod.forEach(e => {
              if (typeData === "revenue") {
                prev.push(e.totalRevenue)
              } else if (typeData === "profit") {
                prev.push(e.totalProfit)
              } else {
                prev.push(e.bookingsCount)
              }
            });
            dataChart.push(curent)
            dataChart.push(prev)
            setLabel(lb)
            setData(dataChart)
          } else {

          }
        }
      }
    } catch (error) {

    }
  }




  const [typeFetch, setTypeFetch] = useState([])
  const fetchType = useCallback(async () => {
    try {
      if (token) {
        var rs = await apiRequestAutherize("get", "type/getTypeBooking", token)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          const result = rs.data.data;
          setTypeFetch(result);
        }
      }
    } catch (error) {
    }
  }, [token])

  useEffect(() => {

    fetchType()
  }, [fetchType]);



  const [timeChartCircle, setTimeChartCircle] = useState()
  const [dataChartCircle, setDataChartCircle] = useState()
  const [labelChartCircle, setLabelChartCircle] = useState()
  const bgColorChartCircle = ["rgb(139, 213, 252)", "rgb(183, 192, 249)", "rgb(66, 93, 113)", "rgb(245, 177, 177)"]
  const compareServiceChart = async () => {
    try {
      if (token) {
        var tokenJwt = jwtDecode(token)
        var data = {
          hospitalCode: tokenJwt.hospital,
          type: typeData,
          service: "",
          time: timeChart
        }
        console.log(data);
        var times = ''
        switch (timeChart) {
          case 1:
            times = 'Today'
            break;
          case 7:
            times = 'Last 7 Day'
            break;
          case 30:
            times = 'Last 1 Month'
            break;
          case 365:
            times = 'Last 1 Year'
            break;
          default:
            break;
        }
        setTimeChartCircle(times)
        var rs = await apiRequestAutherize("post", 'analysis/serviceHospital', token, data)
        console.log(rs);
        if (rs && rs.data && rs.data.status === 200) {
          var dataRespon = rs.data.data
          var label = []
          var dataSet = []
          typeFetch.forEach(e => {
            var d = dataRespon.find(t => t.nameService === e.name)
            if (d) {
              label.push(d.nameService)
              switch (typeData) {
                case "Booking":
                  dataSet.push(d.bookingsCount)
                  break;
                case "revenue":
                  dataSet.push(d.totalRevenue)
                  break;
                case "profit":
                  dataSet.push(d.totalProfit)
                  break;
                default:
                  break;
              }
            } else {
              label.push(e.name)
              dataSet.push(0)
            }
          });
          setLabelChartCircle(label)
          setDataChartCircle(dataSet)
        }
      }
    } catch (error) {

    }
  }



  const formattedOptions = (options) => {
    return options.map(option => ({
      value: option.code,
      label: option.name
    }));
  }

  const [opChart, setOpChart] = useState(1)

  useEffect(() => {
    setData()
    setLabel()
    setLabelSet()
    setLabelValue()
  }, [opChart]);




  return (
    <AnalysisPage>
      <LoadingPage isloading={isLoading} />
      <NotificationContainer />
      <p className='title'>Analysis Report Medcare</p>
      <section className='sec_1_filter'>
        <div className='b____'>
          <p>Type:</p>
          <SelectInput multi={false} defaultVl={optionChart.find(op => op.value === opChart)} options={optionChart} fnChangeOption={(e) => { setOpChart(e.value) }} />
        </div>
        {opChart && opChart === 1 && (
          <div className='box_selectfilter'>

            <div className='item_select_'>
              <p>Choose Type</p>
              <SelectInput minWidth={"auto"} options={optionTypeData} defaultVl={optionTypeData.find(op => op.value === typeData)} multi={false} fnChangeOption={(e) => { setTypeData(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Service</p>
              <SelectInput minWidth={"auto"} options={optionTypeServices} defaultVl={optionTypeServices.find(op => op.value === typeServices)} multi={false} fnChangeOption={(e) => { setTypeServices(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Times</p>
              <SelectInput minWidth={"auto"} options={optionTimeChart} defaultVl={optionTimeChart.find(op => op.value === timeChart)} multi={false} fnChangeOption={(e) => { setTimechart(e.value) }} />
            </div>
            <div className='btn_button_chart'>
              <button onClick={drawChart1}>Draw a chart</button>
            </div>
          </div>
        )}

        {opChart && opChart === 3 && (
          <div className='box_selectfilter'>

            <div className='item_select_'>
              <p>Choose Type</p>
              <SelectInput minWidth={"auto"} options={optionTypeData} defaultVl={optionTypeData.find(op => op.value === typeData)} multi={false} fnChangeOption={(e) => { setTypeData(e.value) }} />
            </div>
            <div className='item_select_'>
              <p>Choose Times</p>
              <SelectInput minWidth={"auto"} options={optionTimeChart} defaultVl={optionTimeChart.find(op => op.value === timeChart)} multi={false} fnChangeOption={(e) => { setTimechart(e.value) }} />
            </div>
            <div className='btn_button_chart'>
              <button onClick={compareServiceChart}>Draw a chart</button>
            </div>
          </div>
        )}

      </section>
      {opChart && [1, 2].includes(opChart) && (
        <section className='chart_session'>

          {data && label && data.length > 0 && label.length > 0 &&
            labelSet && LabelValue && labelSet.length > 0 && LabelValue.length > 0 &&
            (
              <>
                {btnTypeChart === "column" && (
                  <div className='chart_content'>
                    <ChartBookingByDayOfWeek data={data} labelData={label} labelSet={labelSet} labelValue={LabelValue} />
                  </div>
                )}
                {btnTypeChart === "line" && (
                  <div className='chart_content'>
                    <ChartBookingByHours bookingData={data} lableValue={LabelValue} labelData={label} labelSet={labelSet} />
                  </div>
                )}
                <div className='type_chart'>
                  <button onClick={() => { setBtnTypeChart('line') }}><i className="fa-solid fa-chart-line"></i></button>
                  <button onClick={() => { setBtnTypeChart('column') }}><i className="fa-solid fa-chart-column"></i></button>
                </div>

              </>
            )}

        </section>
      )}
      {opChart && [3].includes(opChart) && (
        <section className='chart_circel_session'>

          {dataChartCircle && labelChartCircle && dataChartCircle.length > 0 && labelChartCircle.length > 0 &&
            (
              <div className='chart_content'>
                hihi
                {timeChartCircle && <p>{typeData} {timeChartCircle}</p>}
                <div className='b_chart_circle'>
                  <ChartBookingByAge bgColor={bgColorChartCircle} data={dataChartCircle} labelData={labelChartCircle} key={"chart_circle"} />
                </div>

              </div>

            )}

        </section>
      )}

    </AnalysisPage>
  )
}
