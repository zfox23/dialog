export class DialogStreamController {
    _remoteAudioStream: MediaStream | null;
    _remoteVideoStream: MediaStream | null;
    _onVideoStreamStateChanged: Function;

    _onInputAudioChanged: Function;
    _onInputVideoChanged: Function;

    _videoContainer: HTMLVideoElement;
    _audioContainer: HTMLAudioElement;

    _inputAudioStream: MediaStream;
    _inputVideoStream: MediaStream;

    constructor() {
        this._remoteAudioStream = null;
        this._remoteVideoStream = null;

        this._onVideoStreamStateChanged = () => { }

        this._onInputAudioChanged = () => { };
        this._onInputVideoChanged = () => { };
    }

    public getRemoteVideoStream() {
        return this._remoteVideoStream;
    }

    private _setRemoteVideoStream(videoStream: MediaStream) {
        this._remoteVideoStream = videoStream;
        if (this._videoContainer) {
            this._videoContainer.srcObject = this._remoteVideoStream;
        }
    }

    public setVideoStateChangeHandler(newHandler: Function) {
        if (newHandler) {
            this._onVideoStreamStateChanged = newHandler;
        }
    }

    public setVideoContainer(videoElement: HTMLVideoElement, newHandler: Function) {
        this._videoContainer = videoElement;
        if (this._remoteVideoStream) {
            this._videoContainer.srcObject = this._remoteVideoStream;
        }
        this.setVideoStateChangeHandler(newHandler);
    }

    public getRemoteAudioStream() {
        return this._remoteAudioStream;
    }

    public setRemoteAudioContainer(audioElement: HTMLAudioElement) {
        this._audioContainer = audioElement;
        if (this._remoteAudioStream) {
            this._audioContainer.srcObject = this._remoteAudioStream;
        }
    }

    public setInputAudio(stream: MediaStream) {
        this._inputAudioStream = stream;
        if (this._onInputAudioChanged) {
            this._onInputAudioChanged(stream);
        }
    }

    public setInputAudioChangeHandler(newHandler: Function) {
        if (newHandler) {
            this._onInputAudioChanged = newHandler;
        }
    }

    public setInputVideo(stream: MediaStream) {
        this._inputVideoStream = stream;
        if (this._onInputVideoChanged) {
            this._onInputVideoChanged(stream);
        }
    }

    public setInputVideoChangeHandler(newHandler: Function) {
        if (newHandler) {
            this._onInputVideoChanged = newHandler;
        }
    }

    public stop() {
        if (this._videoContainer && this._videoContainer.srcObject) {
            let srcObject = this._videoContainer.srcObject as MediaStream;
            let tracks = srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this._videoContainer.srcObject = null;
            this._onVideoStreamStateChanged("over")
        }
        if (this._remoteAudioStream) {
            this._remoteAudioStream.getTracks().forEach(track => track.stop());
            this._remoteAudioStream = null;
        }
    }
}