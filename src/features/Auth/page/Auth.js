import React, { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import "../style/Auth.scss"
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../shared/hook/Api/Api';
import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../../../shared/Config/Notifications';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import QRCode from 'react-qr-code';
import { listenForNotifications } from '../../Chat/page/firebaseConfig';
import axios from 'axios';
import GetImageFireBase from "../../../shared/function/GetImageFireBase"
export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [, setCookie] = useCookies(["token_hospital"]);
  const navigate = useNavigate()



  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      var emailvalue = document.getElementById("email").value
      var passwordvalue = document.getElementById("password").value
      if (emailvalue.trim() !== "" && passwordvalue.trim() !== "") {
        var loginRes = {
          email: emailvalue.trim(),
          password: passwordvalue.trim()
        }
        setIsLoading(true)
        var rs = await apiRequest("POST", "auth/loginadmin", loginRes)

        setTimeout(() => {
          setIsLoading(false)
        }, 300);
        if (rs && rs.data && rs.data.status) {
          switch (rs.data.status) {
            case 200:
              createNotification("success", "Login Success", "Login")();
              var exp = new Date()
              exp.setHours(exp.getHours() + 10);
              setCookie("token_hospital", rs.data.data, { expires: exp, path: '/admin_hospital' })
              setTimeout(() => {
                navigate("/admin/dashboad")
              }, 300);
              break;
            case 201:
              createNotification("error", "Password wrong", "Login")();
              break;
            case 202:
              createNotification("error", "User not found", "Login")();
              break;
            default:
              break;
          }
        }
        console.log(rs);
      } else {
        createNotification("warning", "Input your account", "Login")();
      }
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false)
      }, 300);
      createNotification("error", "Login Fails", "Login")();
    } finally {
      e.target.reset()
    }
  }
  const [showpass, setShowpass] = useState(false)
  const handleShowPassword = () => {
    setShowpass((prev) => !prev);
  }


  const [isQr, setIsQR] = useState(false)
  const [valueQr, setValueQr] = useState()

  const randomQrValue = () => {
    var time = Date.now()
    console.log("code: " + time);
    setValueQr(time)
  }
  const [notification, setNotification] = useState('');
  useEffect(() => {
    console.log("code1: " + valueQr);
    if (valueQr) {
      listenForNotifications(valueQr, setNotification);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {

            const apiKey = '951c3bd4a93441539a374498567c3eca';
            var url = `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`;
            const response = await axios.get(url);

            if (response.data.results.length > 0) {
              const firstResult = response.data.results[0];
              console.log(firstResult);
              var address = firstResult.formatted.split(", ");
              address.shift()
              setLocation(address.join(", "))
              console.log(address.join(", "));
            } else {
              console.log('Không tìm thấy kết quả.');

            }

          },
          (err) => {
            console.log(err.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by your browser.");
      }
    }
  }, [valueQr]);


  useEffect(() => {
    if (notification !== '') {
      console.log(notification);

      if (notification.includes("Bearer")) {
        var data = notification.split(" ");
        RefeshToken(data[1])

      }

    }
  }, [notification]);


  const RefeshToken = async (tokens) => {
    try {
      var rs = await apiRequestAutherize("POST", "auth/refeshToken", tokens, { token: tokens })
      if (rs && rs.data && rs.data.status === 200) {
        var exp = new Date()
        exp.setHours(exp.getHours() + 10);
        setCookie("token_hospital", rs.data.data, { expires: exp, path: '/admin_hospital' })
        setTimeout(() => {
          navigate("/admin/dashboad")
        }, 300);
      } else {
        createNotification("error", rs.data.message, "Login")();
      }
    } catch (error) {
      createNotification("error", error, "Login")();
    }
  }

  const [userQr, setUserQr] = useState()
  const [location, setLocation] = useState("location Unknown")
  const fetchUser = useCallback(async () => {
    try {
      if (notification !== '') {
        var rs = await apiRequest("GET", `auth/getuserqr/${notification}/${valueQr}/${"location Unknown"}`)
        if (rs?.data && rs.data.status === 200) {
          setUserQr(rs.data.data)
        }
      }

    } catch (error) {
      console.log(error);
    }
  }, [notification])
  useEffect(() => {
    fetchUser()
  }, [fetchUser]);









  return (
    <div className='auth_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='box_zindex1'></div>
      <div className='box_zindex2'>
        <div className='b_logo'>
          <img src={require('../../../assets/images/logo/logo-05.png')} alt='' />
        </div>
      </div>
      <div className='box_zindex3'>
        <div className='box_form_login'>
          <form className='form_login' onSubmit={handleLogin}>
            <p className='author_qr' onClick={() => {
              setIsQR((prev) => !prev)
              randomQrValue()
              setUserQr()
            }}>{isQr ? "Account" : "QR CODE"}</p>
            <p className='tilte'>Welcome</p>
            <p className='description'>PLEASE LOGIN TO ADMIN HOSPITAL</p>
            {isQr ? (
              <>
                {userQr ? (<div className='box_user_accepted'>
                  <img src={GetImageFireBase(userQr.avatar)} alt='' style={{ width: "70%", maxWidth: "130px" }} />
                  <p className='b_name'>{userQr.firstName} {userQr.lastName}</p>
                  <p className='action_content'>Scan the login code successfully. Please choose to "Accept login" on your mobile device</p>
                </div>) : (
                  <div style={{ textAlign: 'center', margin: '20px' }} className='box_qr_scan'>
                    <div className='container_box_1'>
                      <QRCode
                        value={valueQr.toString()}
                        size={150}
                        fgColor="black"
                        bgColor="#f8fafc"
                        level="H"
                        includeMargin={true}
                        className='qr_img'
                      />
                      <p>Scan QR Login</p>
                    </div>
                    <div className='container_box_2'>
                      <p>1. Open the Medcare Hospital application on your phone</p>
                      <p>2. Select the QR icon on the search bar</p>
                      <p>3. Move the camera and scan the login QR code</p>
                    </div>
                  </div>
                )}

              </>

            ) : (
              <>
                <div className='form_group'>

                  <div className='b_item'>
                    <i className="fa-solid fa-user icon_input"></i>
                    <input id='email' placeholder='Input email...' />
                  </div>
                  <span className='error'></span>
                </div>
                <div className='form_group'>

                  <div className='b_item_pw'>
                    <i className="fa-solid fa-key icon_input"></i>
                    <div className='b_input'>
                      <input type={showpass ? 'text' : 'password'} id='password' placeholder='Input password ...' />
                      <i className={!showpass ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={handleShowPassword}></i>
                    </div>
                  </div>
                  <span className='error'></span>
                </div>
                <button className='btn_submit' type='submit'>Login</button>
                <Link className='link_tag' to={"/forgotpassword"}><p>Forgot your password?</p></Link>
              </>
            )}


          </form>
        </div>
        <div className='b_logo'>
          <img alt='' src={require("../../../assets/images/main/auth.png")} />
        </div>
      </div>


    </div>
  )
}
