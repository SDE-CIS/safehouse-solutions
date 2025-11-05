import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const TemperatureSchema = z.object({
    ID: z.number(),
    Temperature: z.number(),
    TemperatureTimestamp: z.string(),
    DeviceID: z.number(),
});

export type Temperature = z.infer<typeof TemperatureSchema>;

export const TemperatureResponseSchema = ApiResponseSchema(TemperatureSchema);
export type TemperatureResponse = z.infer<typeof TemperatureResponseSchema>;

export const TemperaturesResponseSchema = ApiResponseSchema(z.array(TemperatureSchema));
export type TemperaturesResponse = z.infer<typeof TemperaturesResponseSchema>;