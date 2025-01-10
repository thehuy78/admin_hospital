import styled from "styled-components"

export const optionTimeChart = [
  {
    value: 1,
    label: "Today"
  },
  {
    value: 7,
    label: "Last 7 days"
  },
  {
    value: 30,
    label: "Current month"
  },
  {
    value: 365,
    label: "Current year"
  },
]

export const optionTypeData = [
  {
    value: "Booking",
    label: "Booking"
  },
  {
    value: "revenue",
    label: "Revenue"
  },
  {
    value: "profit",
    label: "Profit"
  },
]


export const optionTypeServices = [
  {
    value: "",
    label: "All"
  },
  {
    value: "Doctor",
    label: "Khám bệnh"
  },
  {
    value: "Package",
    label: "Package"
  },
  {
    value: "Testing",
    label: "Testing"
  },
  {
    value: "Vaccine",
    label: "Vaccine"
  },
]


export const optionChart = [
  { value: 1, label: "Hospital data statistics" },
  { value: 3, label: "Hospital By All Service" },

]



export const AnalysisPage = styled.div`

  .title {
    text-align: center;

    font-size: var(--fz_medium);
    font-weight: 800;
  }
  .sec_1_filter {
    padding-bottom: 1rem;
    .b____ {
      display: flex;
      gap: 1rem;
      align-items: center;
      color: orange;
      color: green;
      p {
        font-weight: 800;
      }
    }
    .sec_1_title {
      font-weight: 800;
      color: orange;
      text-transform: capitalize;
    }
    .box_selectfilter {
      display: grid;
      padding: 0.5rem 0;
      grid-template-columns: 2fr 1fr 1fr 0.7fr 1fr;
      gap: 1rem;
      .item_select_ {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        width: 100%;

        p {
          font-size: var(--fz_smallmax);
        }
      }
      .btn_button_chart {
        display: flex;
        align-items: end;
        padding: 0 0.3rem;

        button {
          width: 100%;
          padding: 0.4rem 0;
          background-color: var(--cl_3);
          border: none;
          outline: none;
          border-radius: 0.5rem;
          box-shadow:
            -2px -2px 2px white,
            2px 2px 2px var(--cl_2);
        }
        button:disabled {
          background-color: var(--shadow-black);
          color: var(--cl_2);
        }
      }
    }
  }
  .chart_session {
    display: flex;
  }
  .type_chart {
    width: 5%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0.2rem;
    //background-color: red;
    justify-content: end;
    gap: 0.2rem;
    button {
      width: fit-content;
      padding: 0.5rem;
      background-color: var(--cl_2);
      color: white;
      border: none;
      outline: none;
      border-radius: 0.2rem;
    }
  }
  .chart_content {
    width: 95%;
    overflow: hidden;
    min-height: 25rem;
    background-color: var(--cl_2);
  }
  .chart_circel_session {
    width: 100%;
    .chart_content {
      width: 80%;
      margin: auto;
      overflow: hidden;
      min-height: 25rem;
      padding: 1rem;
      background-color: var(--cl_2);
      p {
        color: white;
        padding: 0 0 1rem;
      }
      .b_chart_circle {
        width: 100%;
        min-height: 25rem;
      }
    }
  }

`;