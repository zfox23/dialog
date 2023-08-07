import React from 'react';
import Divider from '../Divider';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, ExclamationCircleIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { StaticImage } from 'gatsby-plugin-image';

export const CommunicationDataFlow = ({ }) => {
    return (
        <div className='mt-4 pt-4 w-full max-w-4xl space-y-4'>
            <h2 id="communication-data-flow" className='text-3xl font-semibold'><a href="#communication-data-flow" className='hover:underline'>WebRTC Communication Data Flow</a></h2>
            <Divider className='!mt-1' />
            <p>When two people video chat using a WebRTC-based application, Person A's voice and video data must somehow be transmitted over the Internet and received by Person B.</p>
            <p>The simplest architecture for sending and receiving this data is for Person A's client to send that data directly to Person B's client. This architecture is called "Peer to Peer" communication.</p>

            <div className='space-y-4'>
                <h3 id="communication-p2p" className='font-semibold text-2xl'><a href="#communication-p2p" className='hover:underline'>Peer-to-Peer (P2P) Communication</a></h3>
                <Divider className='!mt-1' />
                <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative'>
                    <div className='p-1 overflow-clip w-20 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50 mt-0.5 -ml-12' />
                    </div>
                    <div className='z-10 relative'>
                        <p><span className='font-semibold'>Hubs does <i>not</i> use P2P communication for voice and video data.</span> However, understanding this architecture is fundamental to understanding more complex communication architectures.</p>
                    </div>
                </div>
                <p>With P2P communication, <span className='font-semibold'>each peer sends their audio/video data to all other connected peers:</span></p>
                <StaticImage objectFit='contain' className='mx-auto w-full rounded-md' src="../../images/p2p.png" alt="WebRTC Peer-to-Peer architecture diagram" quality={100} />
                <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                    <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                        <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                            <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                        </div>
                        <div className='z-10 relative'>
                            <h4 className='text-2xl font-semibold'>P2P Pros</h4>
                            <ul className='list-disc ml-4 mt-2 space-y-2'>
                                <li><span className='font-semibold'>Reduced complexity and cost:</span> P2P communication doesn't require the use of any intermediate servers for audio/video data transmission</li>
                                <li><span className='font-semibold'>Privacy by default:</span> Peers are connected directly via secure protocols</li>
                            </ul>
                        </div>
                    </div>
                    <div className='p-4 rounded-md md:max-w-sm bg-red-50 dark:bg-red-800/20 relative'>
                        <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                            <HandThumbDownIcon className='text-red-300 dark:text-red-600/40 opacity-50 mt-0.5' />
                        </div>
                        <div className='z-10 relative'>
                            <h4 className='text-2xl font-semibold'>P2P Cons</h4>
                            <ul className='list-disc ml-5 mt-2 space-y-2'>
                                <li><p><span className='font-semibold'>Upload bandwidth too high with multiple participants:</span> Each peer must upload audio/video data to all other peers.</p></li>
                                <li><span className='font-semibold'>CPU usage too high with multiple participants:</span> Each peer must encode their audio/video for each remote peer, and that encoding process is resource-intensive.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <p><span className='font-semibold'>The cons noted above make the P2P architecture a non-starter for most applications</span>, since most folks' upload speeds and CPUs are not fast enough to support more than a couple of peers.</p>
                <p>Since the P2P architecture won't work for a multi-user application like Hubs, we must select a different communication architecture.</p>
            </div>

            <div className='space-y-4'>
                <h3 id="communication-sfu" className='font-semibold text-2xl'><a href="#communication-sfu" className='hover:underline'>WebRTC Communication with an SFU (The Hubs Way)</a></h3>
                <Divider className='!mt-1' />
                <p>The most common WebRTC communication architecture involves the use of a <span className='font-semibold'>Selective Forwarding Unit</span>, or SFU. A Selective Forwarding Unit is a piece of software that runs on a server. The SFU receives multiple audio/video data streams from its peers. Then, the SFU's logic determines how to <i>forward</i> those data streams to all of the peers connected to it.</p>

                <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                        <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                    </div>
                    <div className='z-10 relative'>
                        <p><span className='font-semibold'>The Mozilla Hubs SFU is named Dialog.</span> Dialog is written in NodeJS. You can take a look at Dialog's source code <a className='underline' target="_blank" href='https://github.com/mozilla/dialog'>here on GitHub<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                    </div>
                </div>

                <p>In the graphic below, notice how each peer only has to upload its audio/video data to <i>one</i> place: The SFU. The SFU is responsible for sending that data to all of the peers connected to it.</p>

                <StaticImage objectFit='contain' className='mx-auto w-full rounded-md' src="../../images/sfu.png" alt="WebRTC SFU architecture diagram" quality={100} />

                <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                    <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                        <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                            <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                        </div>
                        <div className='z-10 relative'>
                            <h4 className='text-2xl font-semibold'>SFU Pros</h4>
                            <ul className='list-disc ml-4 mt-2 space-y-2'>
                                <li><span className='font-semibold'>Reduced upload bandwidth requirements for peers:</span> Each peer only needs to upload one data stream.</li>
                                <li><span className='font-semibold'>Reduced CPU requirements for peers:</span> Each peer only needs to encode the data stream once.</li>
                                <li><span className='font-semibold'>Increased flexibility:</span> For example, each peer can request that the SFU send other peers' data in lower quality.</li>
                            </ul>
                        </div>
                    </div>
                    <div className='p-4 rounded-md md:max-w-sm bg-red-50 dark:bg-red-800/20 relative'>
                        <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                            <HandThumbDownIcon className='text-red-300 dark:text-red-600/40 opacity-50 mt-0.5' />
                        </div>
                        <div className='z-10 relative'>
                            <h4 className='text-2xl font-semibold'>SFU Cons</h4>
                            <ul className='list-disc ml-5 mt-2 space-y-2'>
                                <li><p><span className='font-semibold'>Increased system complexity:</span> Someone has to write and maintain complex SFU code.</p></li>
                                <li><p><span className='font-semibold'>Server requirements:</span> The hardware powering the SFU needs to be capable of forwarding audio/video data streams from many peers, which can be computationally expensive.</p></li>
                                <li><span className='font-semibold'>Audio/video data isn't encrypted by default:</span> The SFU developer could access each peer's audio/video data unless the SFU developer implements end-to-end encryption (TODO: LEARN IF HUBS IMPLEMENTS E2EE FOR VIDEO/VOICE DATA).</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <p>There is a third mainstream architecture for WebRTC communication, and it involves using an "MCU," or Multipoint Control Unit. If you'd like to learn about this architecture, check out <a className='underline' target="_blank" href='hhttps://www.digitalsamba.com/blog/p2p-sfu-and-mcu-webrtc-architectures-explained'>this article on digitalsamba.com<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>

                <p>The Dialog SFU and the WebRTC parts of the Hubs client make significant use of two software libraries: Protoo and Mediasoup. Let's explore what those libraries do, why they're important, and how they're used.</p>
            </div>
        </div>
    )
}