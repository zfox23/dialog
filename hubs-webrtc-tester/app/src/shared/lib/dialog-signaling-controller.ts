import protooClient from "protoo-client";
import { dialogMsg, safePrint } from "./utilities";
import { DialogLogLevel } from "./dialog-interfaces";

export enum DialogSignalingStates {
    CONNECTING = "connecting",
    OPEN = "open",
    ERROR = "error",
    CLOSING = "closing",
    CLOSED = "closed",
    UNAVAILABLE = "unavailable"
};

const PROTOO_NUM_RETRIES = 2;

export class DialogSignalingController {
    _protooImplementation: DialogProtooImplementation;

    _state: DialogSignalingStates;

    _stateChangeHandlers: Set<Function>;
    _requestHandlers: Set<Function>;
    _notificationHandlers: Set<Function>;

    constructor() {
        dialogMsg(DialogLogLevel.Log, `DialogSignalingController`, `Constructor called.`);

        this._protooImplementation = new DialogProtooImplementation(this);

        this._state = DialogSignalingStates.CLOSED;

        this._stateChangeHandlers = new Set();
        this._requestHandlers = new Set();
        this._notificationHandlers = new Set();
    }

    public getState() {
        return this._state;
    }

    public addStateChangeHandler(changeHandler: (newState: DialogSignalingStates, event: any) => void) {
        try {
            this._stateChangeHandlers.add(changeHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.addStateChangeHandler()`, `Error adding a signaling state change handler: ${err.message}`);
            return false;
        }
    }
    public removeStateChangeHandler(changeHandler: (newState: DialogSignalingStates, event: any) => void) {
        try {
            this._stateChangeHandlers.delete(changeHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.removeStateChangeHandler()`, `Error removing a signaling state change handler: ${err.message}`);
            return false;
        }
    }
    public handleSignalingStateChange(newState: DialogSignalingStates, event?: any) {
        dialogMsg(DialogLogLevel.Log, `DialogSignalingController.handleSignalingStateChange()`, `New state: \`${newState}\` Event data: ${safePrint(event)}`);
        this._state = newState;
        this._stateChangeHandlers.forEach((handler) => {
            if (handler) {
                handler(event);
            }
        });
    }

    public addRequestHandler(requestHandler: (request, accept, reject) => void) {
        try {
            this._requestHandlers.add(requestHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.addRequestHandler()`, `Error adding a request handler: ${err.message}`);
            return false;
        }
    }
    public removeRequestHandler(requestHandler: (request, accept, reject) => void) {
        try {
            this._requestHandlers.delete(requestHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.addRequestHandler()`, `Error removing a request handler: ${err.message}`);
            return false;
        }
    }
    public handleRequest(request, accept, reject) {
        dialogMsg(DialogLogLevel.Log, `DialogSignalingController.handleRequest()`, safePrint(request));

        this._requestHandlers.forEach((handler) => {
            if (handler) {
                handler(request, accept, reject);
            }
        });
    }
    public request(method, data?) {
        return this._protooImplementation.request(method, data);
    }

