import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const LockSchema = z.object({
    ID: z.number(),
    Active: z.boolean(),
    DateAdded: z.string().nullable(),
    LocationID: z.number(),
    UserID: z.number(),
    Locked: z.boolean(),
});

export type Lock = z.infer<typeof LockSchema>;

export const LockResponseSchema = ApiResponseSchema(LockSchema);
export type LockResponse = z.infer<typeof LockResponseSchema>;

export const LocksResponseSchema = ApiResponseSchema(z.array(LockSchema));
export type LocksResponse = z.infer<typeof LocksResponseSchema>;