import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const KeycardSchema = z.object({
    ID: z.string(),
    RfidTag: z.string(),
    IssueDate: z.string(),
    ExpirationDate: z.string().nullable(),
    UserID: z.number().nullable(),
    StatusTypeID: z.number().nullable(),
    Name: z.string().nullable(),
    StatusName: z.string().nullable(),
    StatusDescription: z.string().nullable(),
});

export type Keycard = z.infer<typeof KeycardSchema>;

export const KeycardResponseSchema = ApiResponseSchema(KeycardSchema);
export type KeycardResponse = z.infer<typeof KeycardResponseSchema>;

export const KeycardsResponseSchema = ApiResponseSchema(z.array(KeycardSchema));
export type KeycardsResponse = z.infer<typeof KeycardsResponseSchema>;
