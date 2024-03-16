import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import favouriteReducer from './favouriteSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        favourite: favouriteReducer,
        user: userReducer,
    },
});
