import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '../app/store';
import { loggedIn, loggedOut, tokenReceived } from '@/services/login';
import { AuthResponse, Login, Product, Employee, User, Role, Keycard, KeycardTier, Package, ExtendedFetchBaseQueryError } from "@/types/api.ts";

const baseUrl = 'http://localhost:4000'

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).loginSlice.accessToken;
        if (accessToken) {
            headers.set('authorization', accessToken);
        }

        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    const error = result.error as ExtendedFetchBaseQueryError | undefined;

    if (error?.originalStatus === 401 || error?.status === 401) {
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
                        body: {
                            refreshToken: refreshToken,
                        },
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

// Define the API service
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signIn: builder.mutation<AuthResponse, Login>({
            query: (body) => ({
                url: 'auth',
                method: 'POST',
                body: body,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const data = (await queryFulfilled).data;
                dispatch(loggedIn(data));
            },
        }),
        refreshToken: builder.query<AuthResponse, void>({
            query: () => 'auth/refresh',
        }),
        product: builder.query<Product, number>({
            query: (id) => `products/${id}`,
        }),
        products: builder.query<Product[], void>({
            query: () => 'products',
        }),
        roles: builder.query<Role[], void>({
            query: () => 'roles',
        }),
        updateRole: builder.mutation<void, Role>({
            query: (body) => ({
                url: `roles/${body.Id}`,
                method: 'PUT',
                body,
            }),
        }),
        addRole: builder.mutation<void, Role>({
            query: (body) => ({
                url: 'roles',
                method: 'POST',
                body,
            }),
        }),
        deleteRole: builder.mutation<void, number>({
            query: (id) => ({
                url: `roles/${id}`,
                method: 'DELETE',
            }),
        }),
        users: builder.query<User[], void>({
            query: () => 'users'
        }),
        user: builder.query<User, number>({
            query: (id) => `users/${id}`
        }),
        getUsersByRoleId: builder.query<User[], number>({
            query: (id) => `users/roles/${id}`
        }),
        addUser: builder.mutation<void, User>({
            query: (body) => ({
                url: 'users',
                method: 'POST',
                body: body,
            }),
        }),
        addRoleToUser: builder.mutation<void, { userId: number, roleId: number }>({
            query: ({ userId, roleId }) => ({
                url: `users/${userId}/roles/${roleId}`,
                method: 'POST',
            }),
        }),
        removeRoleFromUser: builder.mutation<void, { userId: number, roleId: number }>({
            query: ({ userId, roleId }) => ({
                url: `users/${userId}/roles/${roleId}`,
                method: 'DELETE',
            }),
        }),
        editUser: builder.mutation<void, Partial<User> & { Id: number }>({
            query: ({ Id, ...body }) => ({
                url: `users/${Id}`,
                method: 'PUT',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            async onQueryStarted({ Id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('user', Id, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
        }),
        addProduct: builder.mutation<void, Product>({
            query: (body) => ({
                url: `products`,
                method: 'POST',
                body: body,
            }),
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(Id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('products', undefined, (draft) => {
                        const productIndex = draft.findIndex((p) => p.Id === Id);
                        if (productIndex !== -1) {
                            draft.splice(productIndex, 1); // Remove product from the list
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo(); // Undo optimistic update if query fails
                }
            }
        }),
        editProduct: builder.mutation<void, Partial<Product> & { Id: number }>({
            query: ({ Id, ...body }) => ({
                url: `products/${Id}`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ Id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('products', undefined, (draft) => {
                        const product = draft.find((p) => p.Id === Id);
                        if (product) {
                            Object.assign(product, patch); // Apply patch only if the product exists
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo(); // Undo optimistic update if query fails
                }
            }
        }),
        employees: builder.query<Employee[], void>({
            query: () => 'employees',
        }),
        keycards: builder.query<Keycard[], void>({
            query: () => 'keycard',
        }),
        keycard: builder.query<Keycard, number>({
            query: (id) => `keycard/${id}`,
        }),
        getKeycardTiers: builder.query<KeycardTier[], void>({
            query: () => 'keycard/tier',
        }),
        addKeycard: builder.mutation<void, Keycard>({
            query: (body) => ({
                url: 'keycard',
                method: 'POST',
                body,
            }),
        }),
        editKeycard: builder.mutation<void, Keycard>({
            query: (body) => ({
                url: `keycard/${body.KeycardId}`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ KeycardId, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    api.util.updateQueryData('keycard', KeycardId, (draft) => {
                        Object.assign(draft, patch)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        deleteKeycard: builder.mutation<void, number>({
            query: (id) => ({
                url: `keycard/${id}`,
                method: 'DELETE',
            }),
        }),
        packages: builder.query<Package[], void>({
            query: () => 'packages',
        }),
    }),
});

export const { useSignInMutation, useRefreshTokenQuery, useProductQuery, useProductsQuery, useAddProductMutation, useDeleteProductMutation, useEditProductMutation, useEmployeesQuery, useAddRoleMutation, useDeleteRoleMutation, useAddRoleToUserMutation, useRemoveRoleFromUserMutation, useUsersQuery, useUserQuery, useAddUserMutation, useDeleteUserMutation, useEditUserMutation, useGetUsersByRoleIdQuery, useRolesQuery, useKeycardsQuery, useKeycardQuery, useAddKeycardMutation, useEditKeycardMutation, useGetKeycardTiersQuery, usePackagesQuery } = api;
