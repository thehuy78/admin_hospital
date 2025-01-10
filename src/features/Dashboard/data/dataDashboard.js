import styled from "styled-components";



export const SelectStyle = styled.select`
   outline: none;
   border: none;
    background-color: var(--cl_2);
      color: orange;
        width: fit-content;
        font-size: var(--fz_smallmax);
`;


export const CaculatorPer = (data, gender) => {

  if (data && data.male !== null && data.female !== null) {

    if (gender === "male") {
      if (data.male > 0) {
        return (data.male / (data.male + data.female)) * 100
      } else {
        return 0;
      }
    } else {
      if (data.female > 0) {

        return (data.female / (data.male + data.female)) * 100
      } else {
        return 0;
      }
    }
  }

};

export const findItem = (data, name) => {
  if (data && data.length > 0) {
    var kq = data.find(op => op.nameService.toLowerCase() === name.toLowerCase())
    if (kq) {
      return kq.bookingsCount
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}