    public addNotificationHandler(notificationHandler: Function) {
        try {
            this._notificationHandlers.add(notificationHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.addNotificationHandler()`, `Error adding a notification handler: ${err.message}`);
            return false;
        }
    }
    public removeNotificationHandler(notificationHandler: Function) {
        try {
            this._notificationHandlers.delete(notificationHandler);
            return true;
        } catch (err) {
            dialogMsg(DialogLogLevel.Error, `DialogSignalingController.removeNotificationHandler()`, `Error removing a notification handler: ${err.message}`);
            return false;
        }
    }
    public handleNotification(notification) {
        dialogMsg(DialogLogLevel.Log, `DialogSignalingController.handleNotification()`, safePrint(notification));

        this._notificationHandlers.forEach((handler) => {
            if (handler) {
                handler(notification);
            }
        });
    }

    public async openDialogSignalingConnection(url: string) {
        let signalingConnection = this;

        return new Promise((resolve, reject) => {
            dialogMsg(DialogLogLevel.Log, `DialogSignalingController.openDialogSignalingConnection()`, `Opening signaling connection to \`${url}\`...`);

            const initialStateHandler = (newState, event) => {
                if (newState === DialogSignalingStates.CONNECTING) {
                    dialogMsg(DialogLogLevel.Log, `DialogSignalingController`, `Connecting...`);
                } else if (newState === DialogSignalingStates.OPEN) {
                    signalingConnection.removeStateChangeHandler(initialStateHandler);
                    resolve(newState);
                } else {
                    signalingConnection.removeStateChangeHandler(initialStateHandler);
                    reject(newState);
                }
            }
            signalingConnection.addStateChangeHandler(initialStateHandler);
            this.handleSignalingStateChange(DialogSignalingStates.CONNECTING);
            this._protooImplementation.open(url);
        });
    }

    public closeDialogSignalingConnection() {
        let signalingConnection = this;

        return new Promise((resolve, reject) => {
            dialogMsg(DialogLogLevel.Log, `DialogSignalingController.closeDialogSignalingConnection()`, `Closing signaling connection...`);

            const closingStateHandler = (newState, event) => {
                if (newState === DialogSignalingStates.CLOSING) {
                    dialogMsg(DialogLogLevel.Log, `DialogSignalingController`, `Closing...`);
                } else if (newState === DialogSignalingStates.CLOSED) {
                    signalingConnection.removeStateChangeHandler(closingStateHandler);
                    resolve(newState);
                } else {
                    signalingConnection.removeStateChangeHandler(closingStateHandler);
                    reject(newState);
                }
            }
            signalingConnection.addStateChangeHandler(closingStateHandler);
            this.handleSignalingStateChange(DialogSignalingStates.CLOSING);
            this._protooImplementation.close();
        });
    }
}

class DialogProtooImplementation {
    _dialogSignalingController: DialogSignalingController;
    _protooPeer: protooClient.Peer | null;

    constructor(dialogSignalingController: DialogSignalingController) {
        dialogMsg(DialogLogLevel.Log, `DialogProtooImplementation`, `Constructor called.`);
        this._dialogSignalingController = dialogSignalingController;
    }

    public open(url: string) {
        const protooTransport = new protooClient.WebSocketTransport(url, {
            retry: { retries: PROTOO_NUM_RETRIES }
        });
        this._protooPeer = new protooClient.Peer(protooTransport);

        let signalingController = this._dialogSignalingController;
        this._protooPeer.on('open', () => { signalingController.handleSignalingStateChange(DialogSignalingStates.OPEN); });
        this._protooPeer.on('error', () => { signalingController.handleSignalingStateChange(DialogSignalingStates.ERROR); });
        this._protooPeer.on('failed', (attempt: number) => { signalingController.handleSignalingStateChange(DialogSignalingStates.ERROR, attempt); });
        this._protooPeer.on('close', () => { signalingController.handleSignalingStateChange(DialogSignalingStates.CLOSED); });

        this._protooPeer.on('request', (request, accept, reject) => { signalingController.handleRequest(request, accept, reject); });
        this._protooPeer.on('notification', (notification) => { signalingController.handleNotification(notification); });
    }

    public async request(method, data?) {
        dialogMsg(DialogLogLevel.Log, `DialogProtooImplementation.request()`, `Sending request with method \`${method}\` and data:\n${safePrint(data)}`);

        if (!(this._protooPeer && this._protooPeer.connected && !this._protooPeer.closed)) {
            dialogMsg(DialogLogLevel.Error, `DialogProtooImplementation.request()`, `Tried to send request with method \`${method}\`, but \`_protooPeer\` wasn't ready! Request data:\n${safePrint(data)}`);
            return;
        }

        return this._protooPeer.request(method, data);
    }

    public close() {
        if (this._protooPeer) {
            this._protooPeer.close();
            this._protooPeer = null;
        }
    }
}
