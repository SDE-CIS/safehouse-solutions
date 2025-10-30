import { z } from "zod";

export const AuthResponseSchema = z.object({
    success: z.boolean(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    user: z.object({
        id: z.string(),
        username: z.string(),
        firstname: z.string().optional(),
        lastname: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        pfp: z.object({
            type: z.string(),
            data: z.array(z.number()),
        }).optional(),
    })
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
