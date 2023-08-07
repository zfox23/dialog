import { ArrowTopRightOnSquareIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { Link } from 'gatsby';
import React from 'react';
import { ThemeToggleSwitch } from '../ToggleThemeSwitch';

export const HeaderPanel = ({ }) => {
    return (
        <header className='w-full flex flex-col items-center'>
            <div className='flex py-2 flex-col items-center bg-slate-200/60 dark:bg-neutral-700 border-y-2 border-slate-300/40 dark:border-neutral-600 w-full'>
                <h1 className='text-3xl font-semibold'>Hubs WebRTC Tester</h1>
                <a className='hover:underline mb-2' target="_blank" href='https://github.com/zfox23/dialog/tree/hubs-webrtc-tester/hubs-webrtc-tester'>View Source<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>
                <Link className='font-semibold mb-2 hover:underline py-2 px-3 rounded-md text-white' to="about" style={{ "background": "linear-gradient(107.97deg,#489cbe 6.73%,#5427c9 39.4%,#a8527c 77.18%,#a67878 104.75%)" }}>Learn how Hubs uses WebRTC</Link>
                <ThemeToggleSwitch className='mt-0.5' />
            </div>

            <div className='my-4 p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative w-full max-w-4xl'>
                <div className='p-1 overflow-clip w-20 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                    <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50 mt-0.5 -ml-12' />
                </div>
                <div className='z-10 relative space-y-4'>
                    <p><span className='font-semibold'>Your feedback will help improve this tool!</span> You can submit questions and comments about this tool via Discord DM (@ZachAtMozilla) or <a className='underline' target="_blank" href='https://discord.com/invite/sBMqSjCndj'>the "🔒private-dev" channel on the Hubs Discord server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                    <p><span className='font-semibold'>This tool is under early and active development.</span> Some functionality may not work as expected.</p>
                </div>
            </div>
        </header>
    )
}