import React from 'react'
import Select from 'react-select';
import styled from 'styled-components';



const BoxInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom:1.5rem;
`;

const Label = styled.label`
  font-size: var(--fz_small);
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.2rem 0;
  color: var(--gray);

  span {
    color: red;
  }
`;



const BoxInputWrapper = styled.div`
  width: 100%;

  input::placeholder {
    font-size: var(--fz_smallmax);
    color: var(--shadow-black);
    font-weight: 700;
  }

  span {
    color: red;
    font-size: var(--fz_smallmax);
  }
`;
export default function SelectOption({ value, nameLabel, nameValue, Textlabel, Textplacehoder, isRequire, err, defaultVl, options, fnChangeOption, multi }) {

  return (
    <BoxInput>
      <Label>{Textlabel} {isRequire && (<span>*</span>)}</Label>
      <BoxInputWrapper>
        <Select
          placeholder={Textplacehoder}
          defaultValue={defaultVl && defaultVl}
          value={value && value}
          onChange={fnChangeOption}
          options={options}
          isMulti={multi}
          getOptionLabel={(option) => option[nameLabel]}  // Sử dụng labelField
          getOptionValue={(option) => option[nameValue]}  // Sử dụng valueField
          styles={{
            control: (base) => ({
              ...base,
              minWidth: '12rem',
              fontSize: '1rem',
              isMulti: true,
              margin: '0',
              minHeight: '3rem',
              overflow: "hidden",
              border: '0.05rem solid var(--shadow-black)',
              boxShadow: '0 0 2px var(--shadow-black)',
            }),
            container: (base) => ({
              ...base,
              padding: '0',
            }),
          }}
        />
        <span>{err !== '' ? '* ' + err : ''}</span>
      </BoxInputWrapper>
    </BoxInput>
  )
}

