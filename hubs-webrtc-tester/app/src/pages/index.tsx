import React, { useState } from 'react';
import { Layout } from "../components/Layout";
import { Button } from '../components/Button';
import { DialogAdapter } from '../shared/lib/dialog-adapter';
import { DialogConnectionParams, LocalMediaStreamData } from '../shared/lib/dialog-interfaces';
import { UserPlusIcon, UserMinusIcon, ArrowPathIcon, QuestionMarkCircleIcon, ArrowTopRightOnSquareIcon, WifiIcon, SpeakerWaveIcon } from '@heroicons/react/20/solid';
import { ConsumerAudioTrackUI } from '../components/ConsumerAudioTrackUI';
import { isBrowser } from '../shared/lib/utilities';

const DEFAULT_DIALOG_HOST = "hubs.local";
const DEFAULT_DIALOG_PORT = "4443";
const DEFAULT_HUB_ID = '6Ek8qkK';
const DEFAULT_SESSION_ID = 'anonymous';

const IndexPage = ({ }) => {
    const dialogAdapter = new DialogAdapter();
    const [dialogHost, setDialogHost] = useState(isBrowser ? (localStorage.getItem('dialogHost') || DEFAULT_DIALOG_HOST) : DEFAULT_DIALOG_HOST);
    const [dialogPort, setDialogPort] = useState(isBrowser ? (localStorage.getItem('dialogPort') || DEFAULT_DIALOG_PORT) : DEFAULT_DIALOG_PORT);
    const [turnInfo, setTurnInfo] = useState({ enabled: false });
    const [hubID, setHubID] = useState(isBrowser ? (localStorage.getItem('hubID') || DEFAULT_HUB_ID) : DEFAULT_HUB_ID);
    const [sessionID, setSessionID] = useState(isBrowser ? (localStorage.getItem('sessionID') || DEFAULT_SESSION_ID) : DEFAULT_SESSION_ID);
    const [showConnectHelp, setShowConnectHelp] = useState(false);
    const [showHubIDHelp, setShowHubIDHelp] = useState(false);
    const [showSessionIDHelp, setShowSessionIDHelp] = useState(false);
    const [showAudioStreamsHelp, setShowAudioStreamsHelp] = useState(false);

    const [audioStreamData, setAudioStreamData] = useState<LocalMediaStreamData[]>([]);

    const onConnectClicked = async () => {
        console.log("You tapped the Connect button!");

        localStorage.setItem('dialogHost', dialogHost);
        localStorage.setItem('dialogPort', dialogPort);
        localStorage.setItem('hubID', hubID);
        localStorage.setItem('sessionID', sessionID);

        const dialogConnectionParams: DialogConnectionParams = {
            host: dialogHost,
            port: parseInt(dialogPort),
            turn: turnInfo,
            forceTcp: false,
            iceTransportPolicy: "all",
            //iceTransportPolicy: qs.get("force_tcp") || qs.get("force_turn") ? "relay" : "all"
        }
        const dataFromReticulum = {
            reticulumHubID: hubID,
            reticulumSessionID: sessionID
        }
        await dialogAdapter.connectToDialog({
            dialogConnectionParams,
            dataFromReticulum
        });

        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        await dialogAdapter.createAudioInputDeviceProducer(newStream);
    }

    const onDisconnectClicked = async () => {
        console.log("You tapped the Disconnect button!");
        await dialogAdapter.disconnectFromDialog();
    }

    const onRefreshLocalAudioStreamsClicked = () => {
        let audioStreamData: LocalMediaStreamData[] = dialogAdapter.getConsumerAudioTracks();
        
        for (let i = 0; i < audioStreamData.length; i++) {
            const newMediaStream = new MediaStream();
            newMediaStream.addTrack(audioStreamData[i].track);
            audioStreamData[i].mediaStream = newMediaStream;
        }

        setAudioStreamData(audioStreamData);
    }

    return (
        <Layout>
            <div className='flex flex-col w-full max-w-4xl items-center p-4'>
                <div className='mb-8 flex flex-col items-center'>
                    <h1 className='text-2xl font-semibold'>Hubs WebRTC Tester</h1>
                    <a className='font-semibold underline' target="_blank" href='https://github.com/zfox23/dialog/tree/hubs-webrtc-tester/hubs-webrtc-tester'>View Source<ArrowTopRightOnSquareIcon className='h-4 w-4 ml-1 -top-0.5 relative inline-block' /></a>
                    <p className='mt-4'>⚠️ This tool is under early and active development. Some functionality may not work as expected.</p>
                </div>

                <div className='w-full flex flex-col mb-8 p-6 pt-4 bg-slate-200 rounded-md items-center'>
                    <div className='flex gap-1'>
                        <h2 className='font-semibold text-xl h-8'>{<WifiIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Connect/Disconnect</h2>
                        <button className='transition-all opacity-70 hover:opacity-100'><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700' onClick={e => setShowConnectHelp(!showConnectHelp)} /></button>
                    </div>
                    {showConnectHelp ?
                        <ul className='w-full max-w-xl list-disc ml-4'>
                            <li>Ensure that Dialog is running first (unless you're testing that failure case).</li>
                            <li>For convenience, the connection parameters in this form are saved to local storage for future sessions once you tap "Connect".</li>
                        </ul> : null
                    }
                    <form className='w-full max-w-sm flex flex-col gap-2 bg-slate-300 rounded-md p-2 my-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='dialog-host' className='font-semibold'>Dialog Host</label>
                            <input id="dialog-host" className='h-8 rounded-md p-2 w-full' type="text" placeholder='Host' value={dialogHost} onChange={e => setDialogHost(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='dialog-port' className='font-semibold'>Dialog Port</label>
                            <input id="dialog-port" className='h-8 rounded-md p-2 w-full' type="text" placeholder='Port' value={dialogPort} onChange={e => setDialogPort(e.target.value)} />
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex gap-1'>
                                <label htmlFor='dialog-hub-id' className='font-semibold'>Room/Hub ID</label>
                                <button className='transition-all opacity-70 hover:opacity-100'><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700' onClick={e => { e.preventDefault(); setShowHubIDHelp(!showHubIDHelp); }} /></button>
                            </div>
                            <input id="dialog-hub-id" className='h-8 rounded-md p-2 w-full mt-1' type="text" placeholder='Room/Hub ID' value={hubID} onChange={e => setHubID(e.target.value)} />
                            {showHubIDHelp ?
                                <div className='flex flex-col gap-1 text-sm mt-1'>
                                    <p>Dialog and its underlying Mediasoup tech use the word "Room" to refer to "the virtual space in which everyone can hear/see each other."</p>
                                    <p>Reticulum uses the word "Hub" to refer to "the virtual space in which everyone can hear/see each other."</p>
                                    <p>If you have Reticulum running, try inputting the <i>Reticulum</i> Hub ID here, i.e. hubs.mozilla.com/<strong>E4e8oLx</strong>/hubs-demo-promenade</p>
                                    <p>Doing so will let you use this Tester to hear the unspatialized audio from folks in that Hub.</p>
                                </div> : null
                            }
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex gap-1'>
                                <label htmlFor='dialog-session-id' className='font-semibold'>Client Session ID</label>
                                <button className='transition-all opacity-70 hover:opacity-100'><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700' onClick={e => { e.preventDefault(); setShowSessionIDHelp(!showSessionIDHelp); }} /></button>
                            </div>
                            <input id="dialog-session-id" className='h-8 rounded-md p-2 w-full mt-1' type="text" placeholder='Session ID' value={sessionID} onChange={e => setSessionID(e.target.value)} />
                            {showSessionIDHelp ?
                                <div className='flex flex-col gap-1 text-sm mt-1'>
                                    <p>I don't quite understand exactly what this ID is, where it comes from, or how it is used. TBD!</p>
                                    <p>Dialog and its underlying Protoo signaling tech use the term "Peer ID" to identify other clients connected to the same Dialog Room.</p>
                                    <p>Reticulum uses a few terms to refer to this (and related) concepts, such as <code>localClientID</code>, <code>clientId</code>, <code>session_id</code>, and <code>peerId</code>.</p>
                                    <p>I haven't figured out whether or not this ID needs to be unique across clients.</p>
                                    <p>I'll fill in this section once I understand it more.</p>
                                </div> : null
                            }
                        </div>
                    </form>

                    <div className='flex flex-col gap-1'>
                        <div className='flex flex-row gap-2'>
                            <Button className='w-52' buttonType="button" buttonIconLeft={<UserPlusIcon className='w-5 h-5' />} buttonText="Connect" onClick={onConnectClicked} />
                            <Button buttonType="button" buttonIconLeft={<UserMinusIcon className='w-5 h-5' />} buttonText="Disconnect" onClick={onDisconnectClicked} />
                        </div>
                        <p className='text-sm font-semibold'>Status: <span className='italic font-normal'>&lt;Status Messages Not Yet Implemented&gt;</span></p>
                    </div>
                </div>

                <div className='p-4 w-full bg-slate-200 rounded-md flex flex-col items-center'>
                    <div className='flex gap-1'>
                        <h2 className='font-semibold text-xl h-8'>{<SpeakerWaveIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Remote Audio Streams</h2>
                        <button className='transition-all opacity-70 hover:opacity-100'><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700' onClick={e => setShowAudioStreamsHelp(!showAudioStreamsHelp)} /></button>
                    </div>
                    {showAudioStreamsHelp ?
                        <ul className='w-full max-w-xl list-disc ml-4'>
                            <li>Once you're connected to a Dialog instance, tap the button below to start listening to audio streams associated with all remote Dialog Consumers.</li>
                            <li>🤞 At some point, there will be a checkbox here for automatically adding/removing audio streams in this list.</li>
                        </ul> : null
                    }
                    <Button className='max-w-md mt-4' buttonType="button" buttonIconLeft={<ArrowPathIcon className='w-5 h-5' />} buttonText="Refresh Audio Streams" onClick={onRefreshLocalAudioStreamsClicked} />
                    <div id='outputAudioElContainer' className='w-full max-w-sm bg-slate-300 rounded-md p-2 flex flex-col items-center gap-1 mt-4'>
                        {audioStreamData.map((audioTrackInfo, idx) => {
                            return <ConsumerAudioTrackUI key={idx} audioTrackInfo={audioTrackInfo} />
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default IndexPage;

