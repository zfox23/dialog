import React from 'react';
import Divider from '../Divider';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { HubsDivider } from '../HubsDivider';
import { TableRow } from '../TableRow';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const DialogConnectionProcessOverview = ({ darkThemeEnabled }) => {
    return (
        <div className='mt-4 p-2 pt-4 w-full max-w-7xl space-y-4'>
            <div className='w-full max-w-4xl space-y-4 mx-auto'>
                <h3 id="dialog-connection-overview" className='text-2xl font-semibold'><a href="#dialog-connection-overview" className='hover:underline'>Dialog Connection Process</a></h3>
                <Divider className='!mt-1' />
                <p>We outline here the steps that the client takes to connect to a Dialog instance and begin sending/receiving media.</p>

                <div className='p-4 rounded-md bg-yellow-50 dark:bg-yellow-800/20 relative'>
                    <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                        <ExclamationCircleIcon className='text-yellow-300 dark:text-yellow-600/40 opacity-50' />
                    </div>
                    <div className='z-10 relative'>
                        <p><span className='font-semibold'>This outline does not cover error handling.</span> If an error occurs at any point during this complex connection process, the client must attempt to recover. There may be unhandled error cases in this process. Such error cases can be tough to find, and may be the source of unresolved WebRTC-related bugs.</p>
                    </div>
                </div>
            </div>

            <table className='w-full inline-block mt-4 md:w-auto table-auto overflow-x-auto rounded-md'>
                <thead className='text-xs uppercase bg-slate-700 text-slate-100'>
                    <tr>
                        <th scope="col" className="px-1 py-3">File</th>
                        <th scope="col" className="px-6 py-3">Function</th>
                        <th scope="col" className="px-6 py-3">Translation</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/hub.js" target="_blank" className='underline text-sm'><code>hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`document.addEventListener("DOMContentLoaded") Callback`}
                        </SyntaxHighlighter>,
                        <p>Fires upon page load</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/hub.js" target="_blank" className='underline text-sm'><code>hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`hubPhxChannel.join().receive("ok", async data => {...})`}
                        </SyntaxHighlighter>,
                        <p>Join the Reticulum (Phoenix) WebSocket Channel associated with this Hub</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/hub.js" target="_blank" className='underline text-sm'><code>hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`handleHubChannelJoined(...data)`}
                        </SyntaxHighlighter>,
                        <p>We successfully joined Reticulum and have received Dialog connection data; call this function</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/hub.js" target="_blank" className='underline text-sm'><code>hub.js</code></a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`APP.dialog.connect({...})`}
                        </SyntaxHighlighter>,
                        <p>Call into the Dialog adapter with the Dialog connection data</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`const protooTransport = new protooClient.WebSocketTransport(urlWithParams.toString(), {});
this._protoo = new protooClient.Peer(protooTransport);`}
                        </SyntaxHighlighter>,
                        <p>Connect to the Protoo signaling server</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this._protoo.on("request", async (request, accept, reject) => { ... })`}
                        </SyntaxHighlighter>,
                        <p>Set up Protoo request handler for <code>"newConsumer"</code> requests for receiving media later</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`await this._joinRoom();`}
                        </SyntaxHighlighter>,
                        <p>The Protoo signaling connection is open; call this function</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this._mediasoupDevice = new mediasoupClient.Device({});`}
                        </SyntaxHighlighter>,
                        <p>Create a Mediasoup Device</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`const { host, turn } = this._serverParams;
const iceServers = this.getIceServers(host, turn);`}
                        </SyntaxHighlighter>,
                        <p>Perform ICE candidate gathering based on info from Reticulum</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`await this.createSendTransport(iceServers);
await this.createRecvTransport(iceServers);`}
                        </SyntaxHighlighter>,
                        <p>Create Send and Receive <code>Transport</code>s on <i>both</i> the client and Dialog</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this._sendTransport.on("connect", ({ dtlsParameters }, ...) => {...})`}
                        </SyntaxHighlighter>,
                        <p>When the Send Transport is created and connected, this callback fires. (The same happens for the Receive Transport.)</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this._protoo.request("connectWebRtcTransport", { ..., dtlsParameters }).then(callback).catch(errback);`}
                        </SyntaxHighlighter>,
                        <p>Make a signaling request to send Dialog our DTLS parameters for secure Transport connections</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`this._sendTransport.on("produce", async (...) => {...})`}
                        </SyntaxHighlighter>,
                        <p>Set up a callback so that later, when a local Producer starts producing, we use this callback to tells Dialog to create a Consumer</p>
                    ]} />
                    <TableRow col1={
                        <a href="https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js" target="_blank" className='underline text-sm'>Dialog Adapter</a>
                    } cols={[
                        <SyntaxHighlighter className="transition-colors rounded-md text-sm" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                            {`await this._protoo.request("join", {...})`}
                        </SyntaxHighlighter>,
                        <p>Send a Protoo signaling request to "join". We become a new Dialog Peer, and begin consuming existing peers' media producers.</p>
                    ]} />
                </tbody>
            </table>
        </div>
    )
}