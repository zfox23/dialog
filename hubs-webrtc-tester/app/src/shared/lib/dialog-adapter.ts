import * as mediasoupClient from "mediasoup-client";
import protooClient from "protoo-client";
import { DialogLogLevel, IceServers, DialogConnectionParams } from "./dialog-interfaces";
import { dialogMsg } from "./utilities";
import { DialogTransportController } from "./dialog-transport-controller";

const PROTOO_NUM_RETRIES = 2;

export class DialogAdapter {
    signalingState: 'new' | 'connecting' | 'connected' | 'failed' | 'disconnected' | 'closed';

    _mediasoupDevice: mediasoupClient.Device | null;
    _protooPeer: protooClient.Peer | null;

    _dialogConnectionParams: DialogConnectionParams;
    _signalingPeerID: string;

    _transportController: DialogTransportController;

    constructor() {
        this.signalingState = 'new';

        this._mediasoupDevice = null;
        this._protooPeer = null;

        this._transportController = new DialogTransportController();
    }

    private _setupSignalingEventHandlers() {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._setupSignalingEventHandlers()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        // This event doesn't fire when calling `this._protooPeer.close()`. Why not?
        // Missing this event will result in state-related bugs.
        this._protooPeer.on("close", () => {
            this.signalingState = 'closed';
            dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Received \`close\` event`);
            this._transportController.closeTransports();
        });

        this._protooPeer.on("disconnected", () => {
            this.signalingState = 'disconnected';
            dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`disconnected\` event`);
        });

        this._protooPeer.on("failed", attempt => {
            this.signalingState = 'failed';
            dialogMsg(DialogLogLevel.Error, `Protoo Signaling`, `Received \`failed\` event. Attempt #${attempt}/${PROTOO_NUM_RETRIES + 1}. `);
        });

        this._protooPeer.on("request", async (request, accept, reject) => {
            dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`request\` event.\nMethod: ${request.method}\nRequest ID: ${request.data?.id}`);

            switch (request.method) {
                case "newConsumer": {
                    this._transportController.handleNewConsumer(request, accept, reject);
                    break;
                }
            }
        })

        this._protooPeer.on("notification", notification => {
            switch (notification.method) {
                case "newPeer": {
                    const { peerId } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`newPeer\` notification. peerId: \`${peerId}\``);
                    break;
                }

                case "peerClosed": {
                    const { peerId } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`peerClosed\` notification. peerId: \`${peerId}\``);
                    // this.closePeer(peerId);
                    break;
                }

                case "peerBlocked": {
                    const { peerId } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`peerBlocked\` notification. peerId: \`${peerId}\``);
                    break;
                }

                case "peerUnblocked": {
                    const { peerId } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`peerUnblocked\` notification. peerId: \`${peerId}\``);
                    break;
                }

                case "downlinkBwe": {
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`downlinkBwe\` notification. downlinkBwe: \`${notification.data}\``);
                    break;
                }

                case "consumerClosed": {
                    const { consumerId } = notification.data;
                    this._transportController.handleConsumerClosed(consumerId);
                    break;
                }

                case "consumerLayersChanged": {
                    const { consumerId, spatialLayer, temporalLayer } = notification.data;
                    this._transportController.handleConsumerLayersChanged(consumerId, spatialLayer, temporalLayer);
                    break;
                }

                case "consumerScore": {
                    const { consumerId, score } = notification.data;
                    this._transportController.handleConsumerScore(consumerId, score);
                    break;
                }

                case "activeSpeaker":
                    // This notification happens regularly and doesn't need to be logged.
                    // dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`activeSpeaker\` event.\n${JSON.stringify(notification.data)}`);
                    break;

                default:
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`notification\` event.\nMethod: ${notification.method}\nData: ${JSON.stringify(notification.data)}`);
                    break;
            }
        });
    }

    private _getIceServers({ host, port, turn }) {
        const iceServers: IceServers[] = [];

        if (turn && turn.enabled) {
            turn.transports.forEach(ts => {
                // Try both TURN DTLS and TCP/TLS
                if (!this._dialogConnectionParams.forceTcp) {
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

    private async _joinDialogRoom() {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._joinDialogRoom()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        this._mediasoupDevice = new mediasoupClient.Device({});
        const routerRtpCapabilities = await this._protooPeer.request("getRouterRtpCapabilities");
        await this._mediasoupDevice.load({ routerRtpCapabilities });

        this._transportController.init(this._mediasoupDevice, this._protooPeer);

        const iceServers = this._getIceServers(this._dialogConnectionParams);
        await this._transportController.createTransports(iceServers, this._dialogConnectionParams.iceTransportPolicy);

        await this._protooPeer.request("join", {
            displayName: this._signalingPeerID,
            rtpCapabilities: this._mediasoupDevice.rtpCapabilities,
            sctpCapabilities: undefined,
            token: "jwt.verify commented out in dialog/Room.js - doesnt matter"
        });

        dialogMsg(DialogLogLevel.Log, `_joinDialogRoom()`, `Joined Dialog Room!`);
    }

    public async connectToDialog({ dialogConnectionParams, dataFromReticulum }) {
        return new Promise((resolve, reject) => {
            if (this.signalingState === "connecting" || this.signalingState === "connected" || this.signalingState === "failed") {
                // "failed" indicates that we're actively retrying. If we fail enough retries, we'll transition to "closed".
                return reject(`Not ready for new connection; signaling state is \`${this.signalingState}\``);
            }

            this.signalingState = "connecting";

            this._dialogConnectionParams = dialogConnectionParams;
            this._signalingPeerID = dataFromReticulum.reticulumSessionID;

            const urlWithParams = new URL(`wss://${this._dialogConnectionParams.host}:${this._dialogConnectionParams.port}`);
            urlWithParams.searchParams.append("roomId", dataFromReticulum.reticulumHubID);
            urlWithParams.searchParams.append("peerId", dataFromReticulum.reticulumSessionID);

            const protooTransport = new protooClient.WebSocketTransport(urlWithParams.toString(), {
                retry: { retries: PROTOO_NUM_RETRIES }
            });

            this._protooPeer = new protooClient.Peer(protooTransport);

            this._setupSignalingEventHandlers();

            this._protooPeer.on("open", async () => {
                this.signalingState = 'connected';
                dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`open\` event. Joining Dialog Room...`);

                try {
                    await this._joinDialogRoom();
                    resolve("ok");
                } catch (err) {
                    dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Error in \`_joinDialogRoom()\`:\n${err}`);
                    reject(err);
                }
            });
        });
    }

    public disconnectFromDialog() {
        if (this._protooPeer) {
            this._protooPeer.removeAllListeners();
            if (!this._protooPeer.closed) {
                dialogMsg(DialogLogLevel.Log, `disconnectFromDialog()`, `Closing Protoo signaling connection...`);
                this._protooPeer.close();
            }
        } else {
            dialogMsg(DialogLogLevel.Warn, `disconnectFromDialog()`, `Can't close signaling connection without a \`_protooPeer\`!`);
        }
    }

    public setInputAudioMediaStream(inputAudioMediaStream: MediaStream) {
        this._transportController.createAudioInputDeviceProducer(inputAudioMediaStream);
    }

    public getConsumerAudioTracks() {
        return this._transportController.getConsumerAudioTracks();
    }
}