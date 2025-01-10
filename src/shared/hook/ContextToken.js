import { jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
const AdminContext = createContext();

export const ContextToken = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cookie,] = useCookies(["token_hospital"]);
  useEffect(() => {
    if (cookie.token_hospital) {
      setToken(cookie.token_hospital)
      setUser(jwtDecode(cookie.token_hospital))
    }
  }, [cookie]);


  return (
    <AdminContext.Provider value={{ token, user }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};


