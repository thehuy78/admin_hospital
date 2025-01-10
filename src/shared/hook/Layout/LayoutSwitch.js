import React, { memo } from 'react'
import { useLayout } from "./LayoutContext"
import MainLayout from './MainLayout'
import AuthLayout from './AuthLayout'
const LayoutSwitch = ({ children }) => {
    const { layout } = useLayout();

    if (layout === 'auth') {
        return <AuthLayout>{children}</AuthLayout>
    }
    else {
        return <MainLayout>{children}</MainLayout>
    }
}
export default memo(LayoutSwitch) 
