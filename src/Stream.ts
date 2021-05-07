import type { EventEmitter } from "events";

export class Stream {
    public static async create<T extends EventEmitter>(create: () => T): Promise<T> {
        const result = create();
        let onOpen: () => void;
        let onError: (reason?: unknown) => void;

        try {
            await new Promise<void>((resolve, reject) => {
                onOpen = resolve;
                onError = reject;
                result.on("open", onOpen).on("error", onError);
            });

            return result;
        } finally {
            result.removeListener("open", onOpen!);
            result.removeListener("error", onError!);
        }
    }
}
