import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const payload = action.payload;
            state.user = payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
    }
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
