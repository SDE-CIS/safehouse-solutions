import { z } from "zod";
import { ApiResponseSchema } from "./ApiResponse";

export const VideoSchema = z.object({
    name: z.string(),
    url: z.string().url(),
});

export type Video = z.infer<typeof VideoSchema>;

export const VideoResponseSchema = ApiResponseSchema(VideoSchema);
export type VideoResponse = z.infer<typeof VideoResponseSchema>;

export const VideosResponseSchema = ApiResponseSchema(z.array(VideoSchema));
export type VideosResponse = z.infer<typeof VideosResponseSchema>;