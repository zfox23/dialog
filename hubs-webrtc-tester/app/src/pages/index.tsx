import React, { useState } from 'react';
import { Layout } from "../components/Layout";
import { DialogAdapter } from '../shared/lib/dialog-adapter';
import { DialogConnectionParams, LocalMediaStreamData } from '../shared/lib/dialog-interfaces';
import { isBrowser } from '../shared/lib/utilities';
import { ConnectDisconnectPanel } from '../components/panels/ConnectDisconnectPanel';
import { RemoteAudioStreamsPanel } from '../components/panels/RemoteAudioStreamsPanel';
import { HeaderPanel } from '../components/panels/HeaderPanel';
import { LogPanel } from '../components/panels/LogPanel';
import { AudioInputOutputPanel } from '../components/panels/AudioInputOutputPanel';
import { SEO } from '../components/SEO';
import { useEventListenerWindow } from '../hooks/useEventListener';
import { isDarkThemeEnabled } from '../components/ToggleThemeSwitch';

const DEFAULT_DIALOG_HOST = "hubs.local";
const DEFAULT_DIALOG_PORT = "4443";
const DEFAULT_HUB_ID = '6Ek8qkK';
const DEFAULT_SESSION_ID = 'anonymous';

const IndexPage = ({ }) => {
    const [darkThemeEnabled, setDarkThemeEnabled] = useState(isDarkThemeEnabled());

    useEventListenerWindow("darkThemeChanged", (evt) => {
        setDarkThemeEnabled(evt.detail);
    });

    const dialogAdapter = new DialogAdapter();

    const [dialogHost, setDialogHost] = useState(isBrowser ? (localStorage.getItem('dialogHost') || DEFAULT_DIALOG_HOST) : DEFAULT_DIALOG_HOST);
    const [dialogPort, setDialogPort] = useState(isBrowser ? (localStorage.getItem('dialogPort') || DEFAULT_DIALOG_PORT) : DEFAULT_DIALOG_PORT);
    const [turnInfo, setTurnInfo] = useState({ enabled: false });
    const [hubID, setHubID] = useState(isBrowser ? (localStorage.getItem('hubID') || DEFAULT_HUB_ID) : DEFAULT_HUB_ID);
    const [sessionID, setSessionID] = useState(isBrowser ? (localStorage.getItem('sessionID') || DEFAULT_SESSION_ID) : DEFAULT_SESSION_ID);

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

        try {
            await dialogAdapter.connectToDialog({
                dialogConnectionParams,
                dataFromReticulum
            });
        } catch (e) {
            console.warn(e);
        }
    }

    const onDisconnectClicked = () => {
        console.log("You tapped the Disconnect button!");
        dialogAdapter.disconnectFromDialog();
    }

    return (
        <Layout>
            <SEO />
            <div className='flex flex-col w-full items-center'>
                <HeaderPanel />

                <div className='p-2 flex flex-col w-full items-center'>
                    <ConnectDisconnectPanel onConnectClicked={onConnectClicked} onDisconnectClicked={onDisconnectClicked} dialogHost={dialogHost} setDialogHost={setDialogHost} dialogPort={dialogPort} setDialogPort={setDialogPort} hubID={hubID} setHubID={setHubID} sessionID={sessionID} setSessionID={setSessionID} />

                    <AudioInputOutputPanel dialogAdapter={dialogAdapter} />

                    <RemoteAudioStreamsPanel dialogAdapter={dialogAdapter} />

                    <LogPanel darkThemeEnabled={darkThemeEnabled} />
                </div>
            </div>
        </Layout>
    )
}

export default IndexPage;

