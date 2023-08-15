import React from 'react';
import Divider from '../Divider';
import { HubsDivider } from '../HubsDivider';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export const Conclusion = ({ }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-4xl space-y-4'>
            <h2 id="conclusion" className='text-3xl font-semibold'><a href="#conclusion" className='hover:underline'>Conclusion</a></h2>
            <Divider className='!mt-1' />
            <p>With a more thorough understanding of WebRTC, Dialog, and Hubs as a whole, you are now equipped to critically explore and make meaningful contributions to the Hubs codebases:</p>
            <ul className='!mt-2 ml-4 list-disc'>
                <li><a className='underline' target="_blank" href='https://github.com/mozilla/hubs'>Hubs client<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></li>
                <li><a className='underline' target="_blank" href='https://github.com/mozilla/dialog'>Dialog SFU and Signaling Server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></li>
                <li><a className='underline' target="_blank" href='https://github.com/mozilla/reticulum'>Reticulum Phoenix Server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></li>
                <li><a className='underline' target="_blank" href='https://github.com/mozilla/hubs-compose'>hubs-compose - A Docker Componse setup for locally running all Hubs components<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></li>
            </ul>

            <p>If you have additional questions about Hubs or Hubs' use of WebRTC, Mozilla developers are available to answer your questions on <a className='underline' target="_blank" href='https://discord.com/invite/sBMqSjCndj'>the Hubs Discord server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>

            <HubsDivider className='w-full max-w-6xl' />
        </div>
    )
}