import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const FanSchema = z.object({
    ID: z.number(),
    Active: z.boolean(),
    DateAdded: z.string().nullable(),
    LocationID: z.number().nullable(),
    UserID: z.number(),
    fanMode: z.string().nullable(),
});

export type Fan = z.infer<typeof FanSchema>;

export const FanResponseSchema = ApiResponseSchema(FanSchema);
export type FanResponse = z.infer<typeof FanResponseSchema>;

export const FansResponseSchema = ApiResponseSchema(z.array(FanSchema));
export type FansResponse = z.infer<typeof FansResponseSchema>;