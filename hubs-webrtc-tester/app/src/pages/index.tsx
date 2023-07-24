import React, { useState } from 'react';
import { Layout } from "../components/Layout";
import { DialogAdapter } from '../shared/lib/dialog-adapter';
import { DialogConnectionParams, LocalMediaStreamData } from '../shared/lib/dialog-interfaces';
import { isBrowser } from '../shared/lib/utilities';
import { ConnectDisconnectPanel } from '../components/panels/ConnectDisconnectPanel';
import { RemoteAudioStreamsPanel } from '../components/panels/RemoteAudioStreamsPanel';
import { HeaderPanel } from '../components/panels/HeaderPanel';

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
            <HeaderPanel />

            <ConnectDisconnectPanel onConnectClicked={onConnectClicked} onDisconnectClicked={onDisconnectClicked} dialogHost={dialogHost} setDialogHost={setDialogHost} dialogPort={dialogPort} setDialogPort={dialogPort} hubID={hubID} setHubID={setHubID} sessionID={sessionID} setSessionID={setSessionID} />

            <RemoteAudioStreamsPanel audioStreamData={audioStreamData} onRefreshLocalAudioStreamsClicked={onRefreshLocalAudioStreamsClicked} />
        </Layout>
    )
}

export default IndexPage;

