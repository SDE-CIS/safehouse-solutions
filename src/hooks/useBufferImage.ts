import { useMemo } from "react";

export function useBufferImage(buffer?: { data?: number[] }, mimeType: string = "jpeg") {
    return useMemo(() => {
        if (!buffer?.data) return null;

        try {
            const base64 = btoa(
                new Uint8Array(buffer.data)
                    .reduce((data, byte) => data + String.fromCharCode(byte), "")
            );
            return `data:image/${mimeType};base64,${base64}`;
        } catch (err) {
            console.error("Failed to convert buffer to base64:", err);
            return null;
        }
    }, [buffer, mimeType]);
}
