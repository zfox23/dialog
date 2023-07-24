import { DialogConnectionParams, DialogLogLevel, IceServers } from "./dialog-interfaces";
import { DialogSignalingController, DialogSignalingStates } from "./dialog-signaling-controller";
import { DialogStreamController } from "./dialog-stream-controller";
import { dialogMsg, safePrint } from "./utilities";
import * as mediasoupClient from "mediasoup-client";
import { ConnectionState, Consumer, Producer, Transport, TransportOptions } from "mediasoup-client/lib/types";


export enum DialogSessionStates {
    NEW = "new",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    COMPLETED = "completed",
    DISCONNECTED = "disconnected",
    FAILED = "failed",
    CLOSED = "closed"
};

export class DialogSession {
    _state: DialogSessionStates;
    _stateChangeHandlers: Set<Function>;

    _signalingController: DialogSignalingController;
    _streamController: DialogStreamController;

    _mediasoupImplementation: DialogMediasoupImplementation;

    _dialogConnectionParams: DialogConnectionParams;

    constructor() {
        dialogMsg(DialogLogLevel.Log, `DialogSession`, `Constructor called.`);

        this._stateChangeHandlers = new Set();

        this._signalingController = new DialogSignalingController();
        this._streamController = new DialogStreamController();

        this._state = DialogSessionStates.CLOSED;

        this._mediasoupImplementation = new DialogMediasoupImplementation(this);
    }

    getState() {
        return this._state;
    }

    public addStateChangeHandler(changeHandler: (newState: DialogSessionStates, event: any) => void) {
        try {
            this._stateChangeHandlers.add(changeHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSession.addStateChangeHandler()`, `Error adding a session state change handler: ${err.message}`);
            return false;
        }
    }
    public removeStateChangeHandler(changeHandler: (newState: DialogSessionStates, event: any) => void) {
        try {
            this._stateChangeHandlers.delete(changeHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSession.addStateChangeHandler()`, `Error removing a session state change handler: ${err.message}`);
            return false;
        }
    }
    private _handleStateChange(newState: DialogSessionStates, event?: any) {
        dialogMsg(DialogLogLevel.Log, `DialogSession._handleStateChange()`, `New state: \`${newState}\` Event data: ${safePrint(event)}`);
        this._state = newState;
        this._stateChangeHandlers.forEach((handler) => {
            if (handler) {
                handler(event);
            }
        });
    }

    public getStreamController() {
        return this._streamController;
    }

    public async openDialogSession({ dialogConnectionParams, dataFromReticulum }) {
        return new Promise((resolve, reject) => {
            this._dialogConnectionParams = dialogConnectionParams;

            const urlWithParams = new URL(`wss://${this._dialogConnectionParams.host}:${this._dialogConnectionParams.port}`);
            urlWithParams.searchParams.append("roomId", dataFromReticulum.reticulumHubID);
            urlWithParams.searchParams.append("peerId", dataFromReticulum.reticulumSessionID);

            this._signalingController.addStateChangeHandler(async (newState) => {
                if (newState === DialogSignalingStates.OPEN) {

                    dialogMsg(DialogLogLevel.Log, `DialogSession.openDialogSession()`, `Signaling connection state changed to \`${newState}\`! Joining Dialog Room...`);

                    try {
                        this._mediasoupDevice = new mediasoupClient.Device({});
                        const routerRtpCapabilities = await this._protooPeer.request("getRouterRtpCapabilities");
                        await this._mediasoupDevice.load({ routerRtpCapabilities });

                        const iceServers = this._getIceServers(this._dialogConnectionParams);

                        await this._createSendTransport(iceServers);
                        await this._createRecvTransport(iceServers);

                        await this._signalingController.request("join", {
                            displayName: this._signalingPeerID,
                            rtpCapabilities: this._mediasoupDevice.rtpCapabilities,
                            sctpCapabilities: undefined,
                            token: "jwt.verify commented out in dialog/Room.js - doesnt matter"
                        });

                        dialogMsg(DialogLogLevel.Log, `_joinDialogRoom()`, `Joined Dialog Room!`);
                        resolve("ok");
                    } catch (err) {
                        dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Error in \`_joinDialogRoom()\`:\n${err}`);
                        reject(err);
                    }
                }
            })

            this._signalingController.openDialogSignalingConnection(urlWithParams.toString());
        });
    }

    public closeDialogSession() {
        let dialogSession = this;

        // Start by closing out command controller
        // and the stream controller.
        this._streamController.stop();

        return new Promise((resolve, reject) => {
            dialogMsg(DialogLogLevel.Log, `DialogSession.closeDialogSession()`, `Closing Dialog session...`);

            // Add a state change handler that will resolve the
            // promise once the connection is closed
            const closingStateHandler = (newState, event) => {
                if (newState === DialogSessionStates.DISCONNECTED) {
                    dialogMsg(DialogLogLevel.Log, `DialogSession.closeDialogSession()`, `Dialog session state is now \`${newState}\`, still closing...`);
                } else if (newState === DialogSessionStates.CLOSED) {
                    dialogSession.removeStateChangeHandler(closingStateHandler);
                    resolve(newState);
                } else {
                    dialogSession.removeStateChangeHandler(closingStateHandler);
                    reject(newState);
                }
            };
            dialogSession.addStateChangeHandler(closingStateHandler);

            dialogSession._handleStateChange(DialogSessionStates.DISCONNECTED);

            // And finally, call the implementation's close method
            dialogSession._mediasoupImplementation.close();
        });
    }
}

