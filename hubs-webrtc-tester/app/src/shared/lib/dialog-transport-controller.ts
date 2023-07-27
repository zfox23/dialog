import * as mediasoupClient from "mediasoup-client";
import protooClient from "protoo-client";
import { ConnectionState, Producer, Transport, TransportOptions, Consumer } from "mediasoup-client/lib/types";
import { dialogMsg } from "./utilities";
import { DialogLogLevel } from "./dialog-interfaces";

export class DialogTransportController {
    _mediasoupDevice: mediasoupClient.Device | null;
    _protooPeer: protooClient.Peer | null;

    _sendTransport: Transport | null;
    _recvTransport: Transport | null;

    _audioInputDeviceProducer: Producer | null;

    _consumers: Map<string, Consumer>;

    constructor() {
        this._sendTransport = null;
        this._recvTransport = null;

        this._audioInputDeviceProducer = null;

        this._consumers = new Map();
    }

    public init(mediasoupDevice, protooPeer) {
        this._mediasoupDevice = mediasoupDevice;
        this._protooPeer = protooPeer;
    }

    public async createTransports(iceServers, iceTransportPolicy) {
        await this._createSendTransport(iceServers, iceTransportPolicy);
        await this._createRecvTransport(iceServers, iceTransportPolicy);
    }

    public closeTransports() {
        this._sendTransport && this._sendTransport.close();
        this._recvTransport && this._recvTransport.close();
    }

    private _removeConsumer(consumerId) {
        dialogMsg(DialogLogLevel.Log, `recvTransport Consumer`, `Removing consumer with ID: \`${consumerId}\``);
        this._consumers.delete(consumerId);
    }

