import { DialogAdapter } from "../shared/lib/dialog-adapter";
import { DialogConnectionParams } from "../shared/lib/dialog-interfaces";

// Insecure! Use only for debugging locally.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const connectToDialog = async () => {
    const dialogHost = `hubs.local`;
    const dialogPort = `4443`;
    const turnInfo = { enabled: false };
    const hubID = `xxxxx`;
    const sessionID = `anonymous`;

    const dialogAdapter = new DialogAdapter();

    const dialogConnectionParams: DialogConnectionParams = {
        host: dialogHost,
        port: parseInt(dialogPort),
        turn: turnInfo,
        forceTcp: false,
        iceTransportPolicy: "all",
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

connectToDialog();
