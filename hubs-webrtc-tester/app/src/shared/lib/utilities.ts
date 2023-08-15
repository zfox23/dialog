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

// Used to avoid SSR issues when building this app for production.
export const isBrowser = typeof window !== "undefined";

export const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
}

export const linearScale = (factor: number, minInput: number, maxInput: number, minOutput: number, maxOutput: number, shouldClamp = true) => {
    if (shouldClamp) {
        factor = clamp(factor, minInput, maxInput);
    }

    return minOutput + (maxOutput - minOutput) *
        (factor - minInput) / (maxInput - minInput);
}