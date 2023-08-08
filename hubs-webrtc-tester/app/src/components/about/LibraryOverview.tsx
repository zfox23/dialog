import React from 'react';
import Divider from '../Divider';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export const LibraryOverview = ({ }) => {
    return (
        <div className='space-y-4 w-full max-w-4xl'>
            <h2 id="hubs-webrtc-libraries" className='text-3xl font-semibold'><a href="#hubs-webrtc-libraries" className='hover:underline'>Hubs' WebRTC Libraries</a></h2>
            <h3 className='text-sm !mt-0'>Protoo and Mediasoup</h3>
            <Divider className='!mt-1' />
            <p>While it is possible for developers to write code using <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'>the bare WebRTC protocols and APIs<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>, it is often useful to simplify app development by using well-tested software libraries that abstract away some of those core concepts.</p>
            <p>The Dialog SFU and the WebRTC parts of the Hubs client make significant use of two software libraries: Protoo and Mediasoup. Let's explore what those libraries do, why they're important, and how they're used.</p>
            <p>Dialog, the Hubs SFU, uses:</p>
            <ul className='list-disc ml-5 !mt-1 space-y-1'>
                <li><p><a className='underline font-semibold' target="_blank" href='https://protoo.versatica.com/#protoo-server'>protoo-server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> - "a minimalist and extensible Node.js <i>signaling framework</i> for multi-party Real-Time Communication applications"</p></li>
                <li><p><a className='underline font-semibold' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup/'>mediasoup<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> - A "C++ SFU and server side Node.js module."</p></li>
            </ul>

            <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2'>
                    <p><span className='font-semibold'>"Signaling" refers to the act of coordinating WebRTC communication between peers.</span> For example, in order for Peer A to recognize the existence and media capabilities of Peer B, a signaling server must liase that communication.</p>
                    <p>The role of Protoo, Hubs' signaling framework, will become more clear as we continue to walk through the software.</p>
                </div>
            </div>

            <p><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'><code>naf-dialog-adapter.js</code><ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>, the primary Hubs client code that communicates with Dialog, uses:</p>
            <ul className='list-disc ml-5 !mt-1 space-y-1'>
                <li><p><a className='underline font-semibold' target="_blank" href='https://protoo.versatica.com/#protoo-client'>protoo-client<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> - "The protoo client side JavaScript library. It runs in both browser and Node.js environments."</p></li>
                <li><p><a className='underline font-semibold' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup-client/'>mediasoup-client<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> - A "Client side JavaScript library for browsers and Node.js clients."</p></li>
            </ul>

            <Divider />
        </div>
    )
}