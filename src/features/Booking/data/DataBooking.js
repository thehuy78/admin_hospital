import styled from "styled-components";






export const ListBookingPage = styled.div`
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
      gap: 1rem;
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
min-height:33rem;
      .table_ {
        border-collapse: collapse;
        width: 100%;
        thead {
          background-color: var(--cl_3);
          th {
          text-transform: capitalize;
            padding: 0.5rem 0.3rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
          }
        }

        tbody {
          background-color: white;

          tr {
            border-bottom: 0.05rem solid var(--shadow-black);

            td {
            height:48px;
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
export const typebooking = [
  { value: "", label: "All Type" },
  { value: "Doctor", label: "Doctor" },
  { value: "Package", label: "Package" },
  { value: "Testing", label: "Testing" },
  { value: "Vaccine", label: "Vaccine" },
];


export const gender = [
  { value: "", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const revenue = [
  { value: [], label: "All" },
  { value: [0, 150000], label: " < 150.000đ" },
  { value: [150000, 500000], label: "150.000đ - 500.000đ" },
  { value: [500000, 50000000], label: "250.000đ - 500.000đ" },
];


export const theadTopic = [
  "email",
  "name",
  "phone",
  "gender",
  "dob",
  "province",
  "identifier",
  "bookingDate",
  "bookingTime",
  "type",
  "revenue",
  "profit",
  "hospital",

  "createDate",
  "updateDate",
  "status",
];



export const BookingDetailPage = styled.div`


  padding:0 2rem 1rem 2rem;
  .details {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    padding-top: 0.5rem;
background-color: var(--white);
    .left {
      background-color: var(--cl_1);
      width: 100%;
      min-height: 10rem;
      padding: 1rem;
      color: var(--cl_2);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .id_booking {
        text-align: center;
        font-size: var(--fz_medium);
        font-weight: 800;
      }
      .patient_info {
        display: flex;
        flex-direction: column;

        .title {
          font-weight: 800;
          padding-bottom: 0.5rem;
          color: var(--cl_4);
        }
        div {
          padding: 0.3rem 0;
          display: flex;
          gap: 1rem;
          p:first-child {
            font-weight: 800;
            font-size: var(--fz_small);
          }
        }
        .tt_cn {
          display: flex;
          gap: 2rem;
          justify-content: space-between;
          div {
            display: flex;
            gap: 1rem;
          }
        }
        .tt_location {
          display: flex;
          gap: 2rem;
          justify-content: space-between;
          div {
            display: flex;
            gap: 1rem;
          }
        }
      }
      .hospital_info {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 800;
          padding-bottom: 0.5rem;
          color: var(--cl_4);
        }
        .content {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 1rem;
        }
        .info {
          width: 100%;
          div {
            padding: 0.3rem 0;
            display: flex;
            gap: 1rem;
            p:first-child {
              font-weight: 800;
              font-size: var(--fz_small);
            }
          }
          .tt_cn {
            display: flex;
            gap: 2rem;
            justify-content: space-between;
            div {
              display: flex;
              gap: 1rem;
            }
          }
        }
        .logo {
          width: 100%;
          overflow: hidden;
          padding: 2rem;
          img {
            width: 100%;
          }
        }
      }
      .time_info {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 800;
          padding-bottom: 0.5rem;
          color: var(--cl_4);
        }
        div {
          padding: 0.3rem 0;
          display: flex;
          gap: 1rem;
          p:first-child {
            font-weight: 800;
            font-size: var(--fz_small);
          }
        }
      }
    }
    .right {
      background-color: var(--cl_1);
      width: 100%;
      min-height: 10rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .info_account {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 800;
          padding-bottom: 0.5rem;
          color: var(--cl_4);
        }
        div {
          padding: 0.3rem 0;
          display: flex;
          gap: 1rem;
          p:first-child {
            font-weight: 800;
            font-size: var(--fz_small);
          }
        }
      }
      .btn_send {
        width: 100%;
        button {
          width: 100%;
          padding: 0.5rem 0;
          outline: none;
          color: white;
          font-weight: 800;
          background-color: var(--cl_3);
          border: none;
          box-shadow:
            -2px -2px 2px var(--cl_1),
            2px 2px 2px var(--cl_2);
        }
      }
    }
  }

`;
