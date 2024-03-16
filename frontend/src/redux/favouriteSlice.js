import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    favouriteItems: [],
    itemIds: [],
    count: 0,
}

const favouriteSlice = createSlice({
    name: 'favourite',
    initialState,
    reducers: {
        setFavourites : (state, action) => {
            const payload = action.payload;
            state.favouriteItems = payload.map((item) => item.product);
            state.count = payload.length;
            state.itemIds = payload.map((item) => item.product._id);
        },
        addToFavourite: (state, action) => {
            const payload = action.payload;
            const items = state.favouriteItems.filter((item) => item._id === payload._id);
            if (items.length === 0) {
                state.favouriteItems.push(payload);
                state.itemIds.push(payload._id)
                state.count++;
            }
        },
        removeFavourite: (state, action) => {
            const payload = action.payload;
            state.favouriteItems = state.favouriteItems.filter((item) => item._id !== payload._id);
            state.itemIds = state.itemIds.filter((item) => item !== payload._id);
            state.count--;
        },
    }
});

export const { setFavourites, addToFavourite, removeFavourite } = favouriteSlice.actions;

export default favouriteSlice.reducer;
