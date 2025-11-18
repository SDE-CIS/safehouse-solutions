import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';
import { RootState } from '@/app/store';

const cookies = new Cookies();

export const setRawCookie = (name: string, value: string, options: any = {}) => {
    cookies.set(name, value, {
        encode: (v: string) => v,
        path: "/",
        ...options
    });
};

const decode = (value: string | undefined) =>
    value ? decodeURIComponent(value) : null;

const initialState: {
    username: string | null;
    avatar: string | null;
    accessToken: string | null;
    refreshToken: string | null;
} = {
    username: decode(cookies.get('username')),
    avatar: decode(cookies.get('avatar')),
    accessToken: decode(cookies.get('accessToken')),
    refreshToken: decode(cookies.get('refreshToken')),
};

export const loginSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        tokenReceived: (state, action) => {
            setRawCookie('accessToken', action.payload.accessToken);
            state.accessToken = action.payload.accessToken;
        },
        avatarReceived: (state, action) => {
            setRawCookie('avatar', action.payload.avatar);
            state.avatar = action.payload.avatar;
        },
        loggedIn: (state, action) => {
            setRawCookie('id', action.payload.user.id);
            setRawCookie('username', action.payload.user.username);
            setRawCookie('accessToken', action.payload.accessToken);
            setRawCookie('refreshToken', action.payload.refreshToken);

            if (action.payload.user.avatar) {
                setRawCookie('avatar', action.payload.user.avatar);
            }

            state.username = action.payload.user.username;
            state.avatar = action.payload.user.avatar;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        loggedOut: (state) => {
            const opts = { path: "/" };

            cookies.remove('id', opts);
            cookies.remove('username', opts);
            cookies.remove('avatar', opts);
            cookies.remove('accessToken', opts);
            cookies.remove('refreshToken', opts);

            state.username = null;
            state.avatar = null;
            state.accessToken = null;
            state.refreshToken = null;
        }
    },
});

export const selectUsername = (state: RootState) => state.loginSlice.username;
export const selectAvatar = (state: RootState) => state.loginSlice.avatar;
export const selectCurrentAccessToken = (state: RootState) => state.loginSlice.accessToken;

export const { tokenReceived, avatarReceived, loggedIn, loggedOut } = loginSlice.actions;

export default loginSlice.reducer;
