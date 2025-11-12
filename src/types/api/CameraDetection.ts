import { z } from "zod";
import { ApiPagedResponseSchema } from "./ApiPagedResponse";

export const CameraDetectionSchema = z.object({
    ID: z.number(),
    CameraImage: z.string().nullable(),
    ImageTimestamp: z.string().nullable(),
    DeviceID: z.number().nullable(),
});

export type CameraDetection = z.infer<typeof CameraDetectionSchema>;

export const CameraDetectionsResponseSchema = ApiPagedResponseSchema(z.array(CameraDetectionSchema));
export type CameraDetectionsResponse = z.infer<typeof CameraDetectionsResponseSchema>;