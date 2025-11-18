import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const DeviceSchema = z.object({
    ID: z.number().or(z.string()),
    Active: z.boolean(),
    LocationID: z.number().nullable(),
    UserID: z.number().nullable(),
    DateAdded: z.string(),
    DeviceType: z.string(),
});

export type Device = z.infer<typeof DeviceSchema>;

export const DeviceResponseSchema = ApiResponseSchema(DeviceSchema);
export type DeviceResponse = z.infer<typeof DeviceResponseSchema>;

export const DevicesResponseSchema = ApiResponseSchema(z.array(DeviceSchema));
export type DevicesResponse = z.infer<typeof DevicesResponseSchema>;
