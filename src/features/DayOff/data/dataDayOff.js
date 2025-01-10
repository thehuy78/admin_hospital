import styled from "styled-components";

export const headerjson =
  [
    "type off",
    "doctor",
    "day off",
    "description",
    "create",
    "user create",
    "status"
  ]

export const dayoffjson =
  [
    {
      "dayoff": "2024-11-21T03:32:34.523+00:00",
      "description": "Nghĩ phép gia đình",
      "doctorCode": "DHYD-KHMY-DT",
      "doctorName": "Nguyễn Thế Huy",
      "doctorAvatar": "hi.jpg",
      "typeoff": "Doctor",
      "create": "2024-11-21T03:32:34.523+00:00",
      "usercreate": "ngocnhi@gmail.com",
      "status": "active"
    },
    {
      "dayoff": "2024-11-21T03:32:34.523+00:00",
      "description": "Nghĩ phép gia đình",
      "doctorCode": "DHYD-KHMY-DT",
      "doctorName": "Nguyễn Thế Huy",
      "doctorAvatar": "hi.jpg",
      "typeoff": "Doctor",
      "create": "2024-11-21T03:32:34.523+00:00",
      "usercreate": "ngocnhi@gmail.com",
      "status": "active"
    },
    {
      "dayoff": "2024-11-21T03:32:34.523+00:00",
      "description": "Nghĩ phép gia đình",
      "doctorCode": "DHYD-KHMY-DT",
      "doctorName": "Nguyễn Thế Huy",
      "doctorAvatar": "hi.jpg",
      "typeoff": "Doctor",
      "create": "2024-11-21T03:32:34.523+00:00",
      "usercreate": "ngocnhi@gmail.com",
      "status": "active"
    },

  ]

export const ListDayOff = styled.div`
width: 100%;
display: flex;
flex-direction: column;
gap: 0.5rem;
padding: 1rem 0;

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
    
  }
}
.section_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  .data_table {
    overflow-x: auto;
    scrollbar-width: thin;
min-height:30rem;
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
            padding: 0.9rem 0.5rem;
            text-align: center;
            font-size: var(--fz_small);
            width: max-content;
            white-space: nowrap;
            .box_doctor {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 40px;
    height: 40px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  .b_doctor_name {
    display: flex;
    flex-direction: column;
    justify-content: left;
     align-items: start;
    gap: 0.3rem;
    p:first-child {
      font-weight: 700;
    }
    p:last-child {
      font-size: var(--fz_smallmax);
    }
  }
}
            
          }
        }
      }
    }
  }
}
`;