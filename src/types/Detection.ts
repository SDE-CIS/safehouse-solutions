export interface Detection {
    ID: number;
    ImageTimestamp?: string | null;
    CameraImage?:
    | { type?: string; data?: number[] }
    | string
    | null;
}
