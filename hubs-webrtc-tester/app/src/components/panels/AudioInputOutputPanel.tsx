import React, { useState } from 'react';
import { dialogMsg, isBrowser } from '../../shared/lib/utilities';
import { DialogAdapter } from '../../shared/lib/dialog-adapter';
import { Button } from '../Button';
import { MicrophoneIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';
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
    return (
        <option value={deviceInfo.deviceId} label={deviceInfo.label} data-kind={deviceInfo.kind}>{deviceInfo.label}</option>
    )
}

export const AudioInputOutputPanel = ({ dialogAdapter }: { dialogAdapter: DialogAdapter }) => {
    const [audioInputMediaStream, setAudioInputMediaStream] = useState<MediaStream>();
    const [analyser, setAnalyser] = useState<AnalyserNode>();
    const [meterValue, setMeterValue] = useState(0.0);
    const [audioIODeviceInfo, setAudioIODeviceInfo] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioInputDeviceID, setSelectedAudioInputDeviceID] = useState<string | undefined>();
    const [selectedAudioOutputDeviceID, setSelectedAudioOutputDeviceID] = useState<string | undefined>();

    const audioContext: CustomAudioContext = new AudioContext();

    const getVolume = (analyser: AnalyserNode) => {
        const buckets = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buckets);

        return buckets.reduce((a, b) => a + b) / analyser.frequencyBinCount / 128;
    };

    useAnimationFrame((dt) => {
        if (!analyser) {
            return;
        }

        const vol = getVolume(analyser);
        setMeterValue(vol);
    })

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
            let deviceLabel = ioDevices[i].label;
            // dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Device label: ${deviceLabel}\nKind: ${ioDevices[i].kind}\nID: ${ioDevices[i].deviceId}`);

            // Some devices don't have a label.
            // In some cases, browsers won't supply a label to certain devices.
            if (!deviceLabel || deviceLabel.length === 0) {
                ioDevices[i].label = deviceLabel = "Unknown Device";
            }

            if (ioDevices[i].kind === "audioinput") {
                numInputDevices++;
            } else if (ioDevices[i].kind === "audiooutput") {
                numOutputDevices++;
            }
        };

        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.setupAudioIODropdowns()`, `Media device enumeration complete.\n${numInputDevices} input devices found.\n${numOutputDevices} output devices found.`);

        setAudioIODeviceInfo(ioDevices);
    }

    const setAudioInput = async () => {
        let audioConstraints: MediaTrackConstraints = {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        };
        if (selectedAudioInputDeviceID) {
            if (!audioConstraints.deviceId) {
                audioConstraints["deviceId"] = {};
            }
            audioConstraints["deviceId"]["exact"] = selectedAudioInputDeviceID;
        }
        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints,
            video: false
        });

        newStream.getTracks().forEach(track => setSelectedAudioInputDeviceID(track.getSettings().deviceId));

        const newInputStreamSource = audioContext.createMediaStreamSource(newStream);
        const a = audioContext.createAnalyser();
        a.minDecibels = -100;
        a.maxDecibels = -30;
        a.fftSize = 64;
        newInputStreamSource.connect(a);

        setAudioInputMediaStream(newStream);
        setAnalyser(a);

        try {
            await dialogAdapter.setInputAudioMediaStream(newStream);
        } catch (e) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.onEnableClicked()`, e);
            return;
        }
    }

    const onEnableClicked = async () => {
        try {
            await setupAudioIODropdowns();
            await setAudioInput();
        } catch (e) {
            dialogMsg(DialogLogLevel.Warn, `AudioInputOutputPanel.onEnableClicked()`, `Error while getting new audio input stream:\n${e}`);
            return;
        }
    }

    const onDisableClicked = () => {
        audioInputMediaStream?.getTracks().forEach(track => track.stop());
        audioContext?.close();
    }

    const onInputDeviceSelectChanged = (e) => {
        const newID = e.target.value;
        dialogMsg(DialogLogLevel.Log, `AudioInputOutputPanel.onInputDeviceSelectChanged()`, `Input device changed to ID: \`${newID}\``);

        setAudioInput();

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
            <div className='flex gap-1 w-full justify-center bg-blue-300/40 dark:bg-indigo-900 rounded-t-md p-2'>
                <h2 className='font-semibold text-xl h-8'>{<MicrophoneIcon className='w-5 h-5 inline-block mr-1 relative -top-0.5' />}Audio I/O</h2>
            </div>
            <div className='px-6 pb-4'>
                <div className='flex flex-row gap-2'>
                    <Button className='w-72' buttonType="button" buttonIconLeft={<SpeakerWaveIcon className='w-5 h-5' />} buttonText="Enable Audio Input" onClick={onEnableClicked} />
                    <Button className='w-64' buttonType="button" buttonIconLeft={<SpeakerXMarkIcon className='w-5 h-5' />} buttonText="Disable Audio Input" onClick={onDisableClicked} />
                </div>

                <div className='flex flex-row gap-2'>
                    <div className='flex flex-col gap-1 w-1/2'>
                        <label htmlFor='inputDeviceSelect'>Audio Input Devices:</label>
                        <select id='inputDeviceSelect' value={selectedAudioInputDeviceID} onChange={onInputDeviceSelectChanged} disabled={audioIODeviceInfo.filter((device) => { return device.kind === 'audioinput' }).length === 0}>
                            {
                                audioIODeviceInfo.filter((device) => { return device.kind === 'audioinput' }).map((device, idx) => {
                                    return (
                                        <AudioIODeviceOption key={idx} deviceInfo={device} />
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='flex flex-col gap-1 w-1/2'>
                        <label htmlFor='outputDeviceSelect'>Audio Output Devices:</label>
                        <select id='outputDeviceSelect' onChange={onOutputDeviceSelectChanged} disabled={audioIODeviceInfo.filter((device) => { return device.kind === 'audiooutput' }).length === 0}>
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