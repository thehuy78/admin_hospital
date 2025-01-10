import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
`;

const Input = styled.input`
  align-items: center;
  background-color: white;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  height: 2.5rem;
  overflow: hidden;
  width: 200px;
  font-size: 15px;
  border: 1px solid var(--shadow-black);
  box-shadow: 0 0 2px var(--shadow-black);

  &:focus {
    outline: none;
    border-color: #66afe9;
  }
`;

const CalendarDropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 10;
`;

// Custom styles to format weekday names and adjust font size
const StyledCalendar = styled(Calendar)`
  .react-calendar__month-view__weekdays {
    font-size: 0.8rem;
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    display: none; /* Hide original weekday text */
  }

  /* Inject custom weekday labels */
.react-calendar__month-view__weekdays__weekday::before{
  font-size: 0.8rem;
    text-transform: capitalize;
}

  .react-calendar__month-view__weekdays__weekday:nth-child(1)::before { content: 'Mon'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(2)::before { content: 'Tue'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(3)::before { content: 'Wed'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(4)::before { content: 'Thu'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(5)::before { content: 'Fri'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(6)::before { content: 'Sat'; }
  .react-calendar__month-view__weekdays__weekday:nth-child(7)::before { content: 'Sun'; }
`;

const RangeDateInput = ({ fnChangeValue, defaultValue }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const today = new Date();

  // Calculate the date 3 months from today
  const minSelectableDate = new Date();
  minSelectableDate.setMonth(today.getMonth() - 3);

  const handleDateChange = (dates) => {
    fnChangeValue(dates);
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <Container>
      <Input
        type="text"
        value={`${formatDate(defaultValue[0])} - ${formatDate(defaultValue[1])}`}
        onClick={toggleCalendar}
        readOnly
        placeholder="mm/dd/yyyy"
      />
      {isCalendarOpen && (
        <CalendarDropdown>
          <StyledCalendar
            selectRange={true}
            onChange={handleDateChange}
            value={defaultValue}
            minDate={minSelectableDate}
            maxDate={today}
          />
        </CalendarDropdown>
      )}
    </Container>
  );
};

export default RangeDateInput;
