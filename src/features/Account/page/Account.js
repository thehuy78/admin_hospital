import React, { useEffect, useState } from 'react';
import "../account.scss";
import swal from 'sweetalert';
import InputComponent from "../../../shared/component/InputData/InputComponent"
import InputImageAvatar from '../../../shared/component/InputData/InputImageAvatar';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherizeForm } from '../../../shared/hook/Api/ApiAuther';
import { useCookies } from 'react-cookie';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { Input } from '@mui/material';
import UpdatePassword from '../../Auth/page/UpdatePassword';
export default function Account() {
  const [activeTab, setActiveTab] = useState('information'); // Quản lý trạng thái active
  const { token, user } = useAdminContext()
  const [isLoading, setIsLoading] = useState(false)
  console.log(user);
  const [, setCookie] = useCookies(["token_hospital"]);
  const [valueFormInfor, setValueFormInfor] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: null
  })
  useEffect(() => {
    setValueFormInfor({
      firstName: user?.firstname,
      lastName: user?.lastname,
      phone: user?.phone,
      avatar: null
    })
  }, [user]);

  const [errorFormInfor, setErrorFormInfor] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: ''
  })

  const handleUpdateInfor = async (e) => {
    try {
      e.preventDefault()
      if (token) {
        var valid = true;
        if (errorFormInfor.firstName !== "" || errorFormInfor.lastName !== "" || errorFormInfor.phone !== "") {
          valid = false
        }
        if (valueFormInfor.firstName === "" || valueFormInfor.lastName === "" || valueFormInfor.phone === "") {
          valid = false
        }
        valueFormInfor.firstName === "" ? setErrorFormInfor((prev) => ({ ...prev, firstName: "First name is required" })) : setErrorFormInfor((prev) => ({ ...prev, firstName: "" }))
        valueFormInfor.lastName === "" ? setErrorFormInfor((prev) => ({ ...prev, lastName: "Last name is required" })) : setErrorFormInfor((prev) => ({ ...prev, lastName: "" }))
        valueFormInfor.phone === "" ? setErrorFormInfor((prev) => ({ ...prev, phone: "Phone is required" })) : setErrorFormInfor((prev) => ({ ...prev, phone: "" }))

        if (!valid) {
          swal("Validation", "Data invalid!", "error");
          return;
        }
        setIsLoading(true)
        var data = new FormData()
        data.append("firstName", valueFormInfor.firstName)
        data.append("lastName", valueFormInfor.lastName)
        data.append("phone", valueFormInfor.phone)
        data.append("id", user.id)
        if (valueFormInfor.avatar) {
          data.append("avatar", valueFormInfor.avatar)
        }
        var rs = await apiRequestAutherizeForm("POST", "auth/updateinfor", token, data)
        console.log(rs);
        setIsLoading(false)
        if (rs && rs.data && rs.data.status === 200) {
          swal("Update", "Update account Success!", "success");
          var exp = new Date()
          exp.setHours(exp.getHours() + 10);
          setCookie("token_hospital", rs.data.data, { expires: exp, path: '/admin_hospital' })
        } else {
          swal("Update failed", rs.data.message, "error");
        }
      }


    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="account_Page">
      <LoadingPage key={1} isloading={isLoading} />
      <div className="navigator_acc">
        <p
          className={activeTab === 'information' ? 'active' : ''}
          onClick={() => setActiveTab('information')}
        >

          Information Update
        </p>
        <p
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Password Update
        </p>
      </div>
      <div className="content_navigator">
        {activeTab && activeTab === 'information' && (
          <div className='content_component'>
            <form onSubmit={handleUpdateInfor}>
              <p className='title_form'>Update Information</p>

              <div className='row_6_4'>

                <div>
                  <InputComponent
                    Textlabel={"First Name"}
                    isRequire={true}
                    typeInput={"Text"}
                    defaultValue={user?.firstname}
                    err={errorFormInfor.firstName}
                    fnChange={(e) => {
                      var fn = e.target.value.trim()
                      setValueFormInfor((prev) => ({
                        ...prev,
                        firstName: fn
                      }))
                      if (fn !== '') {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          firstName: ""
                        }))
                      } else {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          firstName: "First Name is required"
                        }))
                      }
                    }}
                  />
                  <InputComponent
                    Textlabel={"Last Name"}
                    isRequire={true}
                    typeInput={"Text"}
                    defaultValue={user?.lastname}
                    err={errorFormInfor.lastName}
                    fnChange={(e) => {
                      var fn = e.target.value.trim()
                      setValueFormInfor((prev) => ({
                        ...prev,
                        lastName: fn
                      }))
                      if (fn !== '') {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          lastName: ""
                        }))
                      } else {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          lastName: "Last Name is required"
                        }))
                      }
                    }}
                  />
                  <InputComponent
                    Textlabel={"Phone Number"}
                    isRequire={true}
                    typeInput={"Number"}
                    defaultValue={user?.phone}
                    err={errorFormInfor.phone}
                    fnChange={(e) => {
                      var fn = e.target.value.trim()
                      setValueFormInfor((prev) => ({
                        ...prev,
                        phone: fn
                      }))
                      if (fn !== '') {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          phone: ""
                        }))
                      } else {
                        setErrorFormInfor((prev) => ({
                          ...prev,
                          phone: "Phone is required"
                        }))
                      }
                    }}
                  />
                </div>
                <InputImageAvatar
                  err={errorFormInfor.avatar}
                  defaultImg={user?.avatar}
                  aspectWH={1 / 1}
                  fnChange={(value) => {
                    setValueFormInfor((prev) => ({
                      ...prev,
                      avatar: value
                    }))
                    if (value) {
                      setErrorFormInfor((prev) => ({
                        ...prev,
                        avatar: ""
                      }))
                    } else {
                      setErrorFormInfor((prev) => ({
                        ...prev,
                        avatar: "Avatar is required"
                      }))
                    }
                  }}
                />
              </div>
              <div className='box_btn'>

                <button type='submit'>Update</button>
              </div>


            </form>

          </div>
        )}
        {activeTab && activeTab === 'password' && (
          <div className='content_component'>
            <UpdatePassword />
          </div>
        )}

      </div>
    </div>
  );
}
