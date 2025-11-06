import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const AccessLogSchema = z.object({
    ID: z.number(),
    AccessTime: z.string(),
    RfidTag: z.string(),
    LocationID: z.number(),
    Granted: z.boolean(),
});

export type AccessLog = z.infer<typeof AccessLogSchema>;

export const AccessLogResponseSchema = ApiResponseSchema(AccessLogSchema);
export type AccessLogResponse = z.infer<typeof AccessLogResponseSchema>;

export const AccessLogsResponseSchema = ApiResponseSchema(z.array(AccessLogSchema));
export type AccessLogsResponse = z.infer<typeof AccessLogsResponseSchema>;