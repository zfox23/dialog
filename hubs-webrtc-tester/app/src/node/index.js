"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialog_adapter_1 = require("../shared/lib/dialog-adapter");
const connectToDialog = () => __awaiter(void 0, void 0, void 0, function* () {
    const dialogHost = `hubs.local`;
    const dialogPort = `4443`;
    const turnInfo = { enabled: false };
    const hubID = `xxxxx`;
    const sessionID = `anonymous`;
    const dialogAdapter = new dialog_adapter_1.DialogAdapter();
    const dialogConnectionParams = {
        host: dialogHost,
        port: parseInt(dialogPort),
        turn: turnInfo,
        forceTcp: false,
        iceTransportPolicy: "all",
    };
    const dataFromReticulum = {
        reticulumHubID: hubID,
        reticulumSessionID: sessionID
    };
    try {
        yield dialogAdapter.connectToDialog({
            dialogConnectionParams,
            dataFromReticulum
        });
    }
    catch (e) {
        console.warn(e);
    }
});
connectToDialog();
