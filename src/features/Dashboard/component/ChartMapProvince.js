import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { geoCentroid } from 'd3-geo';
import vietnamGeoJSON from '../../../shared/data/vietnam.geojson'; // Đường dẫn đến file GeoJSON của bạn
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Import Tooltip từ react-tooltip
import styled from 'styled-components';

// Dữ liệu tỷ lệ đặt chỗ cho các tỉnh (63 tỉnh thành)
const bookingData = [
  { "name": "Hà Nội", "count": 4, "percent": 0.55 },
  { "name": "Hồ Chí Minh city", "count": 3000, "percent": 0.9 },  // Hồ Chí Minh city với count cao
  { "name": "Đà Nẵng", "count": 5, "percent": 0.8 },
  { "name": "Phú Yên", "count": 3, "percent": 0.3 },
  { "name": "Bình Định", "count": 2, "percent": 0.6 },
  { "name": "Hải Phòng", "count": 6, "percent": 0.7 },
  { "name": "Cần Thơ", "count": 7, "percent": 0.5 },
  { "name": "Hải Dương", "count": 4, "percent": 0.4 },
  { "name": "Bắc Giang", "count": 6, "percent": 0.6 },
  { "name": "Bắc Ninh", "count": 8, "percent": 0.65 },

  { "name": "Quảng Ninh", "count": 5, "percent": 0.75 },
  { "name": "Đắk Lắk", "count": 9, "percent": 0.45 },
  { "name": "Lâm Đồng", "count": 6, "percent": 0.5 },
  { "name": "Thừa Thiên - Huế", "count": 3, "percent": 0.35 },
  { "name": "Long An", "count": 2500, "percent": 0.85 }, // Long An với count cao
  { "name": "An Giang", "count": 8, "percent": 0.4 },
  { "name": "Hậu Giang", "count": 2, "percent": 0.3 },
  { "name": "Tiền Giang", "count": 4, "percent": 0.55 },
  { "name": "Sóc Trăng", "count": 5, "percent": 0.2 },
  { "name": "Cà Mau", "count": 3, "percent": 0.15 },
  { "name": "Kiên Giang", "count": 9, "percent": 0.6 },
  { "name": "Trà Vinh", "count": 0, "percent": 0 }, // Trà Vinh với count 0
  { "name": "Vĩnh Long", "count": 0, "percent": 0 }, // Vĩnh Long với count 0
  { "name": "Đồng Tháp", "count": 2, "percent": 0.45 },
  { "name": "Bến Tre", "count": 1, "percent": 0.5 },
  { "name": "Nghệ An", "count": 3, "percent": 0.7 },
  { "name": "Hà Tĩnh", "count": 4, "percent": 0.55 },

  { "name": "Quảng Bình", "count": 8, "percent": 0.5 },
  { "name": "Quảng Trị", "count": 6, "percent": 0.65 },
  { "name": "Gia Lai", "count": 7, "percent": 0.45 },
  { "name": "Kon Tum", "count": 5, "percent": 0.3 },
  { "name": "Thanh Hóa", "count": 9, "percent": 0.6 },
  { "name": "Lào Cai", "count": 8, "percent": 0.55 },
  { "name": "Sơn La", "count": 6, "percent": 0.45 },
  { "name": "Tuyên Quang", "count": 7, "percent": 0.4 },
  { "name": "Cao Bằng", "count": 4, "percent": 0.35 },
  { "name": "Lai Châu", "count": 3, "percent": 0.2 },
  { "name": "Yên Bái", "count": 5, "percent": 0.5 },
  { "name": "Hòa Bình", "count": 2, "percent": 0.6 },

  { "name": "Bắc Kạn", "count": 0, "percent": 0 }, // Bắc Kạn với count 0
  { "name": "Vĩnh Phúc", "count": 9, "percent": 0.65 },
  { "name": "Phú Thọ", "count": 8, "percent": 0.75 },
  { "name": "Ninh Bình", "count": 7, "percent": 0.45 },
  { "name": "Quảng Nam", "count": 9, "percent": 0.55 },
  { "name": "Hà Giang", "count": 4, "percent": 0.3 },

  { "name": "Thái Nguyên", "count": 9, "percent": 0.6 },
  { "name": "Nam Định", "count": 6, "percent": 0.35 },
  { "name": "Lạng Sơn", "count": 7, "percent": 0.45 },
  { "name": "Tây Ninh", "count": 8, "percent": 0.6 },
  { "name": "Bình Thuận", "count": 7, "percent": 0.55 },
  { "name": "Bà Rịa - Vũng Tàu", "count": 5, "percent": 0.45 },
  { "name": "Ninh Thuận", "count": 0, "percent": 0 }, // Ninh Thuận với count 0
  { "name": "Khánh Hòa", "count": 0, "percent": 0 }, // Khánh Hòa với count 0
  { "name": "Đăk Nông", "count": 1, "percent": 0.3 },
  { "name": "Bình Phước", "count": 2, "percent": 0.4 },
  { "name": "Đồng Nai", "count": 3, "percent": 0.5 },
  { "name": "Bình Dương", "count": 6, "percent": 0.65 },
  { "name": "Bạc Liêu", "count": 0, "percent": 0 }, // Bạc Liêu với count 0
  { "name": "Quảng Ngãi", "count": 7, "percent": 0.5 },
  { "name": "Thái Bình", "count": 5, "percent": 0.45 },
  { "name": "Hà Nam", "count": 4, "percent": 0.35 },
  { "name": "Hưng Yên", "count": 6, "percent": 0.45 },
  { "name": "Điện Biên", "count": 5, "percent": 0.5 }
];




