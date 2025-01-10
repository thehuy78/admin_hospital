import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const GridItem = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 4fr 1fr 1fr 1fr 1.5fr 1fr;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--white);
  padding: 1rem 0.5rem;
  align-items: center;
  box-shadow: 0.1rem 0.1rem 0.3rem -0.1rem var(--shadow-black);
  .codehospital {
    font-weight: 800;
    font-size: var(--fz_smallmax);
  }
  p {
    text-align: center;
  }

  .name {
    font-weight: 700;
    color: var(--cl_2);
  }
  .floor {
    font-size: var(--fz_small);
  }
  .zone {
    text-align: center;
    font-size: var(--fz_small);
  }
  .doctorCount {
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

export default function DepartmentItem({ item }) {
  return (
    item && (
      <GridItem>
        <p className="codehospital">{item.codehospital}</p>
        <p className="name">{item.name}</p>
        <p className="floor">Floor {item.floor}</p>
        <p className="zone">Zone {item.zone}</p>
        <p className="doctorCount">{item.doctorCount}</p>
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
        <Link className="link_tag" to={"/admin/hospital/department/doctor"}>
          <p className="doctor">View</p>
        </Link>
      </GridItem>
    )
  );
}
