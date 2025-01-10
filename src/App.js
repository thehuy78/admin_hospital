//lib
import { CookiesProvider, useCookies } from "react-cookie";
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect } from "react";
import 'react-notifications/lib/notifications.css';
//provider
import ProtectedRoute from "./shared/function/ProtectedRoute";
import { LayoutProvider } from "./shared/hook/Layout/LayoutContext";
import LayoutSwitch from "./shared/hook/Layout/LayoutSwitch";
import { ContextToken } from "./shared/hook/ContextToken";
//page
import Dashboard from "./features/Dashboard/page/Dashboard";

import FileNotFound from "./shared/Config/FileNotFound";
import Auth from "./features/Auth/page/Auth";

//css
import "./shared/layout/style/Main.scss"
import ListDepartment from "./features/Department/page/ListDepartment";
import ListDoctor from "./features/Doctor/page/ListDoctor";
import ListBooking from "./features/Booking/page/ListBooking";


import ListPackage from "./features/Package/page/ListPackage";
import ListTesting from "./features/Testing/page/ListTesting";
import ListVaccine from "./features/Vaccine/page/ListVaccine";
import BookingDetails from "./features/Booking/page/BookingDetails";
import Analysis from "./features/Analysis/page/Analysis";

import HospitalInformation from "./features/Hospital/HospitalInformation"
import ForgotPassword from "./features/Auth/page/ForgotPassword";
import UpdatePassword from "./features/Auth/page/UpdatePassword";
import Chat from "./features/Chat/page/Chat";
import DayOff from "./features/DayOff/DayOff";
import WebSocketComponent from "./features/Chat/page/Chat";
import Account from "./features/Account/page/Account";
import Notification from "./features/Notification/page/Notification";
import EventList from "./features/Event/page/EventList";
import EventDetails from "./features/Event/page/EventDetails";
function App() {
  const [cookies] = useCookies(["token_hospital"]);


  return (

    < CookiesProvider > {/* Cung cấp context cho cookies */}
      < LayoutProvider >
        <LayoutSwitch>
          <Routes>
            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ContextToken><ProtectedRoute /></ContextToken>}>
              <Route path="dashboad" element={<Dashboard />} />
              <Route path="account" element={<Account />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="hospital" element={<HospitalInformation />} />
              <Route path="department" element={<ListDepartment />} />
              <Route path="package" element={<ListPackage />} />
              <Route path="dayoff" element={<DayOff />} />
              <Route path="chat" element={<WebSocketComponent />} />
              <Route path="testing" element={<ListTesting />} />
              <Route path="vaccine" element={<ListVaccine />} />
              <Route path="booking/:type/:id" element={<ListBooking />} />
              <Route path="booking/detail/:id" element={<BookingDetails />} />
              <Route path="department/:code/:id/doctor" element={<ListDoctor />} />
              <Route path="event" element={<EventList />} />
              <Route path="event/details/:id" element={<EventDetails />} />
              <Route path="notification" element={<Notification />} />
              <Route path="*" element={<FileNotFound />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={
              cookies && !cookies.token_hospital ? (
                <Auth />
              ) : (
                <Navigate to="/admin/dashboad" />
              )
            } />
            <Route path="/forgotpassword" element={
              cookies && !cookies.token_hospital ? (
                <ForgotPassword />
              ) : (
                <Navigate to="/admin/dashboad" />
              )
            } />
          </Routes>
        </LayoutSwitch>
      </LayoutProvider >
    </CookiesProvider >
  );
}

export default App;