const colorScale = scaleLinear()
  .domain([0, 1]) // 0% đến 100%
  .range(['#FFFF00', '#FF0000']);

const splitDataIntoRows = (data, rowSize) => {
  const rows = [];
  for (let i = 0; i < data.length; i += rowSize) {
    rows.push(data.slice(i, i + rowSize));
  }
  return rows;
};

// Chia bookingData thành các rows
const rows = splitDataIntoRows(bookingData, 23);
console.log(rows);

function ChartMapProvince() {
  const [hoveredProvince, setHoveredProvince] = useState(null); // Lưu tên tỉnh khi hover
  const [bookingProvinceCurrent, setBookingProvinceCurrent] = useState(null);

  return (
    <ChartStyle>
      <div className='b_table'>
        {rows && rows.length > 0 && rows.map((item, index) => (
          <table key={index}>
            <thead>
              <tr>
                <th>Province</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              {item && item.length > 0 && item.map((province, indexs) => (
                <tr key={indexs} className={hoveredProvince === province.name ? "active" : ""}
                  onMouseEnter={() => setHoveredProvince(province.name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                >
                  <td>{province.name}</td>
                  <td>{province.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}

      </div>
      <div className='chart'>
        <ComposableMap
          projection="geoMercator"
          width={400}
          height={600}
          viewBox="0 0 400 900"
          projectionConfig={{
            scale: 2100,
            center: [105.8, 15.9],
          }}
        >
          <Geographies geography={vietnamGeoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const provinceName = geo.properties.name;
                const bookingDataEntry = bookingData.find(data => data.name === provinceName);
                const bookingRate = bookingDataEntry ? bookingDataEntry.percent : 0;
                const centroid = geoCentroid(geo);

                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={colorScale(bookingRate)}
                      onMouseEnter={() => {
                        setHoveredProvince(provinceName);
                        setBookingProvinceCurrent(bookingDataEntry);
                      }}
                      onMouseLeave={() => {
                        setHoveredProvince(null);
                        setBookingProvinceCurrent(null);
                      }}
                      style={{

                        default: { outline: "none", cursor: "pointer", fill: hoveredProvince === provinceName && "green" },
                        hover: { outline: "none", fill: "green" },
                        pressed: { outline: "none" },
                        cursor: "pointer"
                      }}
                    />
                    {hoveredProvince === provinceName && centroid[0] && centroid[1] && (
                      <Annotation
                        subject={centroid}
                        dx={0}
                        dy={-20}
                        connectorProps={{
                          stroke: "none",
                        }}
                      >
                        <text
                          x={0}
                          y={0}
                          style={{
                            fill: '#000',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            textAnchor: 'middle',

                          }}
                          data-tooltip-id={provinceName}
                          data-tooltip-content={provinceName}
                        />
                        <ReactTooltip id={provinceName} place="top" effect="solid" />
                      </Annotation>
                    )}
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </ChartStyle>
  );
}

export default ChartMapProvince;



const ChartStyle = styled.div`


  display: flex;
  //grid-template-columns: 2fr 2.8fr;
  gap: 1rem;
  justify-content: space-between;
  .chart {
    width: 400px;
    height: 700px;
    // background-color: aqua;
  }
  .b_table {
    width: calc(100% - 400px);
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 0 0.3rem var(--shadow-black);
    height: fit-content;
    padding: 1rem 0;

    table {
      height: fit-content;
      border-collapse: collapse;
      thead {
        tr {
          background-color: var(--cl_3);

          th {
            font-weight: 700;
            font-size: var(--fz_small);
            padding: 0 1rem;
            color: white;
          }
        }
      }
      tbody {
        height: fit-content;
        tr {
          height: fit-content;
          overflow: hidden;
          transition: 0.3s ease-in;
          cursor: pointer;
          td {
            font-size: var(--fz_smallmax);
            text-align: center;
            height: fit-content;
            padding: 0.2rem 0.5rem;
          }
        }
        tr:nth-child(even) {
          background-color: var(--cl_1);
        }
        .active {
          background-color: green !important;
          transform: scale(1.1);
          td {
            color: white;
          }
        }
      }
    }
  }

`;