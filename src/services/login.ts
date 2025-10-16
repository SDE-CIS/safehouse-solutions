import {createSlice} from '@reduxjs/toolkit';
import {Cookies} from 'react-cookie';
import {RootState} from '@/app/store';

const cookies = new Cookies();
const initialState: { username: string | null, profilePicture: string | null, accessToken: string | null, refreshToken: string | null } = {
    username: cookies.get('username') || null,
    profilePicture: cookies.get('profilePicture') || null,
    accessToken: cookies.get('accessToken') || null,
    refreshToken: cookies.get('refreshToken') || null,
};

export const loginSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        tokenReceived: (state, action) => {
            cookies.set('accessToken', action.payload.accessToken);
            state.accessToken = action.payload.accessToken;
        },
        loggedIn: (state, action) => {
            cookies.set('username', action.payload.user.username);
            cookies.set('profilePicture', action.payload.user.profilePicture);
            cookies.set('accessToken', action.payload.accessToken);
            cookies.set('refreshToken', action.payload.refreshToken);
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        loggedOut: (state) => {
            cookies.remove('username')
            cookies.remove('profilePicture');
            cookies.remove('accessToken');
            cookies.remove('refreshToken');
            state.username = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const selectUsername = (state: RootState) => state.loginSlice.username
export const selectCurrentAccessToken = (state: RootState) => state.loginSlice.accessToken

export const { tokenReceived, loggedIn, loggedOut } = loginSlice.actions;

export default loginSlice.reducer;
