import React from 'react';
import { Layout } from '../components/Layout';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { StaticImage } from "gatsby-plugin-image";
import Divider from '../components/Divider';

const AboutPage = ({ }) => {
    return (
        <Layout>
            <header className='mb-8 flex flex-col items-center'>
                <h1 className='text-2xl font-semibold'>How Mozilla Hubs Uses WebRTC</h1>
                <a className='text-sm underline' href='/'>Return to Tester Home</a>
            </header>

            <StaticImage className='mx-auto max-w-md rounded-md' src="../images/header.png" alt="Hubs 💖 WebRTC" quality={100} />

            <div className='space-y-8'>
                <div id="introduction" className='mt-4 pt-4 w-full space-y-4'>
                    <h2 className='text-xl font-semibold flex gap-2 items-center hover:underline'><a href="#introduction">Introduction</a></h2>
                    <Divider className='!mt-1' />
                    <p>This page exists to demystify WebRTC and the way Hubs uses WebRTC technologies.</p>
                    <p>By reading this document, you will:</p>
                    <ul className='list-disc ml-4 !mt-2'>
                        <li>Learn the definition of WebRTC</li>
                        <li>Understand how WebRTC-based applications transmit and receive voice and video data</li>
                        <li>Learn which software libraries are used to power Hubs' WebRTC stack</li>
                        <li>Learn how those software libraries are used in Hubs <i>(including code snippets!)</i></li>
                    </ul>
                </div>

                <div id="webrtc-primer" className='mt-4 pt-4 w-full space-y-4'>
                    <h2 className='text-xl font-semibold flex gap-2 items-center hover:underline'><a href="#webrtc-primer">What is WebRTC?</a></h2>
                    <Divider className='!mt-1' />
                    <p>WebRTC (Web Real-Time Communication) is an open-source project that <span className='font-semibold'>allows people to communicate using audio and video via their web browser.</span> Developers can also implement WebRTC technology into applications that are not web browsers, such as Discord.</p>
                    <p>The WebRTC project defines a set of protocols and APIs. Some of those protocols and APIs are implemented by browser developers. It is then the responsibility of Web application developers to properly make use of those protocols and APIs.</p>
                    <p>🦆 Hubs uses WebRTC to let people in the same Hub communicate with each other using voice chat and video.</p>
                    <p>For more technical information about WebRTC, see <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'>this WebRTC API MDN document<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                </div>

                <div id="communication-data-flow" className='mt-4 pt-4 w-full space-y-4'>
                    <h2 className='text-xl font-semibold flex gap-2 items-center hover:underline'><a href="#communication-data-flow">Communication Data Flow</a></h2>
                    <Divider className='!mt-1' />
                    <p>When two people video chat using a WebRTC-based application, Person A's voice and video data must somehow be transmitted over the Internet and received by Person B.</p>
                    <p>The simplest architecture for sending and receiving this data is for Person A's client to send that data directly to Person B's client. This architecture is called "Peer to Peer" communication.</p>

                    <h3 className='font-semibold text-lg'>Peer-to-Peer (P2P) Communication</h3>
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
                    <StaticImage className='mx-auto w-full rounded-md' src="../images/p2p.png" alt="WebRTC Peer-to-Peer architecture diagram" quality={100} />
                    <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                        <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                            <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                                <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                            </div>
                            <div className='z-10 relative'>
                                <h4 className='text-lg font-semibold'>P2P Pros</h4>
                                <ul className='list-disc ml-4 mt-2 space-y-2'>
                                    <li><span className='font-semibold'>Reduced complexity and cost:</span> We don't use any intermediate servers for audio/video data transmission</li>
                                    <li><span className='font-semibold'>Privacy by default:</span> Peers are connected directly via secure protocols</li>
                                </ul>
                            </div>
                        </div>
                        <div className='p-4 rounded-md md:max-w-sm bg-red-50 dark:bg-red-800/20 relative'>
                            <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                                <HandThumbDownIcon className='text-red-300 dark:text-red-600/40 opacity-50 mt-0.5' />
                            </div>
                            <div className='z-10 relative'>
                                <h4 className='text-lg font-semibold'>P2P Cons</h4>
                                <ul className='list-disc ml-5 mt-2 space-y-2'>
                                    <li><p><span className='font-semibold'>Upload bandwidth too high with multiple participants:</span> Each peer must upload audio/video data to all other peers.</p></li>
                                    <li><span className='font-semibold'>CPU usage too high with multiple participants:</span> Each peer must encode their audio/video for each remote peer, and that encoding process is resource-intensive.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p><span className='font-semibold'>The cons noted above make the P2P architecture a non-starter for most applications</span>, since most folks' upload speeds and CPUs are not fast enough to support more than a couple of peers.</p>
                    <p>Since the P2P architecture won't work for a multi-user application like Hubs, we must select a different communication architecture.</p>

                    <h3 className='font-semibold text-lg'>WebRTC Communication with an SFU (The Hubs Way)</h3>
                    <Divider className='!mt-1' />
                    <p>The most common WebRTC communication architecture involves the use of a <span className='font-semibold'>Selective Forwarding Unit</span>, or SFU. A Selective Forwarding Unit is a piece of software that runs on a server. The SFU receives multiple audio/video data streams from its peers. Then, the SFU's logic determines how to <i>forward</i> those data streams to all of the peers connected to it.</p>
                    
                    <div className='p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                        <div className='p-1 overflow-clip w-10 absolute top-0 left-0 bottom-0 flex items-center justify-center z-0 rounded-l-md'>
                            <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5 -ml-6' />
                        </div>
                        <div className='z-10 relative'>
                            <p><span className='font-semibold'>The Mozilla Hubs SFU is named Dialog.</span> You can take a look at Dialog's source code <a className='underline' target="_blank" href='https://github.com/mozilla/dialog'>here on GitHub<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                        </div>
                    </div>

                    <p>In the graphic below, notice how each peer only has to upload its audio/video data to <i>one</i> place: The SFU. The SFU is responsible for sending that data to all of the peers connected to it.</p>

                    <StaticImage className='mx-auto w-full rounded-md' src="../images/sfu.png" alt="WebRTC SFU architecture diagram" quality={100} />

                    <div className='flex md:gap-8 gap-2 flex-wrap justify-center items-start relative'>
                        <div className='p-4 rounded-md md:max-w-sm bg-green-50 dark:bg-green-800/20 relative'>
                            <div className='p-1 overflow-clip w-20 absolute top-0 left-0 flex items-center justify-center z-0 rounded-l-md'>
                                <HandThumbUpIcon className='text-green-300 dark:text-green-600/40 opacity-50 mt-0.5' />
                            </div>
                            <div className='z-10 relative'>
                                <h4 className='text-lg font-semibold'>SFU Pros</h4>
                                <ul className='list-disc ml-4 mt-2 space-y-2'>
                                    <li><span className='font-semibold'>Reduced bandwidth requirements for peers:</span> Each peer only needs to upload one data stream.</li>
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
                                <h4 className='text-lg font-semibold'>SFU Cons</h4>
                                <ul className='list-disc ml-5 mt-2 space-y-2'>
                                    <li><p><span className='font-semibold'>Increased system complexity:</span> Now, someone has to write and maintain complex SFU code.</p></li>
                                    <li><p><span className='font-semibold'>Server requirements:</span> The hardware powering the SFU needs to be capable of forwarding audio/video data streams from many peers, which can be expensive.</p></li>
                                    <li><span className='font-semibold'>Audio/video data isn't encrypted by default:</span> The SFU developer could access each peer's audio/video data unless the SFU developer implements end-to-end encryption (TODO: LEARN IF HUBS IMPLEMENTS E2EE FOR VIDEO/VOICE DATA).</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <p>The Dialog SFU makes use of several well-tested software libraries, which we'll discuss <a href="#webrtc-libraries" className='underline'>later in this document</a>.</p>
                </div>





                <div id="peer-discovery" className='mt-4 pt-4 w-full space-y-4'>
                    <h2 className='text-xl font-semibold flex gap-2 items-center hover:underline'><a href="#peer-discovery">Peer Discovery</a></h2>
                    <Divider className='!mt-1' />
                    <p>Consider the peer-to-peer architecture diagram above, where each peer sends audio and video data to every other peer. <span className='font-semibold'>How did each of those peers learn about the existence of other peers?</span> How did they connect to each other in the first place?</p>
                </div>






                <div id="webrtc-libraries" className='mt-4 pt-4 w-full space-y-4'>
                    <h2 className='text-xl font-semibold flex gap-2 items-center hover:underline'><a href="#webrtc-libraries">Hubs' WebRTC Libraries</a></h2>
                    <Divider className='!mt-1' />
                    <p>While it is possible for developers to write code using the bare WebRTC protocols and APIs, it is often useful to simplify app development by using well-tested software libraries that abstract away some of those core concepts.</p>
                </div>
            </div>
        </Layout>
    )
}

export default AboutPage;