class DialogMediasoupImplementation {
    _dialogSession: DialogSession;

    _signalingController: DialogSignalingController;

    _mediasoupDevice: mediasoupClient.Device | null;
    _mediasoupRoomID: string;

    _sendTransport: Transport | null;
    _recvTransport: Transport | null;

    _audioInputDeviceProducer: Producer | null;

    _consumers: Map<string, Consumer>;

    constructor(dialogSession: DialogSession) {
        dialogMsg(DialogLogLevel.Log, `DialogMediasoupImplementation`, `Constructor called.`);

        this._dialogSession = dialogSession;
    }

    public assignSignalingController(signalingController: DialogSignalingController) {
        this._signalingController = signalingController;
    }

    private _getIceServers({ host, port, turn }) {
        const iceServers: IceServers[] = [];

        if (turn && turn.enabled) {
            turn.transports.forEach(ts => {
                // Try both TURN DTLS and TCP/TLS
                if (!this._dialogSession._dialogConnectionParams.forceTcp) {
                    iceServers.push({
                        urls: `turns:${host}:${ts.port}`,
                        username: turn.username,
                        credential: turn.credential
                    });
                }

                iceServers.push({
                    urls: `turns:${host}:${ts.port}?transport=tcp`,
                    username: turn.username,
                    credential: turn.credential
                });
            });
            iceServers.push({ urls: "stun:stun1.l.google.com:19302" });
        } else {
            iceServers.push({ urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:stun2.l.google.com:19302" });
        }

        return iceServers;
    }

    public async open() {
        dialogMsg(DialogLogLevel.Log, `DialogMediasoupImplementation.open()`, `Attempting to open WebRTC connection...`);

        // TODO: Insert logic for what to do if we're already connecting or connected.

        if (!this._signalingController) {
            dialogMsg(DialogLogLevel.Error, `DialogMediasoupImplementation.open()`, `Failed to open WebRTC connection; \`_signalingController\` is falsey!`);
            return;
        }

        this._mediasoupDevice = new mediasoupClient.Device({});
        const routerRtpCapabilities = await this._signalingController.request("getRouterRtpCapabilities");
        await this._mediasoupDevice.load({ routerRtpCapabilities });

        const iceServers = this._getIceServers(this._dialogSession._dialogConnectionParams);

        await this._createSendTransport(iceServers);
        await this._createRecvTransport(iceServers);

        await this._protooPeer.request("join", {
            displayName: this._signalingPeerID,
            rtpCapabilities: this._mediasoupDevice.rtpCapabilities,
            sctpCapabilities: undefined,
            token: "jwt.verify commented out in dialog/Room.js - doesnt matter"
        });

        dialogMsg(DialogLogLevel.Log, `_joinDialogRoom()`, `Joined Dialog Room!`);
    }
}