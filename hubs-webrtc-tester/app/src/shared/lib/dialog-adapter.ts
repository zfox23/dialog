import * as mediasoupClient from "mediasoup-client";
import { ConnectionState, Consumer, Producer, Transport, TransportOptions } from "mediasoup-client/lib/types";
import protooClient from "protoo-client";
import { DialogLogLevel, IceServers, DialogConnectionParams } from "./dialog-interfaces";
import { dialogMsg } from "./utilities";

const PROTOO_NUM_RETRIES = 2;

export class DialogAdapter {
    _mediasoupDevice: mediasoupClient.Device | null;
    _protooPeer: protooClient.Peer | null;

    _dialogConnectionParams: DialogConnectionParams;
    _dialogRoomID: string;
    _signalingPeerID: string;

    _sendTransport: Transport | null;
    _recvTransport: Transport | null;

    _audioInputDeviceProducer: Producer | null;

    _consumers: Map<string, Consumer>;

    constructor() {
        this._mediasoupDevice = null;
        this._protooPeer = null;

        this._sendTransport = null;
        this._recvTransport = null;

        this._audioInputDeviceProducer = null;

        this._consumers = new Map();
    }

    private _cleanUpLocalState() {
        dialogMsg(DialogLogLevel.Log, `_cleanUpLocalState()`, `Cleaning up local state...`);
        this._sendTransport && this._sendTransport.close();
        this._sendTransport = null;
        this._recvTransport && this._recvTransport.close();
        this._recvTransport = null;
        this._audioInputDeviceProducer = null;
        // this._shareProducer = null;
        // this._cameraProducer = null;

        this._protooPeer = null;
        this._mediasoupDevice = null;
    }

    private _removeConsumer(consumerId) {
        dialogMsg(DialogLogLevel.Log, `recvTransport Consumer`, `Removing consumer with ID: \`${consumerId}\``);
        this._consumers.delete(consumerId);
    }

    private _setupProtooPeerEventHandlers() {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._setupProtooPeerEventHandlers()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        this._protooPeer.on("disconnected", () => {
            dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`disconnected\` event`);
            this._cleanUpLocalState();
        });

        this._protooPeer.on("failed", attempt => {
            dialogMsg(DialogLogLevel.Error, `Protoo Signaling`, `Received \`failed\` event. Attempt #${attempt}/${PROTOO_NUM_RETRIES + 1}. `);
        });

