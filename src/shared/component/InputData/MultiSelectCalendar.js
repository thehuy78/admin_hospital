import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const MultiSelectCalendar = ({ fnCallback, err }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const today = new Date();

  // Giới hạn khoảng thời gian từ 7 ngày trước đến 60 ngày sau
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);

  // Hàm xử lý khi chọn ngày
  const onChange = (date) => {
    // Kiểm tra nếu ngày đã chọn thì loại bỏ, nếu chưa chọn thì thêm vào
    if (selectedDates.some((d) => d.getTime() === date.getTime())) {

      setSelectedDates(selectedDates.filter((d) => d.getTime() !== date.getTime()));
      fnCallback(selectedDates.filter((d) => d.getTime() !== date.getTime()))
    } else {
      setSelectedDates([...selectedDates, date]);
      fnCallback([...selectedDates, date])
    }
  };

  // Hàm kiểm tra xem ngày có nằm trong khoảng giới hạn không
  const isDateSelectable = (date) => {
    return date >= minDate && date <= maxDate;
  };

  return (
    <div>
      <Calendar
        onClickDay={(value) => isDateSelectable(value) && onChange(value)}
        tileClassName={({ date, view }) => {
          if (
            selectedDates.some((d) => d.getTime() === date.getTime())
          ) {
            return "selected-date";
          }
          if (!isDateSelectable(date)) {
            return "disabled-date";
          }
          return null;
        }}
      />
      <ul>
        <p style={{ color: "red", fontSize: "var(--fz_smallmax)" }}>{err}</p>
        <h4>Các ngày đã chọn:</h4>
        {selectedDates.map((date, index) => (
          <li key={index}>{date.toDateString()}</li>
        ))}
      </ul>
      <style>
        {`
          .selected-date {
            background: #4caf50;
            color: white;
          }
          .disabled-date {
            background: #f5f5f5;
            color: #ccc;
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default MultiSelectCalendar;
