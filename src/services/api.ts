import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { RootState } from "../app/store";
import { avatarReceived, loggedIn, loggedOut, tokenReceived } from "@/services/login";
import { AuthResponse } from "@/types/api/AuthResponse";
import { Login } from "@/types/api/Login";
import {
    User,
    UserResponse,
    UserResponseSchema,
    UsersResponse,
    UsersResponseSchema,
} from "@/types/api/User";
import { Keycard, KeycardResponse, KeycardResponseSchema, KeycardsResponse, KeycardsResponseSchema } from "@/types/api/Keycard";
import { VideosResponse, VideosResponseSchema } from "@/types/api/Video";
import { FansResponse, FansResponseSchema } from "@/types/api/Fan";
import { TemperaturesResponse } from "@/types/api/Temperature";
import { FanActivity } from "@/types/api/FanActivity";
import { AccessLogsResponse, AccessLogsResponseSchema } from "@/types/api/AccessLog";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).loginSlice.accessToken;
        if (accessToken) headers.set("authorization", accessToken);
        return headers;
    },
    responseHandler: (response) => response.json(),
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    const error = result.error as FetchBaseQueryError | undefined;

    if (error?.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const state = api.getState() as RootState;
                const refreshToken = state.loginSlice.refreshToken;

                if (!refreshToken) {
                    api.dispatch(loggedOut());
                }

                const refreshResult = await baseQuery(
                    {
                        url: "/auth/refresh",
                        method: "POST",
                        body: { refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data) {
                    api.dispatch(tokenReceived(refreshResult.data));
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(loggedOut());
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        /* ─────────────── AUTH ─────────────── */
        signIn: builder.mutation<AuthResponse, Login>({
            query: (body) => ({ url: "auth", method: "POST", body }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(loggedIn(data));
                } catch {
                    /* silent */
                }
            },
        }),

        refreshToken: builder.query<AuthResponse, void>({
            query: () => "auth/refresh",
        }),

        /* ─────────────── USERS ─────────────── */
        users: builder.query<UsersResponse, void>({
            query: () => "users",
            transformResponse: (response: unknown) =>
                UsersResponseSchema.parse(response),
        }),

        user: builder.query<UserResponse, number>({
            query: (id) => `users/${id}`,
            transformResponse: (response: unknown) =>
                UserResponseSchema.parse(response),
        }),

        createUser: builder.mutation<UserResponse, Partial<User>>({
            query: (body) => ({
                url: "users",
                method: "POST",
                body,
            })
        }),

        updateUser: builder.mutation<UserResponse, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: data,
            })
        }),

        updateUserAvatar: builder.mutation<{ success: boolean; message: string, url: string }, { id: number; file?: File; url?: string }>({
            query: ({ id, file, url }) => {
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    return {
                        url: `users/avatar/${id}`,
                        method: "PUT",
                        body: formData,
                    };
                }

                return {
                    url: `users/avatar/${id}`,
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ProfilePicture: url }),
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data.url);
                    dispatch(avatarReceived({ avatar: data.url }));
                } catch {
                    /* silent */
                }
            },
        }),

        deleteUser: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
        }),

        /* ─────────────── KEYCARDS ─────────────── */
        keycards: builder.query<KeycardsResponse, void>({
            query: () => "keycards",
            transformResponse: (response: unknown) =>
                KeycardsResponseSchema.parse(response),
        }),

        keycard: builder.query<KeycardResponse, number>({
            query: (id) => `keycards/${id}`,
            transformResponse: (response: unknown) =>
                KeycardResponseSchema.parse(response),
        }),

        keycardLogs: builder.query<AccessLogsResponse, void>({
            query: () => "keycards/logs",
            transformResponse: (response: unknown) =>
                AccessLogsResponseSchema.parse(response),
        }),

        createKeycard: builder.mutation<KeycardResponse, Partial<Keycard>>({
            query: (body) => ({
                url: "keycards",
                method: "POST",
                body,
            })
        }),

        updateKeycard: builder.mutation<KeycardResponse, { id: number; data: Partial<Keycard> }>({
            query: ({ id, data }) => ({
                url: `keycards/${id}`,
                method: "PUT",
                body: data,
            })
        }),

        deleteKeycard: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `keycards/${id}`,
                method: "DELETE",
            }),
        }),

        /* ─────────────── VIDEOS ─────────────── */
        videos: builder.query<VideosResponse, void>({
            query: () => "videos",
            transformResponse: (response: unknown) =>
                VideosResponseSchema.parse(response),
        }),

        videoStream: builder.query<Blob, string>({
            query: (filename) => ({
                url: `videos/stream/${encodeURIComponent(filename)}`,
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return blob;
                },
            }),
        }),

        /* ─────────────── DASHBOARD ─────────────── */
        fans: builder.query<FansResponse, string>({
            query: (id) => `temperature/fan/device/${id}`,
            transformResponse: (response: unknown) =>
                FansResponseSchema.parse(response),
        }),

        temperatureLogs: builder.query<TemperaturesResponse, void>({
            query: () => "temperature",
        }),

        activateFan: builder.mutation<{ success: boolean }, FanActivity>({
            query: (activity) => ({
                url: `temperature/fan`,
                method: "POST",
                body: activity,
            }),
        }),
    }),
});

export const {
    useSignInMutation,
    useRefreshTokenQuery,
    useUsersQuery,
    useUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useUpdateUserAvatarMutation,
    useDeleteUserMutation,
    useKeycardsQuery,
    useKeycardQuery,
    useKeycardLogsQuery,
    useCreateKeycardMutation,
    useUpdateKeycardMutation,
    useDeleteKeycardMutation,
    useVideosQuery,
    useVideoStreamQuery,
    useFansQuery,
    useTemperatureLogsQuery,
    useActivateFanMutation,
} = api;
