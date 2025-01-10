import React, { useState } from 'react';
import LoadingPage from '../../../shared/Config/LoadingPage';
import { useAdminContext } from '../../../shared/hook/ContextToken';
import { apiRequestAutherize } from '../../../shared/hook/Api/ApiAuther';
import swal from 'sweetalert';

export default function UpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAdminContext();
  const [errors, setErrors] = useState({
    passold: false,
    passnew: false,
    passcf: false,
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    let valid = true;
    let tempErrors = {
      passold: false,
      passnew: false,
      passcf: false,
    };

    // Lấy giá trị từ các input
    const passold = document.getElementById("pwdold").value.trim();
    const passnew = document.getElementById("pwdnew").value.trim();
    const passcf = document.getElementById("pwdcf").value.trim();

    // Kiểm tra các trường không được để trống
    if (!passold || !passnew || !passcf) {
      valid = false;
      if (!passold) tempErrors.passold = true;
      if (!passnew) tempErrors.passnew = true;
      if (!passcf) tempErrors.passcf = true;
    }

    // Kiểm tra độ dài của mật khẩu mới (ví dụ: ít nhất 6 ký tự)
    if (passnew.length < 6) {
      valid = false;
      tempErrors.passnew = true;
      swal("Validate", "New password must be at least 6 characters long!", "error");
    }

    // Kiểm tra mật khẩu xác nhận khớp với mật khẩu mới
    if (passcf !== passnew) {
      valid = false;
      tempErrors.passcf = true;
      swal("Validate", "Password Confirm is not match!", "error");
    }

    // Cập nhật lỗi vào state
    setErrors(tempErrors);

    // Nếu tất cả kiểm tra hợp lệ, tiếp tục xử lý yêu cầu
    if (valid && token) {
      const id = user.id;
      const dto = {
        id: id,
        passwordOld: passold,
        passwordNew: passnew,
      };

      setIsLoading(true);
      try {
        const rs = await apiRequestAutherize("POST", "auth/updatePassword", token, dto);
        setIsLoading(false);
        if (rs?.data?.status === 200) {
          swal("Update Password", "Update Password Successfully!", "success");
          e.target.reset()
        } else {
          swal("Update Password", rs.data.message, "error");
        }
      } catch (error) {
        setIsLoading(false);
        swal("Error", "An error occurred. Please try again later.", "error");
      }
    }
  };


  var [showPass, setShowPass] = useState([false, false, false])

  const handelShowPass = (index) => {
    setShowPass((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className='updateAccountPage'>
      <LoadingPage isloading={isLoading} />
      <div className='box_form'>
        <p className='title_form'>Update Password</p>
        <form onSubmit={handleUpdatePassword}>
          <div className='form_Group'>
            <label>Password Old <span> *</span></label>
            <div>
              <input
                id='pwdold'
                type={showPass[0] ? "text" : "password"}


                style={{ borderColor: errors.passold ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[0] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(0)}></i>
            </div>
          </div>
          <div className='form_Group'>
            <label>Password New <span> *</span></label>
            <div>
              <input
                id='pwdnew'
                type={showPass[1] ? "text" : "password"}

                style={{ borderColor: errors.passnew ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[1] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(1)}></i>
            </div>
          </div>
          <div className='form_Group'>
            <label>Password Confirm <span> *</span></label>
            <div>
              <input
                id='pwdcf'
                type={showPass[2] ? "text" : "password"}

                style={{ borderColor: errors.passcf ? 'red' : '' }} // Thêm border đỏ khi có lỗi
              />
              <i className={!showPass[2] ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"} onClick={() => handelShowPass(2)}></i>
            </div>
          </div>
          <div className='b_button'>
            <button type='submit'>Update</button>
            <button type='reset'>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}
