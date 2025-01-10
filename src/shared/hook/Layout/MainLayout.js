import React, { useEffect, useRef, useState } from 'react';
import Navbar from "../../layout/Navbar";
import SideBar from '../../layout/SideBar';
import { useLocation } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

const MainLayout = ({ children }) => {
    // const navbarRef = useRef(null); // Ref to store the navbar reference
    // const [navbarHeight, setNavbarHeight] = useState(0); // State to hold navbar height
    // const [navbarHeightChild, setNavbarHeightChild] = useState(0); // State to hold navbar height
    // useEffect(() => {
    //     // Calculate and set the navbar height when the component mounts
    //     if (navbarRef.current) {
    //         setNavbarHeight(navbarRef.current.offsetHeight); // Get the height of the navbar
    //         setNavbarHeightChild(navbarRef.current.offsetHeight)
    //     }
    // }, [navbarRef]); // Run this effect only once after the initial render


    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [pathname]);




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

    // useEffect(() => {
    //     if (theme === "dark") {
    //         setNavbarHeightChild(navbarRef.current.offsetHeight + 5);
    //     } else {
    //         setNavbarHeightChild(navbarRef.current.offsetHeight)
    //     }

    // }, [theme]);


    return (
        <div style={mainStyle}>
            <NotificationContainer />
            <div style={sideBarStyle}>
                <SideBar />
            </div>
            <main style={mainContentStyle}>
                {/* <div style={navbar} ref={navbarRef}>
                    <Navbar />
                </div> */}
                <div style={{ ...bodyStyle }}>{children}</div>
            </main>
        </div>
    );
};


const mainStyle = {
    display: 'grid',
    height: '100vh',
};
const sideBarStyle = {

    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 3,
    width: "18%",
    height: "100vh",

};
const navbar = {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 3,
    width: '100%'

};

const mainContentStyle = {
    width: '100%',
    overflow: 'auto',
    paddingLeft: '18%'

};

const bodyStyle = {
    // backgroundColor: "var(--tra)",
    padding: "0.5rem",
};

export default MainLayout;