        this._protooPeer.on("close", async () => {
            dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Received \`close\` event`);
        });

        this._protooPeer.on("request", async (request, accept, reject) => {
            dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`request\` event.\nMethod: ${request.method}\nRequest ID: ${request.data?.id}`);

            switch (request.method) {
                case "newConsumer": {
                    if (!this._recvTransport) {
                        dialogMsg(DialogLogLevel.Error, `Protoo Signaling: 'newConsumer'`, `\`this._recvTransport\` is falsey!`);
                        return;
                    }

                    const { peerId, producerId, id, kind, rtpParameters, appData } = request.data;

                    try {
                        const consumer = await this._recvTransport.consume({
                            id,
                            producerId,
                            kind,
                            rtpParameters,
                            appData: { ...appData, peerId }
                        });

                        // Store in the map.
                        this._consumers.set(consumer.id, consumer);

                        consumer.on("transportclose", () => {
                            dialogMsg(DialogLogLevel.Error, `recvTransport Consumer`, `Received \`transportclose\` event. Consumer ID: \`${consumer.id}\``);
                            this._removeConsumer(consumer.id);
                        });

                        // if (kind === "video") {
                        //     const { spatialLayers, temporalLayers } = mediasoupClient.parseScalabilityMode(
                        //         consumer.rtpParameters.encodings[0].scalabilityMode
                        //     );
                        // }

                        accept();
                    } catch (err) {
                        // this.emitRTCEvent("error", "Adapter", () => `Error: ${err}`);
                        reject();
                        throw err;
                    }

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

                case "consumerClosed": {
                    const { consumerId } = notification.data;
                    const consumer = this._consumers.get(consumerId);

                    if (!consumer) {
                        dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Received \`consumerClosed\` notification without related consumer. ID: \`${consumerId}\``);
                        break;
                    }

                    consumer.close();
                    this._removeConsumer(consumer.id);

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

                case "consumerLayersChanged": {
                    const { consumerId, spatialLayer, temporalLayer } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`consumerLayersChanged\` notification. consumerId: \`${consumerId}\` spatialLayer: \`${spatialLayer}\` temporalLayer: \`${temporalLayer}\``);

                    const consumer = this._consumers.get(consumerId);

                    if (!consumer) {
                        dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Received \`consumerLayersChanged\` notification without related consumerId: \`${consumerId}\``);
                        break;
                    }
                    break;
                }

                case "consumerScore": {
                    const { consumerId, score } = notification.data;
                    dialogMsg(DialogLogLevel.Log, `Protoo Signaling`, `Received \`consumerLayersChanged\` notification. consumerId: \`${consumerId}\` score: \`${JSON.stringify(score)}\``);

                    const consumer = this._consumers.get(consumerId);

                    if (!consumer) {
                        dialogMsg(DialogLogLevel.Warn, `Protoo Signaling`, `Received \`consumerScore\` notification without related consumerId: \`${consumerId}\``);
                        break;
                    }
                }

                case "activeSpeaker":
                    //  This notification happens regularly and doesn't need to be logged.
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

    private _setupSendTransportEventHandlers() {
        if (!this._sendTransport) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._setupSendTransportEventHandlers()`, `\`this._sendTransport\` is falsey!`);
            return;
        }

        this._sendTransport.observer.on("close", () => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._sendTransport`, `Received \`close\` event`);
        });
        this._sendTransport.observer.on("newproducer", producer => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._sendTransport`, `Received \`newproducer\` event. new producer id: \`${producer.id}\``);
        });
        this._sendTransport.observer.on("newconsumer", consumer => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._sendTransport`, `Received \`newconsumer\` event. new consumer id: \`${consumer.id}\``);
        });

        this._sendTransport.on("connect",
            (
                { dtlsParameters },
                callback,
                errback
            ) => {
                dialogMsg(DialogLogLevel.Log, `DialogAdapter._sendTransport`, `Received \`connect\` event`);

                if (!this._sendTransport) {
                    dialogMsg(DialogLogLevel.Error, `DialogAdapter._sendTransport, after \`connect\` event`, `\`this._sendTransport\` is falsey!`);
                    return;
                }

                if (!this._protooPeer) {
                    dialogMsg(DialogLogLevel.Error, `DialogAdapter._sendTransport, after \`connect\` event`, `\`this._protooPeer\` is falsey!`);
                    return;
                }

                this._protooPeer
                    .request("connectWebRtcTransport", {
                        transportId: this._sendTransport.id,
                        dtlsParameters
                    })
                    .then(callback)
                    .catch(errback);
            }
        );

        this._sendTransport.on("connectionstatechange", (connectionState: ConnectionState) => {
            let level = DialogLogLevel.Log;
            if (connectionState === "failed" || connectionState === "disconnected") {
                level = DialogLogLevel.Warn;
            }
            dialogMsg(level, `DialogAdapter._sendTransport`, `Received \`connectionstatechange\` event. New connectionState: \`${connectionState}\``);
        });

        this._sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._sendTransport`, `Received \`produce\` event. kind: \`${kind}\``);

            if (!this._sendTransport) {
                const err = { name: `DialogAdapter._sendTransport`, message: `\`this._sendTransport\` is falsey!` };
                dialogMsg(DialogLogLevel.Error, `DialogAdapter._sendTransport, in \`produce\` event handler`, err.message);
                errback(err);
                return;
            }

            if (!this._protooPeer) {
                const err = { name: `DialogAdapter._sendTransport`, message: `\`this._protooPeer\` is falsey!` };
                dialogMsg(DialogLogLevel.Error, `DialogAdapter._sendTransport, in \`produce\` event handler`, err.message);
                errback(err);
                return;
            }

            try {
                const { id } = await this._protooPeer.request("produce", {
                    transportId: this._sendTransport.id,
                    kind,
                    rtpParameters,
                    appData
                });

                callback({ id });
            } catch (error) {
                dialogMsg(DialogLogLevel.Error, `DialogAdapter._sendTransport`, `When sending "produce" request to Protoo, got error:\n${error}`);
                errback(error);
            }
        });
    }

    private async _createSendTransport(iceServers) {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._createSendTransport()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        if (!this._mediasoupDevice) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._createSendTransport()`, `\`this._mediasoupDevice\` is falsey!`);
            return;
        }

        const sendTransportInfo = await this._protooPeer.request("createWebRtcTransport", {
            producing: true,
            consuming: false,
            sctpCapabilities: undefined
        });

        const transportOptions: TransportOptions = {
            id: sendTransportInfo.id,
            iceParameters: sendTransportInfo.iceParameters,
            iceCandidates: sendTransportInfo.iceCandidates,
            dtlsParameters: sendTransportInfo.dtlsParameters,
            sctpParameters: sendTransportInfo.sctpParameters,
            iceServers,
            iceTransportPolicy: this._dialogConnectionParams.iceTransportPolicy
        };

        this._sendTransport = this._mediasoupDevice.createSendTransport(transportOptions);

        this._setupSendTransportEventHandlers();
    }

    private _setupRecvTransportEventHandlers() {
        if (!this._recvTransport) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._setupRecvTransportEventHandlers()`, `\`this._recvTransport\` is falsey!`);
            return;
        }

        this._recvTransport.observer.on("close", () => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._recvTransport`, `Received \`close\` event`);
        });
        this._recvTransport.observer.on("newproducer", producer => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._recvTransport`, `Received \`newproducer\` event. New producer id: \`${producer.id}\``);
        });
        this._recvTransport.observer.on("newconsumer", consumer => {
            dialogMsg(DialogLogLevel.Log, `DialogAdapter._recvTransport`, `Received \`newconsumer\` event. New consumer id: \`${consumer.id}\``);
        });

        this._recvTransport.on(
            "connect",
            (
                { dtlsParameters },
                callback,
                errback
            ) => {
                dialogMsg(DialogLogLevel.Log, `DialogAdapter._recvTransport`, `Received \`connect\` event`);

                if (!this._recvTransport) {
                    dialogMsg(DialogLogLevel.Error, `DialogAdapter._recvTransport, during \`connect\` event handler`, `\`this._recvTransport\` is falsey!`);
                    return;
                }

                if (!this._protooPeer) {
                    dialogMsg(DialogLogLevel.Error, `DialogAdapter._recvTransport, during \`connect\` event handler`, `\`this._protooPeer\` is falsey!`);
                    return;
                }

                this._protooPeer.request("connectWebRtcTransport", {
                    transportId: this._recvTransport.id,
                    dtlsParameters
                })
                    .then(callback)
                    .catch(errback);
            }
        );
    }

    private async _createRecvTransport(iceServers) {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._createRecvTransport()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        if (!this._mediasoupDevice) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._createRecvTransport()`, `\`this._mediasoupDevice\` is falsey!`);
            return;
        }

        const recvTransportInfo = await this._protooPeer.request("createWebRtcTransport", {
            producing: false,
            consuming: true,
            sctpCapabilities: undefined
        });

        this._recvTransport = this._mediasoupDevice.createRecvTransport({
            id: recvTransportInfo.id,
            iceParameters: recvTransportInfo.iceParameters,
            iceCandidates: recvTransportInfo.iceCandidates,
            dtlsParameters: recvTransportInfo.dtlsParameters,
            sctpParameters: recvTransportInfo.sctpParameters,
            iceServers,
            iceTransportPolicy: this._dialogConnectionParams.iceTransportPolicy
        });

        this._setupRecvTransportEventHandlers();
    }

    private async _joinDialogRoom() {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogAdapter._joinDialogRoom()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        this._mediasoupDevice = new mediasoupClient.Device({});
        const routerRtpCapabilities = await this._protooPeer.request("getRouterRtpCapabilities");
        await this._mediasoupDevice.load({ routerRtpCapabilities });

        const iceServers = this._getIceServers(this._dialogConnectionParams);

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






    public createAudioInputDeviceProducer(stream: MediaStream) {
        if (!this._sendTransport) {
            dialogMsg(DialogLogLevel.Error, `createAudioInputDeviceProducer()`, `\`_sendTransport\` is falsey!`);
            return;
        }

        let sawAudio = false;

        stream.getTracks().map(async (track) => {
            if (!this._sendTransport) {
                dialogMsg(DialogLogLevel.Error, `createAudioInputDeviceProducer()`, `During \`stream\` track processing, \`_sendTransport\` is falsey!`);
                return;
            }

            if (track && track.kind === "audio") {
                sawAudio = true;

                if (this._audioInputDeviceProducer) {
                    if (this._audioInputDeviceProducer.track && this._audioInputDeviceProducer.track !== track) {
                        this._audioInputDeviceProducer.track.stop();
                        this._audioInputDeviceProducer.replaceTrack({ track });
                    }
                } else {
                    // stopTracks = false because otherwise the track will end during a temporary disconnect
                    this._audioInputDeviceProducer = await this._sendTransport.produce({
                        track,
                        // pause: !this._micShouldBeEnabled,
                        stopTracks: false,
                        codecOptions: { opusStereo: false, opusDtx: true },
                        zeroRtpOnPause: true,
                        disableTrackOnPause: true
                    });

                    this._audioInputDeviceProducer.on("transportclose", () => {
                        dialogMsg(DialogLogLevel.Log, `_audioInputDeviceProducer`, `Received \`transportclose\`.`);
                        this._audioInputDeviceProducer = null;
                    });
                }
            }
        })

        if (!sawAudio && this._audioInputDeviceProducer) {
            this._protooPeer.request("closeProducer", { producerId: this._audioInputDeviceProducer.id });
            this._audioInputDeviceProducer.close();
            this._audioInputDeviceProducer = null;
        }
    }

    public async connectToDialog({ dialogConnectionParams, dataFromReticulum }) {
        this._dialogConnectionParams = dialogConnectionParams;
        this._dialogRoomID = dataFromReticulum.reticulumHubID;
        this._signalingPeerID = dataFromReticulum.reticulumSessionID;

        const urlWithParams = new URL(`wss://${this._dialogConnectionParams.host}:${this._dialogConnectionParams.port}`);
        urlWithParams.searchParams.append("roomId", this._dialogRoomID);
        urlWithParams.searchParams.append("peerId", this._signalingPeerID);

        const protooTransport = new protooClient.WebSocketTransport(urlWithParams.toString(), {
            retry: { retries: PROTOO_NUM_RETRIES }
        });

        this._protooPeer = new protooClient.Peer(protooTransport);

        this._setupProtooPeerEventHandlers();

        return new Promise((resolve, reject) => {
            this._protooPeer.on("open", async () => {
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
        this._cleanUpLocalState();

        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Warn, `disconnectFromDialog()`, `Can't close signaling connection without a \`_protooPeer\`!`);
            return;
        }

        this._protooPeer.removeAllListeners();
        if (this._protooPeer.connected) {
            dialogMsg(DialogLogLevel.Log, `disconnectFromDialog()`, `Closing Protoo signaling connection...`);
            this._protooPeer.close();
        }
    }

    public getConsumerAudioTracks() {
        dialogMsg(DialogLogLevel.Log, `getConsumerAudioTracks()`, `There are ${this._consumers.size} consumers.`);

        let audioTracks: { consumerId: string, track: MediaStreamTrack }[] = [];

        this._consumers.forEach((consumer) => {
            if (consumer.track && consumer.track.kind === "audio") {
                audioTracks.push({
                    consumerId: consumer.id,
                    track: consumer.track
                });
            }
        });

        return audioTracks;
    }
}