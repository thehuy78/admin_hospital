import React, { useState } from 'react'
import swal from 'sweetalert';
import { useAdminContext } from '../../hook/ContextToken';
import { apiRequestAutherize } from '../../hook/Api/ApiAuther';
import LoadingPage from '../../Config/LoadingPage';
import styled from 'styled-components';

const MocupSendMail = styled.div`

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 4;
  background-color: rgba(2, 2, 2, 0.44);
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    position: relative;
    .close {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0.5rem;
      font-weight: 800;
      font-size: var(--fz_medium);
      cursor: pointer;
    }
    .title {
      text-align: center;
      font-size: var(--fz_large);
      font-weight: 800;
    }
    .form_send_mail {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      div {
        p {
          font-size: var(--fz_small);
          text-transform: uppercase;
          font-weight: 700;
          padding: 0.2rem 0;
          color: var(--gray);
          span {
            color: red;
          }
        }
        input {
          min-width: 20rem;
          line-height: 1.2rem;
          padding: 0.7rem 0.5rem;
          border: none;
          outline: none;
          min-height: 3rem;
          border-radius: 0.3rem;
          border: 0.05rem solid var(--shadow-black);
          box-shadow: 0 0 2px var(--shadow-black);

          &:focus {
            border: 1px solid var(--active);
          }
        }
        textarea {
          min-width: 20rem;
          line-height: 1.2rem;
          padding: 0.7rem 0.5rem;
          border: none;
          outline: none;
          min-height: 3rem;
          border-radius: 0.3rem;
          border: 0.05rem solid var(--shadow-black);
          box-shadow: 0 0 2px var(--shadow-black);

          &:focus {
            border: 1px solid var(--active);
          }
        }
      }
      .btn_button {
        display: flex;

        justify-content: center;

        /* From Uiverse.io by eirikvold */
        button {
          font-family: inherit;
          font-size: 18px;
          background: linear-gradient(to bottom, #4dc7d9 0%, #66a6ff 100%);
          color: white;
          padding: 0.4rem 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 25px;
          box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        button:active {
          transform: scale(0.95);
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        }

        button span {
          display: block;
          margin-left: 0.4em;
          transition: all 0.3s;
        }

        button svg {
          width: 18px;
          height: 18px;
          fill: white;
          transition: all 0.3s;
        }

        button .svg-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          margin-right: 0.5em;
          transition: all 0.3s;
        }

        button:hover .svg-wrapper {
          background-color: rgba(255, 255, 255, 0.5);
        }

        button:hover svg {
          transform: rotate(45deg);
        }
      }
    }
  }

`;
export default function SendMail({ email, fnClose }) {
  const { token } = useAdminContext()
  const [isLoading, setIsLoading] = useState(false)
  const sendmail = async (e) => {
    e.preventDefault();
    try {
      var mailRes = {
        "emailTo": email,
        "subject": document.getElementById("subject_sendmail").value.trim() || "No subject",
        "message": document.getElementById("message_sendmail").value.trim() || "Messgae"
      }
      setIsLoading(true)
      var rs = await apiRequestAutherize("post", "auth/sendMail", token, mailRes)
      console.log(rs);
      setIsLoading(false)
      if (rs && rs.data && rs.data.status === 200) {
        fnClose()
        swal("Send", "Send mail Successfuly!", "success").then((result) => {
          // fnClose()
        });
      }
    } catch (error) {
      swal("Send", "Send mail Error!", "error").then((result) => {

      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <MocupSendMail>
      <LoadingPage isloading={isLoading} />
      <div className='content'>
        <p className='close' onClick={fnClose}>x</p>
        <p className='title'>New Message Mail</p>
        <form className='form_send_mail' onSubmit={sendmail}>
          <div>
            <p>To: <span>*</span></p>
            <input value={email} readOnly />
          </div>
          <div>
            <p>Subject:<span>*</span></p>
            <input required id='subject_sendmail' />
          </div>
          <div>
            <p>Message:<span>*</span></p>
            <textarea required id='message_sendmail' />
          </div>
          <div className='btn_button'>
            <button type='submit'>
              <div class="svg-wrapper-1">
                <div class="svg-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                  </svg>
                </div>
              </div>
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </MocupSendMail>
  )
}
