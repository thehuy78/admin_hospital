import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS cho React Quill

// Styled Components
const BoxInput = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom: 1.5rem;
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

  .ql-container {
    font-size: var(--fz_smallmax);
    border: 0.05rem solid var(--shadow-black);
    border-radius: 0.3rem;
    box-shadow: 0 0 2px var(--shadow-black);
    min-height: 10rem;
  }

  .ql-container.ql-snow {
    border-radius: 0.3rem;
  }

  .ql-container:focus-within {
    border: 1px solid var(--active);
  }

  span {
    color: red;
    font-size: var(--fz_smallmax);
  }

  ${(props) =>
    props.$hasError &&
    css`
      .ql-container {
        border-color: red;
      }
    `}
`;

// React Component
export default function RichTextEditor({
  defaultValue,
  Textlabel,
  isRequire,
  err,
  placeholder,
  fnChange,
}) {
  // Function to clean up the value before saving
  const cleanContent = (content) => {
    // Remove empty paragraphs or headings like <p><br></p>, <h4><br></h4>
    let cleaned = content.replace(/<([a-z0-9]+)>\s*<br\s*\/?>\s*<\/\1>/g, ''); // Match empty tags like <p><br></p>, <h4><br></h4>

    // Remove any <br> tags inside empty <p> or <h4>
    cleaned = cleaned.replace(/<([a-z0-9]+)>\s*<\/\1>/g, ''); // Remove empty <p></p>, <h4></h4>

    // Trim any extra spaces if necessary
    return cleaned.trim();
  };

  const handleChange = (value) => {
    const cleanedValue = cleanContent(value); // Clean up the value before passing to the parent
    fnChange(cleanedValue); // Pass the cleaned value to the parent
  };

  return (
    <BoxInput>
      <Label>
        {Textlabel} {isRequire && <span>*</span>}
      </Label>
      <BoxInputWrapper $hasError={err && err !== ''}>
        <ReactQuill
          theme="snow"
          value={defaultValue}
          onChange={handleChange} // Use the handleChange instead of directly fnChange
          placeholder={placeholder}
        />
        <span>{err !== '' ? '* ' + err : ''}</span>
      </BoxInputWrapper>
    </BoxInput>
  );
}
