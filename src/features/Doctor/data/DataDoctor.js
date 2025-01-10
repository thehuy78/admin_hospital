import styled from "styled-components";

export const headerjson = [
  "code",
  "avatar",
  "name",
  "daywork",
  "timework",
  "level",
  "gender",
  "fee",
  "room",
  "pattient",
  "status",
];

export const leveldoctor = [
  { value: "", label: "All" },
  { value: "Doctor", label: "Doctor" },
  { value: "Master", label: "Master" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "Professor", label: "Professor" },
];

export const timeWork = [
  { value: "", label: "All" },
  { value: "full day", label: "Full Day" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
];

export const gender = [
  { value: "", label: "All" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const fee = [
  { value: [], label: "All" },
  { value: [0, 150000], label: "<150.000Đ" },
  { value: [150000, 250000], label: "150.000Đ - 250.000Đ" },
  { value: [250000, 25000000], label: ">250.000Đ" },
];


export const workdayForm = [
  { value: 'T2', label: 'Monday' },
  { value: 'T3', label: 'Tuesday' },
  { value: 'T4', label: 'Wednesday' },
  { value: 'T5', label: 'Thursday' },
  { value: 'T6', label: 'Friday' },
  { value: 'T7', label: 'Saturday' },
  { value: 'CN', label: 'Sunday' },
];

export const leveldoctorForm = [

  { value: "Doctor", label: "Doctor" },
  { value: "Master", label: "Master" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "Professor", label: "Professor" },
];

export const timeWorkForm = [
  { value: "05:00-06:00", label: "05:00-06:00" },
  { value: "05:30-06:30", label: "05:30-06:30" },
  { value: "06:00-07:00", label: "06:00-07:00" },
  { value: "06:30-07:30", label: "06:30-07:30" },
  { value: "07:00-08:00", label: "07:00-08:00" },
  { value: "07:30-08:30", label: "07:30-08:30" },
  { value: "08:00-09:00", label: "08:00-09:00" },
  { value: "08:30-09:30", label: "08:30-09:30" },
  { value: "09:00-10:00", label: "09:00-10:00" },
  { value: "09:30-10:30", label: "09:30-10:30" },
  { value: "10:00-11:00", label: "10:00-11:00" },
  { value: "10:30-11:30", label: "10:30-11:30" },
  { value: "11:00-12:00", label: "11:00-12:00" },
  { value: "12:30-13:30", label: "12:30-13:30" },
  { value: "13:00-14:00", label: "13:00-14:00" },
  { value: "13:30-14:30", label: "13:30-14:30" },
  { value: "14:00-15:00", label: "14:00-15:00" },
  { value: "14:30-15:30", label: "14:30-15:30" },
  { value: "15:00-16:00", label: "15:00-16:00" },
  { value: "15:30-16:30", label: "15:30-16:30" },
  { value: "16:00-17:00", label: "16:00-17:00" },
  { value: "16:30-17:30", label: "16:30-17:30" },
  { value: "17:00-18:00", label: "17:00-18:00" },
  { value: "18:30-19:30", label: "18:30-19:30" }

];

export const genderForm = [

  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const ListDoctorPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding:0 0 1rem 0;
  .section_filter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    .left {
      display: flex;
      gap: 0.5rem;
    }
    .right {
      display: flex;
      gap: 0.5rem;
      .r_b_filter_column {
        position: relative;
        .b_filter_column {
          height: 2.5rem;
          width: 2.5rem;
          cursor: pointer;
          background-color: white;
          aspect-ratio: 1/1;
          border-radius: 0.3rem;
          border: 1px solid var(--shadow-black);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .overlay {
          position: absolute;
          right: 0;
          padding-top: 0.5rem;
          .triangle {
            position: absolute;
            top: 10px; /* Adjust this value to change the vertical position */
            right: 0.6rem; /* Move the triangle to the left of the overlay */
            /* Adjusts the distance from the overlay */
            z-index: 0;
            top: 0;
            height: 0;
            border-left: 0.5rem solid transparent; /* Left border */
            border-right: 0.5rem solid transparent; /* Right border */
            border-bottom: 0.5rem solid var(--white); /* Bottom border color */
          }
          .list_action {
            background-color: var(--cl_1);
            border-radius: 0.3rem;
            border: 1px solid var(--white);
            padding: 1rem;
            width: max-content;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            div {
              display: flex;
              gap: 0.5rem;
            }
          }
        }
      }
    }
  }
  .section_list {
    width: 100%;
    display: flex;
    flex-direction: column;
    .data_table {
      overflow-x: auto;
      scrollbar-width: thin;
      min-height: 33rem;
      .table_ {
        border-collapse: collapse;
        width: 100%;
        thead {
          background-color: var(--cl_3);
          th {
            padding: 0.5rem 0.3rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;
          }
        }

        tbody {
          background-color: white;

          tr {
            border-bottom: 0.05rem solid var(--shadow-black);

            td {
              height: 80px;
              padding: 0 0.5rem;
              text-align: center;
              font-size: var(--fz_small);
              width: max-content;
              white-space: nowrap;
            
            }
          }
        }
      }
    }
  }
`;
