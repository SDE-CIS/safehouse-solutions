import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const KeycardSchema = z.object({
    ID: z.number(),
    Name: z.string(),
    RfidTag: z.string(),
});

export type Keycard = z.infer<typeof KeycardSchema>;

export const KeycardResponseSchema = ApiResponseSchema(KeycardSchema);
export type KeycardResponse = z.infer<typeof KeycardResponseSchema>;

export const KeycardsResponseSchema = ApiResponseSchema(z.array(KeycardSchema));
export type KeycardsResponse = z.infer<typeof KeycardsResponseSchema>;
