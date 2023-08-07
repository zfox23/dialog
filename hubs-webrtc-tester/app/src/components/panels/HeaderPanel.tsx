import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { Link } from 'gatsby';
import React from 'react';

export const HeaderPanel = ({ }) => {
    return (
        <header className='mb-8 flex flex-col items-center'>
            <h1 className='text-2xl font-semibold'>Hubs WebRTC Tester</h1>
            <div className='flex gap-1'>
                <Link className='font-semibold underline' to="about">Learn how Hubs uses WebRTC</Link>
                <span>•</span>
                <a className='underline' target="_blank" href='https://github.com/zfox23/dialog/tree/hubs-webrtc-tester/hubs-webrtc-tester'>View Source<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>
            </div>
            <p className='mt-4'>⚠️ This tool is under early and active development. Some functionality may not work as expected.</p>
        </header>
    )
}