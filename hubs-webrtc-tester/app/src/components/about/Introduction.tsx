import React from 'react';
import Divider from '../Divider';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export const Introduction = ({ }) => {
    return (
        <div className='pt-4 w-full max-w-4xl space-y-4'>
            <h2 id="introduction" className='text-3xl font-semibold'><a href="#introduction" className='hover:underline'>Introduction</a></h2>
            <Divider className='!mt-1' />
            <p>This page exists to demystify WebRTC and the way Hubs uses WebRTC technologies so that more people can understand and make better use of Hubs' communication capabilites. Additionally, with a deeper understanding of the Hubs technology stack, more community members will be able to suggest improvements to and fix bugs regarding the WebRTC components of Hubs.</p>
            <p>By reading this document, you will:</p>
            <ul className='list-disc ml-4 !mt-2'>
                <li>Learn the definition of WebRTC</li>
                <li>Understand how WebRTC-based applications transmit and receive voice and video data</li>
                <li>Learn which software libraries are used to power Hubs' WebRTC stack</li>
                <li>Learn how those software libraries are used in Hubs <i>(including code snippets and explanations)</i></li>
                <li>Learn the answers to <a className="underline" href="#faq">frequently asked questions</a></li>
            </ul>

            <p>If you have additional questions about Hubs or Hubs' use of WebRTC, Mozilla developers are available to answer your questions on <a className='underline' target="_blank" href='https://discord.com/invite/sBMqSjCndj'>the Hubs Discord server<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
        </div>
    )
}