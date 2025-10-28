import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const UserSchema = z.object({
    ID: z.number(),
    FirstName: z.string(),
    LastName: z.string(),
    PhoneNumber: z.string().nullable().optional(),
    Email: z.string().nullable().optional(),
    Brugernavn: z.string(),
    Adgangskode: z.string(),
    RefreshToken: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserResponseSchema = ApiResponseSchema(UserSchema);
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const UsersResponseSchema = ApiResponseSchema(z.array(UserSchema));
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
