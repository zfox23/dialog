import React from "react";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
    return (
        <>
            <div className='relative flex flex-col items-center min-h-screen w-full bg-slate-50 dark:bg-neutral-800 text-neutral-950 dark:text-slate-50 transition-colors'>
                <main className="grow flex flex-col w-full max-w-4xl items-center p-2 md:p-4">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    )
}
