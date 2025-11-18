import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const LocationSchema = z.object({
    ID: z.number(),
    LocationName: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

export const LocationResponseSchema = ApiResponseSchema(LocationSchema);
export type LocationResponse = z.infer<typeof LocationResponseSchema>;

export const LocationsResponseSchema = ApiResponseSchema(z.array(LocationSchema));
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;