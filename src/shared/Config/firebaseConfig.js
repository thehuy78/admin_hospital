// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyDCbWgvWptVYsx1Bi94EuMQPax4jNyI7Sc",
  authDomain: "medcare-9db1e.firebaseapp.com",
  databaseURL: "https://medcare-9db1e-default-rtdb.firebaseio.com",
  projectId: "medcare-9db1e",
  storageBucket: "medcare-9db1e.appspot.com",
  messagingSenderId: "239444777310",
  appId: "1:239444777310:web:932c858bf1ee45ef4817cf",
  measurementId: "G-DCS1R6Y7GG"
};



// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const analytics = getAnalytics(app);

// Hàm để lắng nghe thông báo
export const listenForNotifications = (userId, setNotification) => {
  const notificationsRef = ref(database, `notifications/${userId}`);
  // console.log(notificationsRef);



  onValue(notificationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      setNotification(data);
      // console.log(data); // Kiểm tra dữ liệu nhận được
      // setTimeout(() => {
      //   // remove(notificationsRef).then(() => {
      //   //   console.log("Notification removed successfully.");
      //   // }).catch((error) => {
      //   //   console.error("Error removing notification: ", error);
      //   // });
      // }, 1000);

    }
  });
};
