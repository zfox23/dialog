import React, { useState } from 'react';
import Divider from '../Divider';
import { StaticImage } from 'gatsby-plugin-image';
import { AcademicCapIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from '@heroicons/react/24/solid';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { isDarkThemeEnabled } from '../ToggleThemeSwitch';
import { useEventListenerWindow } from '../../hooks/useEventListener';

const MediasoupSFUProducerClient = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h5 id="mediasoup-producer-client" className="text-lg font-semibold"><a className='hover:underline' href="#mediasoup-producer-client"><code>Producer</code> - Client Context</a></h5>
            <Divider className='!mt-1' />
            <p>In the <i>client</i> context, a Mediasoup <code>Producer</code> is a JavaScript class that <span className="font-semibold">represents an audio or video source to be transmitted to and injected into</span> a server-side Mediasoup <code>Router</code>.</p>
            <p><code>Producer</code>s are contained within <code>Transport</code>s, which define how the media packets are carried.</p>

            <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Producer</code> Example Usage - Client Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; setLocalMediaStream()</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`async setLocalMediaStream(stream) {
    if (!this._sendTransport) {
        console.error("...");
        return;
    }
    ...
    await Promise.all(stream.getTracks().map(async track => {
        if (track.kind === "audio") {
            ...
            if (this._micProducer) {
                ...
            } else {
                this._micProducer = await this._sendTransport.produce({
                    track,
                    ...
                });
                ...
            }
        }
    }))
}`
                        }
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> <code>setLocalMediaStream()</code> is called by the client in a few cases, including when the client first joins a Dialog room, and when the client's audio input device changes. The <code>stream</code> variable passed to the function is <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/MediaStream'>a <code>MediaStream</code> object<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>, such as that returned by <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia'><code>getUserMedia()</code><ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></p>
                    <p>First, we must make sure we've already created a "Send Transport" locally. This <code>Transport</code> is created when initially joining a Dialog Room.</p>
                    <p><code>await Promise.all(...)</code> means "fulfill this one Promise when all of the passed Promises have fulfilled, or reject this one Promise when any one of the passed Promises has rejected."</p>
                    <p>Next, we split the input <code>stream</code> into its constituent <code>track</code>s, which are of type <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack'><code>MediaStreamTrack</code><ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>. In most cases, the <code>MediaStream</code> associated with a person's audio input device consists of just one track.</p>
                    <p>If the "kind" of track we're processing is an <code>"audio"</code> track (as opposed to a <code>"video"</code> track), and we've previously created a Mediasoup <code>Producer</code>, we execute a special case of code.</p>
                    <p>However, if this is an <code>"audio"</code> track and this is the first time we're producing, we have to create a new <code>Producer</code> by calling <code>this._sendTransport.produce()</code>. Calling this function tells the <code>Transport</code> to begin sending the specified audio track to the remote Mediasoup <code>Router</code> as per the specified options.</p>
                    <p>We can later pause, resume, and close the resultant <code>Producer</code>.</p>
                    <p><span className='font-semibold'>Critically, none of the Mediasoup-related code above has anything to do with signaling</span> (which is handled by Protoo). This signaling component is necessary for getting the media stream from Peer A to all other clients connected to a Dialog Room. Let's quickly follow through the client side of that signaling piece here:</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; createSendTransport()</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`this._sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
    ...
    try {
        const { id } = await this._protoo.request("produce", {
            transportId: this._sendTransport.id,
            kind,
            rtpParameters,
            appData
        });
        callback({ id });
    } catch (error) {
        ...
        errback(error);
    }
});`
                        }
                    </SyntaxHighlighter>
                    <p>This code snippet says: "When the Mediasoup <code>_sendTransport</code> starts producing, let the Protoo signaling server know that this client has started producing." Below, as we discuss the server-side <code>Producer</code>, we'll make more sense of what that means.</p>
                </div>
            </div>
        </div>
    )
}

const MediasoupSFUProducerServer = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h5 id="mediasoup-producer-server" className="text-lg font-semibold"><a className='hover:underline' href="#mediasoup-producer-server"><code>Producer</code> - Server Context</a></h5>
            <Divider className='!mt-1' />
            <p>In the <i>server</i> context, a Mediasoup <code>Producer</code> is a JavaScript class that <span className="font-semibold">represents an audio or video source being injected into</span> a server-side Mediasoup <code>Router</code>.</p>
            <p><code>Producer</code>s are contained within <code>Transport</code>s, which define how the media packets are carried.</p>

            <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Producer</code> Example Usage - Server Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/dialog/blob/master/lib/Room.js'>dialog/lib/Room.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; Room &gt; _handleProtooRequest()</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`async _handleProtooRequest(peer, request, accept, reject) {
    const router = this._mediasoupRouters.get(peer.data.routerId);
    switch (request.method) {
    ...
    case 'produce':
    ...
    const transport = peer.data.transports.get(transportId);
    if (!transport) throw new Error('...');
    ...
    const producer = await transport.produce(
        {
            kind,
            ...
        });
    for (const [ routerId, targetRouter ] of this._mediasoupRouters)
    {
        if (routerId === peer.data.routerId) {
            continue;
        }
        await router.pipeToRouter({
            producerId : producer.id,
            router     : targetRouter
        });
    }
    peer.data.producers.set(producer.id, producer);
    ...
    for (const otherPeer of this._getJoinedPeers({ excludePeer: peer }))
    {
        this._createConsumer(
            {
                consumerPeer : otherPeer,
                producerPeer : peer,
                producer
            });
    }
        break;
    }
}`
                        }
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> <code>_handleProtooRequest()</code> is called on the Dialog server when a Protoo signaling request is received. Dialog will always formulate and send a response to Protoo requests.</p>
                    <p>When the Dialog server receives a Protoo signaling request with method <code>"produce"</code> - as will occur when a Peer begins producing media from the client - we'll run the code above within the <code>switch</code> statement.</p>
                    <p>First, the Dialog server must obtain the "Send Transport" it previously created and stored associated with this Peer. This <code>Transport</code> was created at the client's signaling request when the client joined the Dialog room. If we don't find that Send Transport, we fail and return early.</p>
                    <p>We then create a new <code>Producer</code> on the server associated with that Send <code>Transport</code>.</p>
                    <p>In the current iteration of Hubs and Dialog, there's only ever a single element in the <code>this._mediasoupRouters</code> Map. So, we will never pipe any data between <code>Router</code>s; we'll hit that <code>continue</code> statement.</p>
                    <p>Dialog then keeps track of the <code>Producer</code> objects associated with a given Protoo <code>Peer</code>'s ID in a <code>Map</code>. This is necessary for pausing, resuming, and closing that <code>Producer</code> later.</p>
                    <p>We then create Dialog <code>Consumer</code>s on the server associated with every <i>other</i> <code>Peer</code> who is marked as having joined the Dialog room. <span className='font-semibold'>We'll learn about <code>Consumer</code>s below.</span></p>
                </div>
            </div>
        </div>
    )
}

const Producer = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="mediasoup-producer"><a href="#mediasoup-producer" className='hover:underline font-semibold text-xl'>Mediasoup <code>Producer</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup-client/api/#Producer'><code>(mediasoup client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a> <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup/api/#Producer'><code>(mediasoup server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-2 flex w-full'>
                <div className='bg-blue-200 dark:bg-blue-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>
                    <MediasoupSFUProducerClient darkThemeEnabled={darkThemeEnabled} />
                    <MediasoupSFUProducerServer darkThemeEnabled={darkThemeEnabled} />
                </div>
            </div>
        </div>
    )
}

const MediasoupSFUConsumerServer = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h5 id="mediasoup-consumer-server" className="text-lg font-semibold"><a className='hover:underline' href="#mediasoup-consumer-server"><code>Consumer</code> - Server Context</a></h5>
            <Divider className='!mt-1' />
            <p>In the <i>server</i> context, a Mediasoup <code>Consumer</code> is a JavaScript class that <span className="font-semibold">represents an audio or video source being forwarded from</span> a server-side Mediasoup <code>Router</code> to a particular endpoint.</p>
            <p><code>Consumer</code>s are contained within <code>Transport</code>s, which define how the media packets are carried.</p>

            <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Consumer</code> Example Usage - Server Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/dialog/blob/master/lib/Room.js'>dialog/lib/Room.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; Room &gt; _createConsumer()</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`async _createConsumer({ consumerPeer, producerPeer, producer }) {
    const transport = Array.from(consumerPeer.data.transports.values()).find((t) => t.appData.consuming);
    if (!transport) { return; }

    let consumer;
    try {
        consumer = await transport.consume(
        {
            producerId      : producer.id,
            rtpCapabilities : consumerPeer.data.rtpCapabilities,
            paused          : true
        });
    } catch (error) {
        return;
    }

    consumerPeer.data.consumers.set(consumer.id, consumer);
    consumerPeer.data.peerIdToConsumerId.set(producerPeer.id, consumer.id);
    ...
    // Setup Consumer event handlers...
    ...
    try {
    await consumerPeer.request(
    'newConsumer',
    {
        peerId         : producerPeer.id,
        producerId     : producer.id,
        id             : consumer.id,
        kind           : consumer.kind,
        rtpParameters  : consumer.rtpParameters,
        type           : consumer.type,
        appData        : producer.appData,
        producerPaused : consumer.producerPaused
    });

    await consumer.resume();
    ...
    } catch (error) {
        return;
    }
}`
                        }
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> We call <code>_createConsumer()</code> in a couple of cases, primarily when the Dialog server receives a Protoo signaling request with method <code>"produce"</code>. This happens when a Peer begins newly producing, <a className="underline" href="#mediasoup-producer-server">as in the <code>Producer</code> code we walked through above.</a></p>
                    <p>First, the Dialog server must obtain the "Receive Transport" it previously created and stored associated with this Peer. This <code>Transport</code> was created at the client's signaling request when the client joined the Dialog room. If we don't find that Receive Transport, we fail and return early.</p>
                    <p>Next, we initialize a paused <code>Consumer</code> on top of that <code>Transport</code>, given the RTP capabilities of the <code>Consumer</code>. "RTP" stands for "Real-time Transport Protocol", and "RTP capabilities" refer to the media codecs and types that a consumer can consume. They are set by the remote <code>Peer</code> when joining the Dialog <code>Room</code>.</p>
                    <p>We then store data about that new <code>Consumer</code> in two <code>Map</code>s, which are used in cases such as pausing/resuming the <code>Consumer</code>, or blocking other <code>Peer</code>s.</p>
                    <p>We then try to signal to the relevant Protoo <code>Peer</code> via a <code>"newConsumer"</code> request that the Peer needs to begin consuming some media. In this context, that Peer is a Hubs client.</p>
                    <p>After we get a response to that <code>"newConsumer"</code> request, we resume this consumer. That'll trigger the remote endpoint to begin receiving the first RTP media packet.</p>
                </div>
            </div>
        </div>
    )
}

const MediasoupSFUConsumerClient = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h5 id="mediasoup-consumer-client" className="text-lg font-semibold"><a className='hover:underline' href="#mediasoup-consumer-client"><code>Consumer</code> - Client Context</a></h5>
            <Divider className='!mt-1' />
            <p>In the <i>client</i> context, a Mediasoup <code>Consumer</code> is a JavaScript class that <span className="font-semibold">represents an audio or video source being transmitted from</span> a server-side Mediasoup <code>Router</code> to the client application.</p>
            <p><code>Consumer</code>s are contained within <code>Transport</code>s, which define how the media packets are carried.</p>

            <div className='!mt-2 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Consumer</code> Example Usage - Client Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; connect() &gt; _protoo.on("request") callback</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`this._protoo.on("request", async (request, accept, reject) => {
    switch (request.method) {
        case "newConsumer":
            const { peerId, producerId, id, kind, rtpParameters, appData, ... } =
            request.data;

            try {
                const consumer = await this._recvTransport.consume({
                    id,
                    producerId,
                    kind,
                    rtpParameters,
                    appData: { ...appData, peerId }
                });

                this._consumers.set(consumer.id, consumer);
                ...
                accept();

                this.resolvePendingMediaRequestForTrack(peerId, consumer.track);

                this.emit("stream_updated", peerId, kind);
            } catch (err) {
                error('...');
                throw err;
            }
            break;
    }
}`
                        }
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> We call <code>_createConsumer()</code> in a couple of cases, primarily when the Dialog server receives a Protoo signaling request with method <code>"produce"</code>. This happens when a Peer begins newly producing, <a className="underline" href="#mediasoup-producer-server">as in the <code>Producer</code> code we walked through above.</a></p>
                    <p>First, the Dialog server must obtain the "Receive Transport" it previously created and stored associated with this Peer. This <code>Transport</code> was created at the client's signaling request when the client joined the Dialog room. If we don't find that Receive Transport, we fail and return early.</p>
                    <p>Next, we initialize a paused <code>Consumer</code> on top of that <code>Transport</code>, given the RTP capabilities of the <code>Consumer</code>. "RTP" stands for "Real-time Transport Protocol", and "RTP capabilities" refer to the media codecs and types that a consumer can consume. They are set by the remote <code>Peer</code> when joining the Dialog <code>Room</code>.</p>
                    <p>We then store data about that new <code>Consumer</code> in two <code>Map</code>s, which are used in cases such as pausing/resuming the <code>Consumer</code>, or blocking other <code>Peer</code>s.</p>
                    <p>We then try to signal to the relevant Protoo <code>Peer</code> via a <code>"newConsumer"</code> request that the Peer needs to begin consuming some media. In this context, that Peer is a Hubs client.</p>
                    <p>After we get a response to that <code>"newConsumer"</code> request, we resume this consumer. That'll trigger the remote endpoint to begin receiving the first RTP media packet.</p>
                </div>
            </div>
        </div>
    )
}

const Consumer = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="mediasoup-consumer"><a href="#mediasoup-consumer" className='hover:underline font-semibold text-xl'>Mediasoup <code>Consumer</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup-client/api/#Consumer'><code>(mediasoup client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a> <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup/api/#Consumer'><code>(mediasoup server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-2 flex w-full'>
                <div className='bg-blue-200 dark:bg-blue-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>
                    <MediasoupSFUConsumerClient darkThemeEnabled={darkThemeEnabled} />
                    <MediasoupSFUConsumerServer darkThemeEnabled={darkThemeEnabled} />
                </div>
            </div>
        </div>
    )
}

const MediasoupSFUTransport = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full space-y-2'>
            <p>In <i>both</i> the client and server contexts, a Mediasoup <code>Transport</code> is a JavaScript class that uses the network to <span className="font-semibold">connect a client-side Mediasoup Device to a server-side Mediasoup Router</span>. A Transport enables sending media via a Producer or receving media via a Consumer, but not both at the same time.</p>
            <p>A Mediasoup Transport makes use of <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection'>the <code>RTCPeerConnection</code> WebRTC interface<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>.</p>
            <p>In the context of Transports, it's important to understand ICE, STUN, and TURN. For a refresher, <a className='underline' href="#ICE-STUN-and-TURN">tap here to scroll up to the "ICE, STUN, and TURN" section of this document.</a></p>

            <div className='!mt-4 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Transport</code> Example Usage - Client Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; createSendTransport() &gt; _sendTransport.on("connectionstatechange") callback</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`this._sendTransport.on("connectionstatechange", connectionState => {
    //this.checkSendIceStatus(connectionState); (Function call expanded below.)
    if (connectionState === "failed") {
        //this.restartSendICE(); (Function call expanded below.)
        if (!this._protoo || !this._protoo.connected) {
            return;
        }

        try {
            if (!this._sendTransport?._closed) {
                await this.iceRestart(this._sendTransport);
            } else {
                const { host, turn } = this._serverParams;
                const iceServers = this.getIceServers(host, turn);
                await this.recreateSendTransport(iceServers);
            }
        } catch (err) {
            ...
        }
    }                       
});`}
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> The client's <code>this._sendTransport</code> "Send Transport" is responsible for holding the "Mic Producer" and transmitting the audio input data over the network. <a className='underline text-sm' href="#mediasoup-producer-client">(Tap here to scroll up to the Producer example in this document.)</a></p>
                    <p>This event handler code fires anytime the Send Transport's connection state changes. A Transport's connection state is always one of the following values:</p>
                    <ul className='ml-4 list-disc'>
                        <li><code>"closed"</code></li>
                        <li><code>"failed"</code></li>
                        <li><code>"disconnected"</code></li>
                        <li><code>"new"</code></li>
                        <li><code>"connecting"</code></li>
                        <li><code>"connected"</code></li>
                    </ul>
                    <p>You can find a description for each of these states here: <a className='underline' target="_blank" href='https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState'><code>MDN/RTCPeerConnection/connectionState</code><ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a></p>
                    <p>In the case of this code, we're only doing something unique when the Send Transport's connection state changes to "failed." This happens when "one or more of the ICE transports on the connection is in the failed state."</p>
                    <p><a className='underline' target="_blank" href='https://www.w3.org/TR/webrtc/#dictionary-rtcofferoptions-members'>The WebRTC spec<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> recommends performing an ICE Restart in this case, which is what the above code does in various ways depending on the application's current state.</p>
                    <p>There may be an opportunity to optimize or improve this particular snippet of source code - connection state changes are a common source of application failure.</p>

                    <p className='!mt-4'>The client-side Dialog adapter sets up a very similar event handler for the Receive Transport, <code>this._recvTransport</code>.</p>
                </div>
            </div>

            <div className='!mt-6 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                    <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                </div>
                <div className='z-10 relative space-y-2 w-full'>
                    <p className='font-semibold'><code>Transport</code> Example Usage - Server Context</p>
                    <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/dialog/blob/master/lib/Room.js'>dialog/lib/Room.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; Room &gt; _handleProtooRequest()</code>:</p>
                    <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                        {`async _handleProtooRequest(peer, request, accept, reject) {
    const router = this._mediasoupRouters.get(peer.data.routerId);
    switch (request.method) {
        ...
        case 'createWebRtcTransport':
            const {
                forceTcp,
                producing,
                consuming,
                sctpCapabilities
            } = request.data;

            const webRtcTransportOptions =
            {
                ...config.mediasoup.webRtcTransportOptions,
                enableSctp     : Boolean(sctpCapabilities),
                numSctpStreams : (sctpCapabilities || {}).numStreams,
                appData        : { producing, consuming }
            };

            if (forceTcp)
            {
                webRtcTransportOptions.enableUdp = false;
                webRtcTransportOptions.enableTcp = true;
            }

            const transport = await router.createWebRtcTransport(
                webRtcTransportOptions);

            peer.data.transports.set(transport.id, transport);

            ...
            // Setup transport event handlers...
            ...

            accept(
                {
                    id             : transport.id,
                    iceParameters  : transport.iceParameters,
                    iceCandidates  : transport.iceCandidates,
                    dtlsParameters : transport.dtlsParameters,
                    sctpParameters : transport.sctpParameters
                });

            ...
            break;
    }
}`}
                    </SyntaxHighlighter>
                    <p><span className="font-semibold">Translation:</span> The client sends a <code>"createWebRtcTransport"</code> signaling request via Protoo for its Send Transport and Receive Tranport separately upon first joining the Dialog Room.</p>
                    <p>When the Dialog server receives such a signaling request, it must create a server-side Transport given certain parameters from the client and from Dialog's configuration. Gathering and setting those parameters is a majority of the code above.</p>
                    <p>Once the new Transport is created, it is associated with the Protoo Peer who sent the request to create a new Transport.</p>
                    <p>Finally, data about the Transport is sent back to the client that requested the new Transport. That data includes the Transport's:</p>
                    <ul className='list-disc ml-4'>
                        <li><span className='font-semibold'>ID:</span> A string used to uniquely identify the Transport.</li>
                        <li><span className='font-semibold'>ICE Parameters:</span> Information used to authenticate with the specified ICE server.</li>
                        <li><span className='font-semibold'>ICE Candidates:</span> ❓ TODO ❓</li>
                        <li><span className='font-semibold'>DTLS Parameters:</span> ❓ TODO ❓</li>
                        <li><span className='font-semibold'>SCTP Parameters:</span> ❓ TODO ❓</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

const Device = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="mediasoup-device"><a href="#mediasoup-device" className='hover:underline font-semibold text-xl'>Mediasoup <code>Device</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup-client/api/#Device'><code>(mediasoup client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-2 flex w-full'>
                <div className='bg-blue-200 dark:bg-blue-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>

                    <div className='w-full space-y-2'>
                        <p>A Mediasoup <code>Device</code> is a client-side JavaScript class that represents an endpoint used to connect to a Mediasoup Router to send and/or receive media.</p>
                        <p>A <code>Device</code> is an application's entrypoint into the Mediasoup client library; <a className='underline' href="#mediasoup-transport"><code>Transport</code>s</a> are created from <code>Device</code>s, and <a className='underline' href="#mediasoup-producer"><code>Producer</code>s</a>/<a className='underline' href="#mediasoup-consumer"><code>Consumer</code>s</a> are then created from <code>Transport</code>s.</p>
                        
                        <div className='!mt-4 p-4 rounded-md bg-slate-100 dark:bg-slate-500/20 relative w-full'>
                            <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                                <CodeBracketIcon className='text-slate-300 dark:text-slate-200/40 opacity-50' />
                            </div>
                            <div className='z-10 relative space-y-2 w-full'>
                                <p className='font-semibold'><code>Device</code> Example Usage</p>
                                <p>From <code><a className='underline' target="_blank" href='https://github.com/mozilla/hubs/blob/master/src/naf-dialog-adapter.js'>hubs/naf-dialog-adapter.js<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> &gt; DialogAdapter &gt; _joinRoom()</code>:</p>
                                <SyntaxHighlighter className="transition-colors rounded-md" language="javascript" style={darkThemeEnabled ? a11yDark : a11yLight} wrapLongLines={true}>
                                    {`async _joinRoom() {
    this._mediasoupDevice = new mediasoupClient.Device({});

    const routerRtpCapabilities = await this._protoo.request("getRouterRtpCapabilities");

    await this._mediasoupDevice.load({ routerRtpCapabilities });
    ...
}`}
                                </SyntaxHighlighter>
                                <p><span className="font-semibold">Translation:</span> <code>_joinRoom()</code> is called as soon as we open the Protoo signaling connection.</p>
                                <p>Immediately after that happens, we instantiate a new Mediasoup <code>Device</code>, specifying no options. By not specifying any options to this function, we're letting the Mediasoup library choose a suitable WebRTC handler associated with the client's current browser.</p>
                                <p>We then ask the Protoo signaling server for the associated Mediasoup Router's RTP capabilities. RTP capabilities define what <a className='underline' target="_blank" href='https://github.com/versatica/mediasoup/blob/v3/node/src/supportedRtpCapabilities.ts'>media codecs and RTP extensions<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a> the router supports.</p>
                                <p>Given those RTP capabilities, we can then call <code>load()</code> on our <code>Device</code>. The <code>Device</code> must be loaded and ready in order to produce and consume media.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Transport = ({ darkThemeEnabled }) => {
    return (
        <div className='w-full'>
            <h4 id="mediasoup-transport"><a href="#mediasoup-transport" className='hover:underline font-semibold text-xl'>Mediasoup <code>Transport</code></a></h4>
            <div className='!mt-0'>
                <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup-client/api/#Transport'><code>(mediasoup client docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a> <a className='underline text-xs' target="_blank" href='https://mediasoup.org/documentation/v3/mediasoup/api/#Transport'><code>(mediasoup server docs)</code><ArrowTopRightOnSquareIcon className='h-3 w-3 ml-0.5 -top-0.5 relative inline-block' /></a>
            </div>
            <div className='!mt-2 flex w-full'>
                <div className='bg-blue-200 dark:bg-blue-900 shrink-0 w-[2px] rounded-md' />
                <div className='space-y-4 !mt-0 w-full pl-2'>
                    <MediasoupSFUTransport darkThemeEnabled={darkThemeEnabled} />
                </div>
            </div>
        </div>
    )
}

export const MediasoupSFU = ({ darkThemeEnabled }) => {
    return (
        <div className='!mt-8 space-y-4 flex flex-col items-center w-full'>
            <div className='!mt-0 w-full flex justify-center animate-gradient items-center flex-col' style={{ "background": "linear-gradient(331deg, rgba(6,10,42,1) 0%, rgba(47,56,126,1) 48%, rgba(35,41,85,1) 100%)", "backgroundSize": "400% 400%" }} >
                <div className='w-full max-w-4xl px-2 py-4'>
                    <div className='w-full'>
                        <h3 id="mediasoup-glossary" className='font-semibold text-2xl w-full text-slate-50'><a className="hover:underline" href="#mediasoup-glossary">Mediasoup SFU - Glossary and Usage</a></h3>
                        <Divider className='!mt-1 border-white/75' />
                    </div>
                    <StaticImage objectFit='contain' height={72} src='../../images/mediasoup.png' quality={100} alt="The Mediasoup logo" />
                </div>
            </div>

            <div className='space-y-4 max-w-4xl p-2'>
                <p>The authors of the Mediasoup library - who are the same as the authors of the Protoo library - have chosen specific names to refer to SFU-related concepts. In this section, we'll define some of Mediasoup's relevant concepts and verbosely explore how they're used in Hubs code.</p>
                <p>Directly below each term's heading, you'll find links to Mediasoup's official documentation relevant to that term.</p>

                <div className='!mt-2 p-4 rounded-md bg-green-50 dark:bg-green-800/20 relative'>
                    <div className='p-1 overflow-clip w-16 absolute top-0.5 left-0 bottom-0 flex items-start justify-center z-0'>
                        <AcademicCapIcon className='text-green-300 dark:text-green-600/40 opacity-50' />
                    </div>
                    <div className='z-10 relative space-y-2'>
                        <p><span className='font-semibold'>As we discuss Mediasoup concepts,</span> note that Protoo doesn't have the concept of "audio/video media," and Mediasoup doesn't have the concept of <code>Room</code>s or <code>Peer</code>s. Those concepts come together in Dialog and in the client's Dialog Adapter.</p>
                    </div>
                </div>
            </div>

            <div className='!mt-4 space-y-6 w-full max-w-4xl p-2'>
                <Producer darkThemeEnabled={darkThemeEnabled} />
                <Consumer darkThemeEnabled={darkThemeEnabled} />
                <Device darkThemeEnabled={darkThemeEnabled} />
                <Transport darkThemeEnabled={darkThemeEnabled} />
                <div>
                    <h4 id="mediasoup-under-construction" className='text-lg font-semibold'>Mediasoup - &lt;Other Thing&gt; 👷</h4>
                    <Divider />
                    <p>⚠️ UNDER CONSTRUCTION (just like in the old days of web 1.0) ⚠️</p>
                </div>
            </div>
        </div>
    )
}