import React, { useState } from 'react';
import { isBrowser } from '../../shared/lib/utilities';
import { QuestionMarkCircleIcon, UserMinusIcon, UserPlusIcon, WifiIcon } from '@heroicons/react/20/solid';
import { Button } from '../Button';

export const ConnectDisconnectPanel = ({ onConnectClicked, onDisconnectClicked, dialogHost, setDialogHost, dialogPort, setDialogPort, hubID, setHubID, sessionID, setSessionID }) => {
    const [showConnectHelp, setShowConnectHelp] = useState(false);
    const [showHubIDHelp, setShowHubIDHelp] = useState(false);
    const [showSessionIDHelp, setShowSessionIDHelp] = useState(false);

    return (
        <div className='flex flex-col mb-8 bg-slate-200 dark:bg-neutral-900 rounded-md items-center'>
            <div className='flex gap-1 w-full justify-center bg-blue-300/40 dark:bg-indigo-900 rounded-t-md p-2'>
                <h2 className='font-semibold text-xl h-8'>{<WifiIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Connect/Disconnect</h2>
                <button className='transition-all opacity-70 hover:opacity-100' onClick={e => setShowConnectHelp(!showConnectHelp)}><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700 dark:text-slate-200' /></button>
            </div>
            {showConnectHelp ?
                <ul className='w-full max-w-xl list-disc ml-4'>
                    <li>Ensure that Dialog is running first (unless you're testing that failure case).</li>
                    <li>For convenience, the connection parameters in this form are saved to local storage for future sessions once you tap "Connect".</li>
                </ul> : null
            }
            <div className='px-6 pb-4'>
                <form className='w-full max-w-sm flex flex-col gap-2 bg-slate-300 dark:bg-slate-700 rounded-md p-2 md:p-3 my-4'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='dialog-host' className='font-semibold'>Dialog Host</label>
                        <input id="dialog-host" className='h-8 rounded-md p-2 w-full dark:text-neutral-950' type="text" placeholder='Host' value={dialogHost} onChange={e => setDialogHost(e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='dialog-port' className='font-semibold'>Dialog Port</label>
                        <input id="dialog-port" className='h-8 rounded-md p-2 w-full dark:text-neutral-950' type="text" placeholder='Port' value={dialogPort} onChange={e => setDialogPort(e.target.value)} />
                    </div>
                    <div className='flex flex-col'>
                        <div className='flex gap-1'>
                            <label htmlFor='dialog-hub-id' className='font-semibold'>Room/Hub ID</label>
                            <button className='transition-all opacity-70 hover:opacity-100' onClick={e => { e.preventDefault(); setShowHubIDHelp(!showHubIDHelp); }}><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700' /></button>
                        </div>
                        <input id="dialog-hub-id" className='h-8 rounded-md p-2 w-full mt-1 dark:text-neutral-950' type="text" placeholder='Room/Hub ID' value={hubID} onChange={e => setHubID(e.target.value)} />
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
                        <input id="dialog-session-id" className='h-8 rounded-md p-2 w-full mt-1 dark:text-neutral-950' type="text" placeholder='Session ID' value={sessionID} onChange={e => setSessionID(e.target.value)} />
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
                </div>
            </div>
        </div>
    )
}