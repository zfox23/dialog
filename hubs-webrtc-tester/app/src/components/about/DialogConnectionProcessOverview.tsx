import React from 'react';
import Divider from '../Divider';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export const DialogConnectionProcessOverview = ({ }) => {
    return (
        <div className='mt-4 p-2 md:p-4 pt-4 w-full max-w-4xl space-y-4'>
            <h2 id="dialog-connection-overview" className='text-3xl font-semibold'><a href="#dialog-connection-overview" className='hover:underline'>Dialog Connection Process Overview</a></h2>
            <Divider className='!mt-1' />
            <p>To tie all of the above together, we outline here the steps that the client takes to connect to a Dialog instance.</p>

            <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50' />
                </div>
                <div className='z-10 relative'>
                    <p><span className='font-semibold'>This outline does not cover error handling.</span> If an error occurs at any point during this complex connection process, the client must attempt to recover. There may be unhandled error cases in this process. Such error cases can be tough to find, and may be the source of unresolved WebRTC-related bugs.</p>
                </div>
            </div>
        </div>
    )
}