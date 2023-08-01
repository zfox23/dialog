import React, { useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { StaticImage } from "gatsby-plugin-image";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Divider from '../components/Divider';
import { useEventListenerWindow } from '../hooks/useEventListener';
import { isDarkThemeEnabled } from '../components/ToggleThemeSwitch';

const useHeadings = () => {
    interface Headings {
        id: string;
        text: string;
        level: number;
    }

    const [headings, setHeadings] = useState<Headings[]>([]);
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"))
            .filter((element) => element.id && element.id !== 'navigation')
            .map((element) => ({
                id: element.id,
                text: element.textContent ?? "",
                level: Number(element.tagName.substring(1))
            }));
        setHeadings(elements);
        console.log(elements)
    }, []);
    return headings;
}

const TableOfContents = ({ className }: {className?: string}) => {
    const headings = useHeadings();
    return (
        <nav className={className}>
            <ul>
                {headings.map(heading => (
                    <li key={heading.id} className='hover:underline' style={{ marginLeft: `${heading.level - 2}em` }}>
                        <a href={`#${heading.id}`} > {heading.text} </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const AboutPage = ({ }) => {
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    return (
        <Layout>
            <header className='mb-8 flex flex-col items-center'>
                <h1 className='text-4xl font-semibold'>How Mozilla Hubs Uses WebRTC</h1>
                <a className='text-sm underline' href='/'>Return to Tester Home</a>
            </header>

            <StaticImage className='mx-auto max-w-md rounded-md' src="../images/header.png" alt="Hubs 💖 WebRTC" quality={100} />

            <div className='space-y-8 w-full'>
                <div className='mt-4 pt-4'>
                    <h2 id="navigation" className='text-3xl font-semibold hover:underline'><a href="#navigation">Navigation</a></h2>
                    <Divider className='!mt-1' />
                    <TableOfContents />
                </div>

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
                    </ul>
                </div>

                <div className='mt-4 pt-4 w-full space-y-4'>
                    <h2 id="webrtc-primer" className='text-3xl font-semibold hover:underline'><a href="#webrtc-primer">What is WebRTC?</a></h2>
                    <Divider className='!mt-1' />
                    <p>WebRTC (Web Real-Time Communication) is an open-source project that <span className='font-semibold'>allows people to communicate using audio and video via their web browser.</span> Developers can also implement WebRTC technology into applications that are not web browsers, such as Discord.</p>
                    <p>The WebRTC project defines a set of protocols and APIs. Some of those protocols and APIs are implemented by browser developers. It is then the responsibility of Web application developers to properly make use of those protocols and APIs.</p>
                    <p>🦆 Hubs uses WebRTC to let people in the same Hub communicate with each other using voice chat and video.</p>
                    <p>For more technical information about WebRTC, see <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'>this WebRTC API MDN document<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
                </div>

                <div className='mt-4 pt-4 w-full space-y-4'>
                    <h2 id="communication-data-flow" className='text-3xl font-semibold hover:underline'><a href="#communication-data-flow">Communication Data Flow</a></h2>
                    <Divider className='!mt-1' />
                    <p>When two people video chat using a WebRTC-based application, Person A's voice and video data must somehow be transmitted over the Internet and received by Person B.</p>
                    <p>The simplest architecture for sending and receiving this data is for Person A's client to send that data directly to Person B's client. This architecture is called "Peer to Peer" communication.</p>

                    <h3 className='font-semibold text-2xl'>Peer-to-Peer (P2P) Communication</h3>
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

                    <h3 className='font-semibold text-2xl'>WebRTC Communication with an SFU (The Hubs Way)</h3>
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

                    <StaticImage className='mx-auto w-full rounded-md' src="../images/sfu.png" alt="WebRTC SFU architecture diagram" quality={100} />

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

                    <p>The Dialog SFU and the WebRTC parts of the Hubs client make significant use of two software libraries: Protoo and Mediasoup. Let's explore what those libraries do, why they're important, and how they're used.</p>
                </div>


                <div className='mt-4 pt-4 w-full space-y-4'>
                    <h2 id="hubs-webrtc-libraries" className='text-3xl font-semibold hover:underline'><a href="#hubs-webrtc-libraries">Hubs' WebRTC Libraries</a></h2>
                    <h3 className='text-sm !mt-0'>Protoo and Mediasoup</h3>
                    <Divider className='!mt-1' />
                    <p>While it is possible for developers to write code using <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'>the bare WebRTC protocols and APIs<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>, it is often useful to simplify app development by using well-tested software libraries that abstract away some of those core concepts.</p>
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

                    <div className='!mt-8 space-y-4'>
                        <h3 id="protoo-glossary" className='font-semibold text-2xl'><a className="hover:underline" href="#protoo-glossary">Protoo - Glossary and Usage</a></h3>
                        <Divider className='!mt-1' />
                        <div className='!mt-2 w-full rounded-md flex justify-center p-4 bg-[rgb(91,49,48)]' >
                            <StaticImage height={72} src='../images/protoo.png' quality={100} alt="The Protoo logo" />
                        </div>
                        <p>The authors of the Protoo library have chosen specific names to refer to signaling-related concepts. In this section, we'll define some of Protoo's relevant concepts and explore how they're used in Hubs code.</p>

                        <div className='!mt-4 space-y-6'>
                            <div>
                                <h4 id="protoo-websockettransport"><a href="#protoo-websockettransport" className='hover:underline font-semibold text-xl'>Protoo <code>WebSocketTransport</code></a></h4>
                                <div className='!mt-0'>
                                    <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#websockettransport35'><code>(protoo client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
                                </div>
                                <div className='!mt-1 flex w-full'>
                                    <div className='bg-slate-200 dark:bg-neutral-500 shrink-0 w-[2px] rounded-md' />
                                    <div className='space-y-4 !mt-0 w-full pl-2'>
                                        <p>A <code>WebSocketTransport</code> is a JavaScript class that, when instantiated, attempts to open a WebSocket connection to a specified URL.</p>

                                        <div className='!mt-2 p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                                <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50' />
                                            </div>
                                            <div className='z-10 relative space-y-2'>
                                                <p><span className='font-semibold'>WebSockets allow browsers and servers to communicate without the browser needing to constantly poll the server for information.</span> For example, WebSockets are used in WebRTC signaling to inform Peer A that a new Peer B has joined a communication session - without Peer A having to <i>ask</i> the server "hey, are there any new peers here?".</p>
                                                <p>You can learn more about WebSockets via <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'>this MDN documentation<ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>.</p>
                                            </div>
                                        </div>

                                        <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                                <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                                            </div>
                                            <div className='z-10 relative space-y-2 w-full'>
                                                <p className='font-semibold'><code>WebSocketTransport</code> Example Usage</p>
                                                <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; connect()</code>:</p>
                                                <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                                    {`connect() {
    ...
    const protooTransport = new protooClient.WebSocketTransport(urlWithParams.toString(), {
        retry: { retries: 2 }
    });
    ...
}`
                                                    }
                                                </SyntaxHighlighter>
                                                <p><span className="font-semibold">Translation:</span> Open a new WebSocket connection to a "URL with params" we've dynamically constructed based on the specific Hub to which we're connected.</p>
                                                <p>We can obtain an example of such a "URL with params" by connecting to <a className='underline' target="_blank" href='https://hubs.mozilla.com/E4e8oLx/hubs-demo-promenade'>the Hubs Demo Promenade<ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>:</p>

                                                <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                                    {`const urlWithParams = 'wss://geyc4mjogaxdenl4guya.stream.reticulum.io:4443/?roomId=E4e8oLx&peerId=fd25a9c5-ee56-4be8-ad8c-ba44d9247b82'`}
                                                </SyntaxHighlighter>

                                                <p>The resultant <code>protooTransport</code> variable will be reused when creating a client-side Protoo <a className="underline" href="#protoo-peer"><code>Peer</code></a>.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 id="protoo-room"><a href="#protoo-room" className='hover:underline font-semibold text-xl'>Protoo <code>Room</code></a></h4>
                                <div className='!mt-0'>
                                    <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#room'><code>(protoo server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
                                </div>
                                <div className='!mt-1 flex w-full'>
                                    <div className='bg-slate-200 dark:bg-neutral-500 shrink-0 w-[2px] rounded-md' />
                                    <div className='space-y-4 !mt-0 w-full pl-2'>
                                        <p>A Protoo <code>Room</code> is a JavaScript class that "represents a multi-party communication context". A <code>Room</code> contains a list of <code>Peer</code>s.</p>

                                        <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative'>
                                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                                <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50' />
                                            </div>
                                            <div className='z-10 relative'>
                                                <p><span className='font-semibold'>A Protoo "Room" is different from a Dialog "Room" is different from a Hubs "Room".</span> It can sometimes be challenging to differentiate between the different meanings of the word "Room" within the Hubs codebase.</p>
                                            </div>
                                        </div>

                                        <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                                <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                                            </div>
                                            <div className='z-10 relative space-y-2 w-full'>
                                                <p className='font-semibold'><code>Room</code> Example Usage</p>
                                                <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/dialog/blob/master/lib/Room.js'>dialog/lib/Room.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; Room &gt; getCCU()</code>:</p>
                                                <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                                    {`getCCU() {
    if (!this._protooRoom || !this._protooRoom.peers) return 0;
    return this._protooRoom.peers.length;
}`}
                                                </SyntaxHighlighter>
                                                <p><span className="font-semibold">Translation:</span> The term "CCU" means "Concurrent Users". It can be useful to determine how many users are currently inside a Dialog Room.</p>
                                                <p>Firstly, if this <i>Dialog</i> room doesn't have a <i>Protoo</i> room assicated with it, OR if that Protoo room doesn't have any Protoo Peers associated with it, return <code>0</code>.</p>
                                                <p>Next, we return the number of elements in the list of <code>Peer</code>s contained within the Protoo <code>Room</code> associated with this Dialog <code>Room</code>.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 id="protoo-peer"><a href="#protoo-peer" className='hover:underline font-semibold text-xl'>Protoo <code>Peer</code></a></h4>
                                <div className='!mt-0'>
                                    <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#peer'><code>(protoo server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a> <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#peer36'><code>(protoo client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
                                </div>
                                <div className='!mt-1 flex w-full'>
                                    <div className='bg-slate-200 dark:bg-neutral-500 shrink-0 w-[2px] rounded-md' />
                                    <div className='space-y-4 !mt-0 w-full pl-2'>
                                        <p>A Protoo <code>Peer</code> represents a client connected to a Protoo <code>Room</code>.</p>

                                        <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                                <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                                            </div>
                                            <div className='z-10 relative space-y-2 w-full'>
                                                <p className='font-semibold'><code>Peer</code> Example Usage - Client Context</p>
                                                <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; connect()</code>:</p>
                                                <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                                    {`connect() {
    ...
    this._protoo = new protooClient.Peer(protooTransport);
    ...
    this._protoo.on("notification", notification => {
       ...
       switch (notification.method) {
           ...
            case "peerBlocked": {
                const { peerId } = notification.data;
                document.body.dispatchEvent(new CustomEvent("blocked", { detail: { clientId: peerId } }));
                break;
            }
            ...
        }
    }
    ...
}`}
                                                </SyntaxHighlighter>
                                                <p><span className="font-semibold">Translation:</span> When the Dialog client begins the connection process to the Dialog server, the client instantiates a new Protoo <code>Peer</code> class. That instantiation requires passing a valid <a href="#protoo-websockettransport" className='underline'><code>WebSocketTransport</code></a> object, named <code>protooTransport</code> in this case.</p>
                                                <p>Then, the client code sets up a number of handlers for events that will originate from the Protoo server via our WebSocket connection.</p>
                                                <p>One of those events is called <code>"notification"</code>. Notification events contain arbitrary data, and the client cannot respond to notification events.</p>
                                                <p>We direct the application to a specific codepath based on the value of the "method" key included with the notification payload. In this example, that "method" is the string <code>"peerBlocked"</code>.</p>
                                                <p>We then retrieve the unique, alphanumeric <code>peerId</code> from the notification payload's data. This <code>peerId</code> is associated with a remote Peer included in the Protoo Room to which we are connected.</p>
                                                <p>Finally, we dispatch a custom event to the browser's document body whose name is <code>"blocked"</code> and whose payload includes the remote <code>peerId</code>. At this point, some other Hubs client code - already set up to listen to "blocked" events - will consume this event and take some action.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>














                <div className='mt-4 pt-4 w-full space-y-4'>
                    <h2 id="peer-discovery" className='text-2xl font-semibold hover:underline'><a href="#peer-discovery">Peer Discovery</a></h2>
                    <Divider className='!mt-1' />
                    <p>Consider the peer-to-peer architecture diagram above, where each peer sends audio and video data to every other peer. <span className='font-semibold'>How did each of those peers learn about the existence of other peers?</span> How did they connect to each other in the first place?</p>
                </div>





            </div>
        </Layout>
    )
}

export default AboutPage;