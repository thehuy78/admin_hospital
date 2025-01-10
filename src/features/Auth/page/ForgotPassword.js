import React, { useEffect, useState } from 'react'
import LoadingPage from '../../../shared/Config/LoadingPage'
import { NotificationContainer } from 'react-notifications'
import { apiRequest } from '../../../shared/hook/Api/Api'
import { useNavigate } from 'react-router-dom'
import swal from 'sweetalert';
import styled from 'styled-components'
import QRCode from 'react-qr-code'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [countdownStart, setCountdownStart] = useState(false)
  const [countDown, setCountDown] = useState(59)

  useEffect(() => {
    if (countdownStart) {
      const intervalId = setInterval(() => {
        setCountDown(prev => {
          if (prev <= 1) {
            clearInterval(intervalId)
            setCountdownStart(false) // Dừng countdown khi hết thời gian
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(intervalId) // Clear interval khi component unmount
    }
  }, [countdownStart])

  const checkAccount = async (e) => {
    e.preventDefault()
    try {
      const emailElement = document.getElementById("email")
      if (emailElement.value.trim() === '') {
        return
      }
      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/forgot", { email: emailElement.value.trim() })
      setTimeout(() => setIsLoading(false), 500)

      if (rs?.data?.status === 200) {
        e.target.reset()
        setEmail(rs.data.data.email)
        setForm(true)
        setCountdownStart(true)
        setCountDown(60) // Bắt đầu đếm ngược từ 60 giây
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    try {
      const codeElement = document.getElementById("code_verify")
      if (codeElement.value.trim() === '') {
        return
      }
      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/resetpassword", { code: codeElement.value.trim().toString(), email })
      setTimeout(() => setIsLoading(false), 500)

      if (rs?.data?.status === 200) {
        swal("Reset Password", "Reset Password Successfully!", "success").then((result) => {
          if (result) navigate("/")
        })
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  const reSendCode = async () => {

    try {

      setIsLoading(true)
      const rs = await apiRequest("POST", "auth/forgot", { email: email })
      setTimeout(() => setIsLoading(false), 500)
      if (rs?.data?.status === 200) {
        setEmail(rs.data.data.email)
        setForm(true)
        setCountdownStart(true)
        setCountDown(59) // Bắt đầu đếm ngược từ 60 giây
      } else {
        swal("Reset Password", rs.data.message, "error")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }



  return (
    <ForgotPage>
      <BacktoLogin onClick={() => { navigate("/") }}><i class="fa-solid fa-reply"></i></BacktoLogin>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='b_logo'>
        <img src={require('../../../assets/images/logo/logo-05.png')} alt='' />
      </div>


      {form ? (
        <form className='form_login' onSubmit={resetPassword}>
          <p className='tilte'>VERIFY</p>
          <p className='description'>Enter your code</p>
          <div className='form_group'>
            <div className='b_item'>
              <i className="fa-solid fa-key icon_input"></i>
              <input id='code_verify' defaultValue={""} type='number' required />
            </div>
            <DivReSend>
              {countDown > 0 ? (
                <span>{countDown}s</span>
              ) : (
                <LinkRe onClick={reSendCode}>Gửi lại <i className="fa-solid fa-rotate-right"></i></LinkRe>
              )}
            </DivReSend>
          </div>
          <button className='btn_submit' type='submit'>Verify</button>
        </form>
      ) : (
        <form className='form_login' onSubmit={checkAccount}>
          <p className='tilte'>RESET</p>
          <p className='description'>Verify Email to reset password</p>
          <div className='form_group'>
            <div className='b_item'>
              <i className="fa-solid fa-user icon_input"></i>
              <input id='email' placeholder='Input email...' required />
            </div>
            <span className='error'></span>
          </div>
          <button className='btn_submit' type='submit'>Check</button>
        </form>
      )}
    </ForgotPage>
  )
}

const DivReSend = styled.div`
 display: flex;
  justify-content: right;
  gap: 0.5rem;
  padding: 0.5rem 0 0;
  align-items: center;
`;

const LinkRe = styled.span`
color: red;
  font-size: var(--fz_small);
  font-weight:400;
  cursor: pointer;
  i {
    font-size: var(--fz_smallmax);
    padding-left: 0.3rem;
  }
`;

const BacktoLogin = styled.p`
position: fixed;
  inset: 0;
  width: 3rem;
  height: 3rem;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
   cursor: pointer;
  `;



const ForgotPage = styled.div`

  width: 100%;
  height: 100vh;
  background-color: var(--cl_2);
  display: flex;
  align-items: center;
  padding: 5rem;
  .b_logo {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 0.1rem solid var(--white);
    img {
      width: 80%;
      height: fit-content;
    }
  }
  .form_login {
    padding: 0 2rem;
    width: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--white);
    .tilte {
      font-size: var(--fz_title);

      font-weight: 800;
    }
    .description {
      font-weight: 800;
      padding-bottom: 2rem;
      text-transform: uppercase;
      font-size: var(--fz_small);
    }
    .form_group {
      padding: 1rem 0;
      width: 70%;
      .b_item {
        width: 100%;

        display: flex;
        align-items: center;
        gap: 0.5rem;
        .icon_input {
          width: 3rem;
          display: flex;
          justify-content: center;
          background-color: var(--cl_3);
          height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: var(--fz_medium);
          color: var(--white);
          background-color: var(--cl_2);
          border: 0.2rem ridge var(--cl_2);
        }
        input {
          width: calc(100% - 3rem);
          height: 3rem;
          font-size: 1rem;
          padding: 1rem;
          outline: none;
          border: none;
        }
      }
      .b_item_pw {
        width: 100%;

        display: flex;
        align-items: center;
        gap: 0.5rem;
        .icon_input {
          width: 3rem;
          display: flex;
          justify-content: center;
          background-color: var(--cl_3);
          height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: var(--fz_medium);
          color: var(--cl_2);

          color: var(--white);
          background-color: var(--cl_2);
          border: 0.2rem ridge var(--cl_2);
        }
        .b_input {
          width: calc(100% - 3rem);
          position: relative;
          input {
            width: 100%;
            font-size: 1rem;
            padding: 1rem;
            outline: none;
            border: none;
            height: 3rem;
          }
          i {
            position: absolute;
            right: 0;
            top: 50%;
            color: var(--black);
            transform: translate(-50%, -50%);
            cursor: pointer;
          }
        }
      }
      .error {
        color: red;
        font-size: var(--fz_smallmax);
        padding-left: calc(3rem + 0.5rem);
      }
    }
    .btn_submit {
      width: 70%;
      padding: 0.5rem;
      background-color: var(--cl_4);
      outline: none;
      border: none;
      cursor: pointer;
      color: var(--white);
      font-weight: 800;
    }
    .link_tag {
      padding: 0.5rem 0;
      color: var(--white);
      p {
        font-size: var(--fz_smallmax);
      }
    }
  }


`;