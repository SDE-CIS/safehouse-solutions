import { z } from "zod";

export type ApiResponse<T> = {
    success: boolean;
    data: T;
};

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: dataSchema,
    });
