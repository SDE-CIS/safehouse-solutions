import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { RootState } from "../app/store";
import { loggedIn, loggedOut, tokenReceived } from "@/services/login";
import { AuthResponse } from "@/types/api/AuthResponse";
import { Login } from "@/types/api/Login";
import { UnitsResponse, UnitsResponseSchema } from "@/types/api/Unit";
import {
    User,
    UserResponse,
    UserResponseSchema,
    UsersResponse,
    UsersResponseSchema,
} from "@/types/api/User";

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

        /* ─────────────── UNITS ─────────────── */
        units: builder.query<UnitsResponse, void>({
            query: () => "units",
            transformResponse: (response: unknown) =>
                UnitsResponseSchema.parse(response),
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

        deleteUser: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useSignInMutation,
    useRefreshTokenQuery,
    useUnitsQuery,
    useUsersQuery,
    useUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = api;
