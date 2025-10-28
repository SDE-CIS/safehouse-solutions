import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const UnitSchema = z.object({
    ID: z.number(),
    Active: z.boolean(),
    DateAdded: z.string(),
    SensorTypeID: z.number(),
    LocationID: z.number(),
    LocationName: z.string(),
    SensorTypeName: z.string(),
});

export type Unit = z.infer<typeof UnitSchema>;

export const UnitResponseSchema = ApiResponseSchema(UnitSchema);
export type UnitResponse = z.infer<typeof UnitResponseSchema>;

export const UnitsResponseSchema = ApiResponseSchema(z.array(UnitSchema));
export type UnitsResponse = z.infer<typeof UnitsResponseSchema>;
