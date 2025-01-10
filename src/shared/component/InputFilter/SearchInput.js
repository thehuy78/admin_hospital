import React, { useState } from 'react';
import styled from 'styled-components';

const InputSearch = styled.input`
  width: 15rem;
  font-size: var(--fz_small);
  line-height: 1rem;
  padding: 0.3rem 0;
  margin-left: 0.5rem;
  border: none;
  outline: none;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding:0 0.5rem;
  border-radius: 0.3rem;
  height: 2.5rem;
  overflow: hidden;
  border: 1px solid var(--shadow-black);
  box-shadow: 0 0 2px var(--shadow-black);
  
  /* Use the $isFocused prop here */
  ${(props) => props.$isFocused && `
    border-color: var(--active);
  `}
`;

const Icon = styled.i`
  color: var(--shadow-black);
  font-size: 1rem;
`;

export default function SearchInput({ fnChangeCallback, minwidth }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SearchBox $isFocused={isFocused}>
      <Icon className="fa-solid fa-magnifying-glass"></Icon>
      <InputSearch
        onChange={fnChangeCallback}
        placeholder="Search..."
        type="search"
        style={{ minWidth: minwidth && minwidth }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </SearchBox>
  );
}
