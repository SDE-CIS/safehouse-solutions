import { z } from "zod";

export const UnitSchema = z.object({
    ID: z.coerce.number().int(),
    Active: z.coerce.boolean(),
    DateAdded: z.string().datetime().or(z.string()),
    SensorTypeID: z.coerce.number().int(),
    LocationID: z.coerce.number().int(),
    LocationName: z.string(),
    SensorTypeName: z.string(),
});

export const UnitArraySchema = z.array(UnitSchema);

export const UnitResponseSchema = z
    .object({
        success: z.boolean().optional(),
        sucess: z.boolean().optional(),
        data: UnitArraySchema,
    })
    .transform((obj) => ({
        success: obj.success ?? obj.sucess ?? false,
        data: obj.data,
    }));

export const UnitResponseSuccessOnlySchema = UnitResponseSchema.pipe(
    z.object({ success: z.literal(true), data: UnitArraySchema })
);

export type Unit = z.infer<typeof UnitSchema>;
export type UnitResponse = z.infer<typeof UnitResponseSchema>;
