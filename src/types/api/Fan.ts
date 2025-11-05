import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const FanSchema = z.object({
    ID: z.number(),
    Activation: z.boolean(),
    ActivationTimestamp: z.string().nullable(),
    FanOn: z.boolean(),
    FanSpeed: z.number(),
    FanMode: z.string(),
    DeviceID: z.number(),
});

export type Fan = z.infer<typeof FanSchema>;

export const FanResponseSchema = ApiResponseSchema(FanSchema);
export type FanResponse = z.infer<typeof FanResponseSchema>;

export const FansResponseSchema = ApiResponseSchema(z.array(FanSchema));
export type FansResponse = z.infer<typeof FansResponseSchema>;