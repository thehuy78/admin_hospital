import React, { useCallback, useEffect, useRef, useState } from 'react'
import "./style/Layout.scss"
import routerMain from "./data/RouteMain.json"
import { Link, useLocation } from 'react-router-dom'
import GetImageFireBase from "../function/GetImageFireBase"
import { useCookies } from 'react-cookie'
import { jwtDecode } from 'jwt-decode'
import { apiRequestAutherize } from '../hook/Api/ApiAuther'
import { createNotification } from '../Config/Notifications'
import CheckBoxTogle from '../component/CheckBox/CheckBoxTogle'
import { listenForNotifications } from '../../features/Chat/page/firebaseConfig'
import { apiRequest } from '../hook/ApiChat/ApiChatService'
export default function SideBar() {
  const [listShow, setListShow] = useState([])
  const [itemCurrent, setItemCurrent] = useState()
  const [itemChildCurrent, setItemChildCurrent] = useState()
  const location = useLocation()
  const navbarRef = useRef(null);

  const [navbarHeight, setNavbarHeight] = useState(0);


  const [cookie,] = useCookies(["token_hospital"]);

  // const [notification, setNotification] = useState('');
  // useEffect(() => {
  //   const userId = 'Status'; // ID của người dùng mà bạn muốn theo dõi thông báo
  //   listenForNotifications(userId, setNotification);
  // }, []);

  // useEffect(() => {
  //   updateStatus()
  // }, [notification]);


  // const updateStatus = useCallback(async () => {
  //   try {
  //     if (cookie.token_hospital) {
  //       var tokenjwt = jwtDecode(cookie.token_hospital)
  //       var rs = await apiRequest("GET", `stompclient/changeStatus/${tokenjwt.sub}`)

  //       console.log(rs);
  //     }
  //   } catch (error) {

  //   }
  // }, [cookie])


  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef]);



  const handleClickShow = (index) => {

    if (listShow.includes(index)) {

      setListShow(listShow.filter((item) => item !== index));
    } else {

      setListShow([...listShow, index]);
    }
  };
  const handleClickItemPattent = (index) => {
    setItemCurrent(index)
    setItemChildCurrent()
  }
  const handleClickItemChild = (indexs, index) => {
    setItemChildCurrent(indexs)
    setItemCurrent(index)
  };



  const [cookies, , removeCookie] = useCookies(["token_hospital"]);
  const [user, setUser] = useState()
  var [hospital, setHospital] = useState();
  const [isLoading, setIsLoading] = useState(false)
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
      console.log(jwtDecode(cookies.token_hospital));
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
    <div className='sidebar_P'>
      <div className='logo_company' ref={navbarRef}>
        <div className='box_img'>
          <img alt='' src={GetImageFireBase(user?.avatar)} />
        </div>
        <div className='box_info_account'>
          <p>{user?.firstname} {user?.lastname}</p>
          <p>{user?.sub}</p>
        </div>
        <div className='box_acction'>
          <Link className='link_tag' style={{ color: "white" }}
            to={"/admin/chat"}><i class="fa-solid fa-message"></i></Link>
          <Link className='link_tag' to={"/admin/notification"} style={{ color: "white" }}
          ><i class="fa-solid fa-bell" ></i></Link>
          <Link className='link_tag' to={"/admin/account"} style={{ color: "white" }}
          ><i class="fa-solid fa-user-pen"></i></Link>

          <i class="fa-solid fa-right-to-bracket" onClick={handleLogoout}></i>
        </div>
      </div>
      <div className='list_router' style={{ height: `calc(100vh - 140px - 30px)` }}>
        {routerMain && routerMain.length > 0 && routerMain.map((item, index) => (
          <div className='item' key={index}>
            <div className={location.pathname.startsWith(item.topic) ? "pattent pattent_choice" : 'pattent'} >
              <Link className='left' onClick={() => handleClickItemPattent(index)} to={item.route !== "" ? item.route : "#"}>

                <i className={item.icon}></i>
                <p className='link_tag'><span>{item.name}</span></p>

              </Link>
              {item.child && item.child.length > 0 && (
                <i className={listShow.includes(index) ? "fa-solid fa-angle-down" : "fa-solid fa-angle-down rotate"} onClick={() => handleClickShow(index)}></i>
              )}
            </div>

            <div className={!listShow.includes(index) ? "list_hide" : 'list_show'}>
              {item.child && item.child.length > 0 && item.child.map((items, indexs) => (
                <Link onClick={() => handleClickItemChild(indexs, index)} to={items.route !== "" ? items.route : "#"} className={itemChildCurrent === indexs && itemCurrent === index ? 'link_tag child_choice' : 'link_tag'} key={indexs}><span>{items.name}</span></Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='theme_box_'>
        <p>Themes:</p>
        <div className="theme_button">
          <CheckBoxTogle handleChange={handleChange} theme={theme} />
        </div>
      </div>
    </div>
  )
}
