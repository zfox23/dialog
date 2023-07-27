import React, { useRef, useState } from 'react';
import { dialogMsg, isBrowser } from '../../shared/lib/utilities';
import { DialogAdapter } from '../../shared/lib/dialog-adapter';
import { Button } from '../Button';
import { MicrophoneIcon, QuestionMarkCircleIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
import { useAnimationFrame } from '../../hooks/useAnimationFrame';
import { DialogLogLevel } from '../../shared/lib/dialog-interfaces';

declare interface CustomHTMLMediaElement extends HTMLMediaElement {
    // These are undefined on Firefox by default
    sinkId?: string;
    setSinkId?: (sinkId: string) => Promise<void>;
}

declare interface CustomAudioContext extends AudioContext {
    setSinkId?: (sinkId: string) => Promise<void>;
}

const AudioIODeviceOption = ({ deviceInfo }: { deviceInfo: MediaDeviceInfo }) => {
    let label = deviceInfo.label;
    // Some devices don't have a label.
    // In some cases, browsers won't supply a label to certain devices.
    if (!label || label.length === 0) {
        label = "Unknown Device";
    }

    return (
        <option value={deviceInfo.deviceId} label={label} data-kind={deviceInfo.kind}>{deviceInfo.label}</option>
    )
}

export const AudioInputOutputPanel = ({ dialogAdapter }: { dialogAdapter: DialogAdapter }) => {
    const [showAudioIOHelp, setShowAudioIOHelp] = useState(false);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>();
    const [audioInputMediaStream, setAudioInputMediaStream] = useState<MediaStream | null>();
    const [audioIODeviceInfo, setAudioIODeviceInfo] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioInputDeviceID, setSelectedAudioInputDeviceID] = useState<string | undefined>();
    const [selectedAudioOutputDeviceID, setSelectedAudioOutputDeviceID] = useState<string | undefined>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContext: CustomAudioContext = new AudioContext();

    const getVolume = () => {
        if (!analyser) {
            return 0;
        }

        const buckets = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buckets);

        return buckets.reduce((a, b) => a + b) / analyser.frequencyBinCount / 128;
    };

    useAnimationFrame((dt) => {
        if (!(canvasRef.current)) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) {
            return;
        }

        const w = canvasRef.current.clientWidth;
        const h = canvasRef.current.clientHeight;
        canvasRef.current.width = w;
        canvasRef.current.height = h;

        ctx.clearRect(0, 0, w, h);

        const vol = getVolume();
        ctx.fillStyle = vol > 0.8 ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";
        ctx.fillRect(0, 0, vol * w, h);
    }, [analyser])

    const setupAudioIODropdowns = async () => {
        if (!isBrowser) {
            return;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Your browser does not support \`enumerateDevices()\`; audio input/output device selection is unavailable.`);
            return;
        }

        let ioDevices;
        try {
            ioDevices = await navigator.mediaDevices.enumerateDevices();
        } catch (e) {
            dialogMsg(DialogLogLevel.Error, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Error in \`enumerateDevices()\`:\n${e}`);
            return;
        }

        let numInputDevices = 0;
        let numOutputDevices = 0;

        for (let i = 0; i < ioDevices.length; i++) {
            // dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Device label: ${deviceLabel}\nKind: ${ioDevices[i].kind}\nID: ${ioDevices[i].deviceId}`);

            if (ioDevices[i].kind === "audioinput") {
                numInputDevices++;
            } else if (ioDevices[i].kind === "audiooutput") {
                numOutputDevices++;
            }
        };

        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Media device enumeration complete.\n${numInputDevices} input devices found.\n${numOutputDevices} output devices found.`);

        setAudioIODeviceInfo(ioDevices);
    }

    const setAudioInput = async (inputDeviceID?: string) => {
        let audioConstraints: MediaTrackConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            deviceId: {}
        };
        if (inputDeviceID) {
            audioConstraints["deviceId"] = {
                "exact": inputDeviceID
            };
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
            video: false
        });

        // If device selection fails for whatever reason, this will reset the dropdown to the
        // device that `getUserMedia()` is actually using.
        const actualDeviceID = newStream.getTracks()[0].getSettings().deviceId;
        if (inputDeviceID && actualDeviceID !== inputDeviceID) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.setAudioInput()`, `You selected audio input device \`${inputDeviceID}\`; \`getUserMedia()\` selected \`${actualDeviceID}\`!`);
        }
        setSelectedAudioInputDeviceID(actualDeviceID);

        const newInputStreamSource = audioContext.createMediaStreamSource(newStream);

        const a = audioContext.createAnalyser();
        a.minDecibels = -100;
        a.maxDecibels = -30;
        a.fftSize = 64;
        newInputStreamSource.connect(a);
        setAnalyser(a);

        setAudioInputMediaStream(newStream);

        try {
            await dialogAdapter.setInputAudioMediaStream(newStream);
        } catch (e) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.setAudioInput()`, e);
            return;
        }
    }

    const onEnableClicked = async () => {
        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onEnableClicked()`, `Enabling audio input...`);

        try {
            await setAudioInput();
            await setupAudioIODropdowns();
        } catch (e) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.onEnableClicked()`, `Error while getting new audio input stream:\n${e}`);
            return;
        }
    }

    const onDisableClicked = () => {
        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onEnableClicked()`, `Disabling audio input...`);

        audioInputMediaStream?.getTracks().forEach(track => track.stop());
        setAudioInputMediaStream(null);
        audioContext?.close();
    }

    const onInputDeviceSelectChanged = (e) => {
        const newID = e.target.value;
        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onInputDeviceSelectChanged()`, `Input device changed to ID: \`${newID}\``);

        setAudioInput(newID);

        setSelectedAudioInputDeviceID(newID);
    }

    const onOutputDeviceSelectChanged = async (e) => {
        const newID = e.target.value;
        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onOutputDeviceSelectChanged()`, `Output device changed to ID: \`${newID}\``);

        let allAudioNodes = document.querySelectorAll("audio");
        allAudioNodes.forEach((audioNode: CustomHTMLMediaElement) => {
            // In order to change the output device associated with an `<audio>` element, that `<audio>` element must support
            // the `sinkId` property.
            if (typeof audioNode.sinkId !== 'undefined' && typeof audioNode.setSinkId !== 'undefined') {
                audioNode.setSinkId(newID)
                    .then(() => {
                        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onOutputDeviceSelectChanged()`, `New audio output device with ID \`${newID}\` successfully attached to \`${audioNode.classList[0]}\`.`);
                    })
                    .catch(error => {
                        dialogMsg(DialogLogLevel.Error, `AudioInputOutputPanel.onOutputDeviceSelectChanged()`, `Error when setting output device on \`${audioNode}\`:\n${error}`);
                    });
            } else {
                console.error(`Your browser does not support output device selection.`);
            }
        });

        if (typeof audioContext.setSinkId !== 'undefined') {
            await audioContext.setSinkId!(newID);
        }

        setSelectedAudioOutputDeviceID(newID);
    }

    return (
        <div className='flex flex-col mb-8 bg-slate-200 dark:bg-neutral-900 rounded-md items-center'>
            <div className='flex flex-col gap-1 w-full justify-center items-center bg-blue-300/40 dark:bg-indigo-900 rounded-t-md p-2'>
                <div className='flex gap-1 justify-center'>
                    <h2 className='font-semibold text-xl h-8'>{<MicrophoneIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Audio I/O</h2>
                    <button className='transition-all opacity-70 hover:opacity-100' onClick={e => setShowAudioIOHelp(!showAudioIOHelp)}><QuestionMarkCircleIcon className='w-6 h-6 text-slate-700 dark:text-slate-200' /></button>
                </div>
                {showAudioIOHelp ?
                    <ul className='w-full max-w-xl list-disc mx-2 mt-2 p-2 pl-6 rounded-md bg-yellow-50 dark:bg-yellow-800'>
                        <li>Enable audio input using the button below to begin transmitting audio to Dialog.</li>
                        <li><strong>Current test client limitation:</strong> If you enable audio input and then connect to Dialog, your input audio will not be transmitted.</li>
                        <li>Audio input and output device selection is a common source of bugs and bug-like behavior for Web applications. Use this panel to manually test the behavior of audio I/O device selection while connected to and disconnected from the Dialog server.</li>
                    </ul> : null
                }
            </div>
            <div className='px-6 py-4'>
                <div className='flex flex-row flex-wrap justify-center gap-2'>
                    <Button className='w-72' buttonType="button" buttonIconLeft={<SpeakerWaveIcon className='w-5 h-5' />} buttonText="Enable Audio Input" onClick={onEnableClicked} />
                    <Button className='w-64' buttonType="button" buttonIconLeft={<SpeakerXMarkIcon className='w-5 h-5' />} buttonText="Disable Audio Input" onClick={onDisableClicked} />
                </div>

                <div className='flex flex-col gap-2 bg-slate-300 dark:bg-slate-700 rounded-md p-2 md:p-3 my-4'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='inputDeviceSelect' className='font-semibold'>Audio Input Device:</label>
                        <select className='h-8 rounded-md px-2 py-1 w-full bg-slate-50 disabled:bg-neutral-300 dark:disabled:bg-neutral-300 disabled:cursor-not-allowed dark:text-neutral-950'  id='inputDeviceSelect' value={selectedAudioInputDeviceID} onChange={onInputDeviceSelectChanged} disabled={audioIODeviceInfo.filter((device) => { return device.kind === 'audioinput' }).length === 0}>
                            {
                                audioIODeviceInfo.filter((device) => { return device.kind === 'audioinput' }).map((device, idx) => {
                                    return (
                                        <AudioIODeviceOption key={idx} deviceInfo={device} />
                                    )
                                })
                            }
                        </select>
                        <canvas ref={canvasRef} className='w-full h-2 bg-slate-50 dark:bg-neutral-200 rounded-md' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='outputDeviceSelect' className='font-semibold'>Audio Output Device:</label>
                        <select className='h-8 rounded-md px-2 py-1 w-full bg-slate-50 disabled:bg-neutral-300 dark:disabled:bg-neutral-300 disabled:cursor-not-allowed dark:text-neutral-950' id='outputDeviceSelect' onChange={onOutputDeviceSelectChanged} disabled={audioIODeviceInfo.filter((device) => { return device.kind === 'audiooutput' }).length === 0}>
                            {
                                audioIODeviceInfo.filter((device) => { return device.kind === 'audiooutput' }).map((device, idx) => {
                                    return (
                                        <AudioIODeviceOption key={idx} deviceInfo={device} />
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}