import React from "react";

export const Layout = ({ children }) => {
    return (
        <>
            <div className='relative flex flex-col min-h-screen'>
                <main className="grow flex flex-col items-center bg-slate-50 dark:bg-neutral-800">
                    {children}
                </main>
            </div>
        </>
    )
}
