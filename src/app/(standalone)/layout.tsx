import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen w-screen overflow-hidden bg-white">
            {children}
        </div>
    )
}

export default Layout
