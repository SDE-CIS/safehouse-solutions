// src/services/api.ts
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '../app/store';
import { loggedIn, loggedOut, tokenReceived } from '@/services/login';
import { AuthResponse } from "@/types/api/AuthResponse";
import { Login } from '@/types/api/Login';
import { UnitResponse, UnitResponseSchema } from '@/types/api/Unit';

const baseUrl = 'http://localhost:4000';

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).loginSlice.accessToken;
        if (accessToken) headers.set('authorization', accessToken);
        return headers;
    },
    responseHandler: (response) => response.json(),
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
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
                        url: '/auth/refresh',
                        method: 'POST',
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
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signIn: builder.mutation<AuthResponse, Login>({
            query: (body) => ({ url: 'auth', method: 'POST', body }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(loggedIn(data));
                } catch {
                }
            },
        }),
        refreshToken: builder.query<AuthResponse, void>({
            query: () => 'auth/refresh',
        }),

        units: builder.query<UnitResponse, void>({
            query: () => 'units',
            transformResponse: (response: unknown) => {
                return UnitResponseSchema.parse(response);
            },
        }),
    }),
});

export const { useSignInMutation, useRefreshTokenQuery, useUnitsQuery } = api;
