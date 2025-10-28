import { z } from "zod";

export const UserSchema = z.object({
    ID: z.coerce.number().int(),
    FirstName: z.string(),
    LastName: z.string(),
    PhoneNumber: z.string().nullable(),
    Email: z.string().nullable(),
    Brugernavn: z.string(),
    Adgangskode: z.string(),
    RefreshToken: z.string().nullable(),
});

export const UserArraySchema = z.array(UserSchema);

export const UserResponseSchema = z
    .object({
        success: z.boolean().optional(),
        sucess: z.boolean().optional(),
        data: UserArraySchema,
    })
    .transform((obj) => ({
        success: obj.success ?? obj.sucess ?? false,
        data: obj.data,
    }));

export const UserResponseSuccessOnlySchema = UserResponseSchema.pipe(
    z.object({ success: z.literal(true), data: UserArraySchema })
);

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
