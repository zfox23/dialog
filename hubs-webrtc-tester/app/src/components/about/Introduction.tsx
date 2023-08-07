import React from 'react';
import Divider from '../Divider';

export const Introduction = ({ }) => {
    return (
        <div className='pt-4 w-full space-y-4'>
            <h2 id="introduction" className='text-3xl font-semibold hover:underline'><a href="#introduction">Introduction</a></h2>
            <Divider className='!mt-1' />
            <p>This page exists to demystify WebRTC and the way Hubs uses WebRTC technologies so that more people can understand and make better use of Hubs' communication capabilites.</p>
            <p>By reading this document, you will:</p>
            <ul className='list-disc ml-4 !mt-2'>
                <li>Learn the definition of WebRTC</li>
                <li>Understand how WebRTC-based applications transmit and receive voice and video data</li>
                <li>Learn which software libraries are used to power Hubs' WebRTC stack</li>
                <li>Learn how those software libraries are used in Hubs <i>(including code snippets!)</i></li>
                <li>Learn the answers to <a className="underline" href="#faq">frequently asked questions</a></li>
            </ul>
        </div>
    )
}