import { z } from "zod";

export const ApiPagedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        pagination: z.object({
            currentPage: z.number(),
            totalPages: z.number(),
            totalItems: z.number(),
            limit: z.number(),
            hasNextPage: z.boolean(),
            hasPreviousPage: z.boolean(),
        }),
        data: dataSchema,
    });

export type ApiPagedResponse<T> = {
    success: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }
    data: T;
};
