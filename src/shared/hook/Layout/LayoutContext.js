import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
    const location = useLocation();
    const [layout, setLayout] = useState("auth");
    useEffect(() => {
        if (location.pathname.startsWith('/admin')) {
            setLayout('main');
        } else {
            setLayout('auth');
        }

    }, [location.pathname]);
    const value = {
        layout,
        setLayout,
    };
    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
}
