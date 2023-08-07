import React from 'react';
import Divider from '../Divider';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export const WhatIsWebRTC = ({ }) => {
    return (<div className='mt-4 pt-4 w-full space-y-4'>
            <h2 id="webrtc-primer" className='text-3xl font-semibold hover:underline'><a href="#webrtc-primer">What is WebRTC?</a></h2>
            <Divider className='!mt-1' />
            <p>WebRTC (Web Real-Time Communication) is an open-source project that <span className='font-semibold'>allows people to communicate using audio and video via their web browser.</span> Developers can also implement WebRTC technology into applications that are not web browsers, such as Discord.</p>
            <p>The WebRTC project defines a set of protocols and APIs. Some of those protocols and APIs are implemented by browser developers. It is then the responsibility of Web application developers to properly make use of those protocols and APIs.</p>
            <p>🦆 Hubs uses WebRTC to let people in the same Hub communicate with each other using voice chat and video.</p>
            <p>For more technical information about WebRTC, see <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'>this WebRTC API MDN document<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
        </div>
    )
}