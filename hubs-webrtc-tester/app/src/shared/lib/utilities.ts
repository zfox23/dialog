import { DialogLogLevel } from "./dialog-interfaces";

export const dialogMsg = (level: DialogLogLevel, context: string, message: string) => {
    switch (level) {
        case DialogLogLevel.Log:
            console.log(`${context}: ${message}`);
            return;
        case DialogLogLevel.Warn:
            console.warn(`${context}: ${message}`);
            return;
        case DialogLogLevel.Error:
            console.error(`${context}: ${message}`);
            return;
    }
}

export const safePrint(item: any) {
    try {
        return JSON.stringify(item);
    } catch (e) {
        return item;
    }
}

// Used to avoid SSR issues when building this app for production.
export const isBrowser = typeof window !== "undefined";
