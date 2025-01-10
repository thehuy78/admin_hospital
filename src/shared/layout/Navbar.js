import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

import { jwtDecode } from 'jwt-decode';

import { NotificationContainer } from 'react-notifications';
import { createNotification } from '../Config/Notifications';
import LoadingPage from '../Config/LoadingPage';
import { apiRequestAutherize } from '../hook/Api/ApiAuther';

import { Link } from 'react-router-dom';
import SearchInput from '../component/InputFilter/SearchInput';
import CheckBoxTogle from '../component/CheckBox/CheckBoxTogle';
import GetImageFireBase from '../function/GetImageFireBase';

export default function Navbar() {


  const [isLoading, setIsLoading] = useState(false)
  const [cookies, , removeCookie] = useCookies(["token_hospital"]);
  const [user, setUser] = useState()
  var [hospital, setHospital] = useState();

  useEffect(() => {
    if (cookies && cookies.token_hospital) {
      setHospital(jwtDecode(cookies?.token_hospital))
    }
  }, [cookies]);


  const handleLogoout = async () => {
    try {
      setIsLoading(true)
      var rs = await apiRequestAutherize("POST", "auth/logout", cookies.token_hospital, cookies.token_hospital)
      console.log(rs);
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
      if (rs && rs.data && rs.data.status === 200) {
        createNotification("success", "LogOut success", "Logout")()

        removeCookie("token_hospital", { path: '/admin_hospital' });

      } else {
        createNotification("error", "LogOut fails", "Logout")()
      }

    } catch (error) {
      createNotification("error", "LogOut fails", "Logout")()
      setTimeout(() => {
        setIsLoading(false)
      }, 200);
    }

  }

  useEffect(() => {
    if (cookies.token_hospital) {
      setUser(jwtDecode(cookies.token_hospital));
    }
  }, [cookies.token_hospital]);


  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        setTheme(event.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);



  const handleChange = () => {
    var btn = document.getElementById("checked_theme")
    const newTheme = btn.checked ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);

  }

  useEffect(() => {
    if (theme === "dark") {
      console.log("ok");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

  }, [theme]);

  return (
    <div className='navbar_P'>
      <NotificationContainer />
      <LoadingPage key={1} isloading={isLoading} />
      <div className='left'>
        <div className='logo_company'>
          <Link className='link_tag' to={"/admin/dashboad"}>
            <img alt='' src={require("../../assets/images/logo/logo1.png")} />
          </Link>
        </div>
        {/* <SearchInput minwidth={"350px"} /> */}
      </div>
      <div className='right'>
        {hospital && (
          <div className='bb_left'>
            {hospital.hospitalLogo && (
              <img alt='' src={GetImageFireBase(hospital.hospitalLogo)} />
            )}

            <p>Hi, {hospital.hospitalName && hospital.hospitalName}</p>
          </div>
        )}


        <div className='bb_right'>
          <div className='box_icon'>
            <CheckBoxTogle handleChange={handleChange} theme={theme} />
            <Link className='link_tag' to={"/admin/chat"}><i className="fa-solid fa-comment"></i></Link>
            <Link className='link_tag'><i className="fa-solid fa-bell"></i></Link>
            <Link className='link_tag' to={"/admin/setting"}><i className="fa-solid fa-gear"></i></Link>


          </div>
          <div className='account_login'>
            <div className='acount_login_container'>
              <img src={"https://tinyurl.com/4eb2aab6"} alt='' />
              <div className='b_name'>
                <p>{user && user.firstname} {user && user.lastname}</p>
                <i onClick={handleLogoout} className="fa-solid fa-share-from-square"></i>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
