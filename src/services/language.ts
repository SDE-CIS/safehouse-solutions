import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const initialState: { language: string } = {
    language: cookies.get("language") || "dk",
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        languageChanged: (state, action) => {
            cookies.set("language", action.payload)
            state.language = action.payload;
        },
    },
});

export const selectCurrentLanguage = (state: RootState) => state.languageSlice.language

export const { languageChanged } = languageSlice.actions;

export default languageSlice.reducer;
