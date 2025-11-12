import { BufferData } from "@/types/BufferData";
import { useMemo } from "react";

export function useBufferImage(buffer: BufferData, mimeType: string = "jpeg"): string | null {
    return useMemo(() => {
        if (!buffer) return null;

        if (typeof buffer === "string") {
            if (buffer.startsWith("data:image") || buffer.startsWith("http")) {
                return buffer;
            }
            return `data:image/${mimeType};base64,${buffer}`;
        }

        if (!buffer.data) {
            return null;
        }

        try {
            const base64 = btoa(
                new Uint8Array(buffer.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                )
            );
            return `data:image/${mimeType};base64,${base64}`;
        } catch (err) {
            console.error("Failed to convert buffer to base64:", err);
            return null;
        }
    }, [buffer, mimeType]);
}
