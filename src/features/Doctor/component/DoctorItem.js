import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import FormatWorkday from "../../../shared/function/FomatWorkday";

const GridItem = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns:  1fr 3fr 1.5fr 1.5fr 1fr 1.5fr 1fr 1fr 1fr;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--white);
  padding: 0.5rem 0.5rem;
  align-items: center;
  box-shadow: 0.1rem 0.1rem 0.3rem -0.1rem var(--shadow-black);
  .codehospital {
    font-weight: 800;
    font-size: var(--fz_smallmax);
  }
  p {
    text-align: center;
  }
  .b_img {
    width: 100%;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 80%;
      border-radius: 50%;
    }
  }
  .b_doctor {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    .name {
      font-weight: 700;
      color: var(--cl_2);
      font-size: var(--fz_label);
    }
  }

  .fee,
  .room,
  .pattient,
  .gender,
  .daywork,
  .timework {
    text-align: center;
    font-size: var(--fz_small);
  }
  .status {
    text-transform: capitalize;
    font-size: var(--fz_small);
    color: var(--white);
    padding: 0.3rem 0;

    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 800;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
  }
  .active {
    color: green;
    span {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background-color: green;
    }
  }
  .deactive {
    color: red;
    span {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background-color: red;
    }
  }
  .link_tag {
    width: 100%;
    p {
      text-transform: capitalize;
      font-size: var(--fz_smallmax);
      width: 100%;
      color: var(--white);
      padding: 0.3rem 1rem;
      text-align: center;
      border-radius: 0.5rem;
      cursor: pointer;
      box-shadow: 0 0 0.2rem var(--shadow-black);
      background-color: blue;
    }
  }
`;

export default function DoctorItem({ item }) {
  return (
    item && (
      <GridItem>
        <div className="b_img">
          <img
            alt=""
            src="https://firebasestorage.googleapis.com/v0/b/medcare-9db1e.appspot.com/o/047f16f5-27b1-4c3f-b3d3-778c16d633db-tn.jpg?alt=media"
          />
        </div>
        <div className="b_doctor">
          <p className="name">{item.name}</p>
          <p className="level">{item.level}</p>
        </div>
        <p className="daywork">{FormatWorkday(item.daywork)}</p>
        <p className="timework"> {item.timework}</p>
        <p className="gender">{item.gender}</p>
        <p className="fee">{item.fee}</p>
        <p className="room">{item.room}</p>
        <p className="pattient">{item.pattient}</p>
        <p
          className={
            item.status.toLowerCase() === "Status"
              ? "status_header"
              : item.status.toLowerCase() === "active"
                ? "active status"
                : "deactive status"
          }
        >
          <span></span>
          {item.status}
        </p>
        {/* <Link className="link_tag" to={"/admin/hospital/department/doctor"}>
          <p className="doctor">View</p>
        </Link> */}
      </GridItem>
    )
  );
}