    private _setupSendTransportEventHandlers() {
        if (!this._sendTransport) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._setupSendTransportEventHandlers()`, `\`this._sendTransport\` is falsey!`);
            return;
        }

        this._sendTransport.observer.on("close", () => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._sendTransport`, `Received \`close\` event`);

            if (!this._sendTransport) {
                return;
            }
            this._sendTransport = null;
        });
        this._sendTransport.observer.on("newproducer", producer => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._sendTransport`, `Received \`newproducer\` event. new producer id: \`${producer.id}\``);
        });
        this._sendTransport.observer.on("newconsumer", consumer => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._sendTransport`, `Received \`newconsumer\` event. new consumer id: \`${consumer.id}\``);
        });

        this._sendTransport.on("connect",
            (
                { dtlsParameters },
                callback,
                errback
            ) => {
                dialogMsg(DialogLogLevel.Log, `DialogTransportController._sendTransport`, `Received \`connect\` event`);

                if (!this._sendTransport) {
                    dialogMsg(DialogLogLevel.Error, `DialogTransportController._sendTransport, after \`connect\` event`, `\`this._sendTransport\` is falsey!`);
                    return;
                }

                if (!this._protooPeer) {
                    dialogMsg(DialogLogLevel.Error, `DialogTransportController._sendTransport, after \`connect\` event`, `\`this._protooPeer\` is falsey!`);
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
            dialogMsg(level, `DialogTransportController._sendTransport`, `Received \`connectionstatechange\` event. New connectionState: \`${connectionState}\``);
        });

        this._sendTransport.on("produce", async ({ kind, rtpParameters, appData }, callback, errback) => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._sendTransport`, `Received \`produce\` event. kind: \`${kind}\``);

            if (!this._sendTransport) {
                const err = { name: `DialogTransportController._sendTransport`, message: `\`this._sendTransport\` is falsey!` };
                dialogMsg(DialogLogLevel.Error, `DialogTransportController._sendTransport, in \`produce\` event handler`, err.message);
                errback(err);
                return;
            }

            if (!this._protooPeer) {
                const err = { name: `DialogTransportController._sendTransport`, message: `\`this._protooPeer\` is falsey!` };
                dialogMsg(DialogLogLevel.Error, `DialogTransportController._sendTransport, in \`produce\` event handler`, err.message);
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
                dialogMsg(DialogLogLevel.Error, `DialogTransportController._sendTransport`, `When sending "produce" request to Protoo, got error:\n${error}`);
                errback(error);
            }
        });
    }

    private async _createSendTransport(iceServers, iceTransportPolicy) {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._createSendTransport()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        if (!this._mediasoupDevice) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._createSendTransport()`, `\`this._mediasoupDevice\` is falsey!`);
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
            iceTransportPolicy
        };

        this._sendTransport = this._mediasoupDevice.createSendTransport(transportOptions);

        this._setupSendTransportEventHandlers();
    }

    private _setupRecvTransportEventHandlers() {
        if (!this._recvTransport) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._setupRecvTransportEventHandlers()`, `\`this._recvTransport\` is falsey!`);
            return;
        }

        this._recvTransport.observer.on("close", () => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._recvTransport`, `Received \`close\` event`);

            if (!this._recvTransport) {
                return;
            }

            this._recvTransport = null;
        });
        this._recvTransport.observer.on("newproducer", producer => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._recvTransport`, `Received \`newproducer\` event. New producer id: \`${producer.id}\``);
        });
        this._recvTransport.observer.on("newconsumer", consumer => {
            dialogMsg(DialogLogLevel.Log, `DialogTransportController._recvTransport`, `Received \`newconsumer\` event. New consumer id: \`${consumer.id}\``);
        });

        this._recvTransport.on(
            "connect",
            (
                { dtlsParameters },
                callback,
                errback
            ) => {
                dialogMsg(DialogLogLevel.Log, `DialogTransportController._recvTransport`, `Received \`connect\` event`);

                if (!this._recvTransport) {
                    dialogMsg(DialogLogLevel.Error, `DialogTransportController._recvTransport, during \`connect\` event handler`, `\`this._recvTransport\` is falsey!`);
                    return;
                }

                if (!this._protooPeer) {
                    dialogMsg(DialogLogLevel.Error, `DialogTransportController._recvTransport, during \`connect\` event handler`, `\`this._protooPeer\` is falsey!`);
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

    private async _createRecvTransport(iceServers, iceTransportPolicy) {
        if (!this._protooPeer) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._createRecvTransport()`, `\`this._protooPeer\` is falsey!`);
            return;
        }

        if (!this._mediasoupDevice) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController._createRecvTransport()`, `\`this._mediasoupDevice\` is falsey!`);
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
            iceTransportPolicy
        });

        this._setupRecvTransportEventHandlers();
    }

    public createAudioInputDeviceProducer(stream: MediaStream) {
        if (!this._sendTransport) {
            dialogMsg(DialogLogLevel.Error, `DialogTransportController.createAudioInputDeviceProducer()`, `\`_sendTransport\` is falsey!`);
            return;
        }

        let sawAudio = false;

        stream.getTracks().map(async (track) => {
            if (!this._sendTransport) {
                dialogMsg(DialogLogLevel.Error, `DialogTransportController.createAudioInputDeviceProducer()`, `During \`stream\` track processing, \`_sendTransport\` is falsey!`);
                return;
            }

            if (track && track.kind === "audio") {
                sawAudio = true;

                if (this._audioInputDeviceProducer) {
                    dialogMsg(DialogLogLevel.Log, `DialogTransportController.createAudioInputDeviceProducer()`, `Producer already exists; replacing its track with the new track.`);
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

                        if (!this._audioInputDeviceProducer) {
                            return;
                        }

                        this._audioInputDeviceProducer = null;
                    });
                }
            }
        })

        if (!sawAudio && this._audioInputDeviceProducer) {
            this._protooPeer?.request("closeProducer", { producerId: this._audioInputDeviceProducer.id });
            this._audioInputDeviceProducer.close();
            this._audioInputDeviceProducer = null;
        }
    }

    public async handleNewConsumer(request, accept, reject) {
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
    }

    public async handleConsumerClosed(consumerId) {
        const consumer = this._consumers.get(consumerId);

        if (!consumer) {
            dialogMsg(DialogLogLevel.Warn, `DialogTransportController.handleConsumerClosed()`, `Received \`consumerClosed\` notification without related consumer. ID: \`${consumerId}\``);
            return
        }

        consumer.close();
        this._removeConsumer(consumer.id);
    }

    public handleConsumerLayersChanged(consumerId, spatialLayer, temporalLayer) {
        dialogMsg(DialogLogLevel.Log, `DialogTransportController.handleConsumerLayersChanged()`, `consumerId: \`${consumerId}\` spatialLayer: \`${spatialLayer}\` temporalLayer: \`${temporalLayer}\``);

        const consumer = this._consumers.get(consumerId);

        if (!consumer) {
            dialogMsg(DialogLogLevel.Warn, `DialogTransportController.handleConsumerLayersChanged()`, `Received \`consumerLayersChanged\` notification without related consumerId: \`${consumerId}\``);
            return;
        }
    }

    public handleConsumerScore(consumerId, score) {
        dialogMsg(DialogLogLevel.Log, `DialogTransportController.handleConsumerScore`, `consumerId: \`${consumerId}\` score: \`${JSON.stringify(score)}\``);

        const consumer = this._consumers.get(consumerId);

        if (!consumer) {
            dialogMsg(DialogLogLevel.Warn, `DialogTransportController.handleConsumerScore()`, `Received \`consumerScore\` notification without related consumerId: \`${consumerId}\``);
            return;
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