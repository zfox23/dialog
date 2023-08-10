import React, { useState } from 'react';
import Divider from '../Divider';
import { StaticImage } from 'gatsby-plugin-image';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { isDarkThemeEnabled } from '../ToggleThemeSwitch';
import { useEventListenerWindow } from '../../hooks/useEventListener';

const ProtooWebSocketTransport = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="protoo-websockettransport"><a href="#protoo-websockettransport" className='hover:underline font-semibold text-xl'>Protoo <code>WebSocketTransport</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#websockettransport35'><code>(protoo client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-1 flex w-full'>
                <div className='bg-red-200 dark:bg-red-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>
                    <p>A <code>WebSocketTransport</code> is a JavaScript class that, when instantiated from the client, attempts to open a WebSocket connection to a specified URL.</p>

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
                            <p><span className="font-semibold">Translation:</span> Open a new WebSocket connection to a "URL with params" we've dynamically constructed based on the specific Hub to which we're connected. If the connection fails, attempt to retry two more times before closing the WebSocket connection.</p>
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
    )
}

const ProtooRoom = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="protoo-room"><a href="#protoo-room" className='hover:underline font-semibold text-xl'>Protoo <code>Room</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#room'><code>(protoo server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-1 flex w-full'>
                <div className='bg-red-200 dark:bg-red-900 shrink-0 w-[2px] rounded-md' />
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
    )
}

const ProtooPeer = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="protoo-peer"><a href="#protoo-peer" className='hover:underline font-semibold text-xl'>Protoo <code>Peer</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#peer'><code>(protoo server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a> <a className='underline text-xs' target="_blank" href='https://protoo.versatica.com/#peer36'><code>(protoo client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-1 flex w-full'>
                <div className='bg-red-200 dark:bg-red-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>
                    <p>A Protoo <code>Peer</code> represents a client connected to a Protoo <code>Room</code>. The concept of a <code>Peer</code> exists on both the Protoo server and the Protoo client.</p>
                    <p>Protoo <code>Peer</code>s can:</p>
                    <ul className='list-disc ml-4 !mt-0'>
                        <li>
                            <p>Send requests from the client to the Protoo signaling server via <code>Peer.request(method, [data])</code></p>
                            <ul className='list-disc ml-4'>
                                <li>The server <i>will</i> send a response to a request.</li>
                                <li>The Hubs client sends many kinds of requests to the Protoo signaling server. For example, the client will send a "join" request to the Protoo server when initially joining a Dialog <code>Room</code>.</li>
                            </ul>
                        </li>
                        <li>
                            <p>Send notifications from the client to the Protoo signaling server via <code>Peer.notify(method, [data])</code></p>
                            <ul className='list-disc ml-4'>
                                <li>The server <i>will not</i> send a response to a notification.</li>
                                <li>The Hubs <i>client</i> does not currently send any notifications, although the Dialog <i>server</i> sends notifications to connected <code>Peer</code>s. For example, the server will send a "peerClosed" notification to all other connected <code>Peer</code>s when a Protoo peer's connection closes.</li>
                            </ul>
                        </li>
                    </ul>

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
    )
}

export const ProtooSignaling = ({ darkThemeEnabled }) => {

    return (
        <div className='!mt-8 space-y-4 flex flex-col items-center w-full'>
            <div className='!mt-0 w-full flex justify-center p-4 animate-gradient items-center flex-col' style={{ "background": "linear-gradient(331deg, rgba(91,49,48,1) 0%, rgba(177,53,39,1) 45%, rgba(157,65,52,1) 100%)", "backgroundSize": "400% 400%" }} >
                <div className='w-full max-w-4xl'>
                    <div className='w-full'>
                        <h3 id="protoo-glossary" className='font-semibold text-2xl w-full text-white'><a className="hover:underline" href="#protoo-glossary">Protoo Signaling - Glossary and Usage</a></h3>
                        <Divider className='!mt-1 border-white/75' />
                    </div>
                    <StaticImage objectFit='contain' height={72} src='../../images/protoo.png' quality={100} alt="The Protoo logo" />
                </div>
            </div>

            <div className='space-y-4 max-w-4xl p-2 md:p-4'>
                <p>The authors of the Protoo library have chosen specific names to refer to signaling-related concepts. In this section, we'll define some of Protoo's relevant concepts and verbosely explore how they're used in Hubs code.</p>
                <p>Directly below each term's heading, you'll find links to Protoo's official documentation relevant to that term.</p>
            </div>

            <div className='!mt-4 space-y-6 w-full max-w-4xl p-2 md:p-4'>
                <ProtooWebSocketTransport darkThemeEnabled={darkThemeEnabled} />
                <ProtooRoom darkThemeEnabled={darkThemeEnabled} />
                <ProtooPeer darkThemeEnabled={darkThemeEnabled} />
            </div>
        </div>
    )
}