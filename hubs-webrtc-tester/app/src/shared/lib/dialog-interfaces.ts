export interface TurnInfo {
    enabled: boolean;
    username?: string;
    credential?: string;
    transports?: any;
}

export interface DialogConnectionParams {
    host: string;
    port: number;
    turn: TurnInfo;
    forceTcp: boolean;
    iceTransportPolicy: RTCIceTransportPolicy;
}

export interface DataFromReticulum {
    reticulumHubID: string;
    reticulumSessionID: string;
}

export interface IceServers {
    urls: string;
    username?: string;
    credential?: string;
}

export interface LocalMediaStreamData {
    consumerId: string;
    track: MediaStreamTrack;
    mediaStream?: MediaStream;
}

export enum DialogLogLevel {
    Log = "log",
    Warn = "warn",
    Error = "error"
}