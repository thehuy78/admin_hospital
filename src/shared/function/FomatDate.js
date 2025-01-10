// utils.js
export const formatDate = (datetimeStr) => {
  // Chuyển chuỗi ISO 8601 thành đối tượng Date
  const date = new Date(datetimeStr);

  // Lấy các thành phần của ngày tháng
  const day = String(date.getDate()).padStart(2, '0');  // Thêm số 0 vào trước nếu ngày < 10
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên phải +1
  const year = date.getFullYear();

  // Lấy giờ phút giây
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');


  // Định dạng lại chuỗi theo ngày/tháng/năm giờ:phút:giây
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};



export const formatDateNotTime = (datetimeStr) => {
  // Chuyển chuỗi ISO 8601 thành đối tượng Date
  const date = new Date(datetimeStr);

  // Lấy các thành phần của ngày tháng
  const day = String(date.getDate()).padStart(2, '0');  // Thêm số 0 vào trước nếu ngày < 10
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên phải +1
  const year = date.getFullYear();




  // Định dạng lại chuỗi theo ngày/tháng/năm giờ:phút:giây
  return `${day}/${month}/${year}`;
};



export const formatDateBlogDetail = (datetimestring) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const date = new Date(datetimestring);

  // Lấy các thành phần của ngày tháng
  const day = date.getDate(); // Không cần thêm số 0 ở trước ngày
  const month = monthNames[date.getMonth()]; // Lấy tên tháng từ mảng monthNames
  const year = date.getFullYear();

  // Trả về định dạng "September 26, 2024"
  return `${month} ${day}, ${year}`;
}
