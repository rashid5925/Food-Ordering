import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    total: 0,
    amount: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            const payload = action.payload;
            state.cartItems = payload;
            let amount = 0;
            payload.forEach((item) => amount += item.amount);
            state.amount = amount;
        },
        addToCart: (state, action) => {
            const payload = action.payload.product;
            const amount = action.payload.amount?action.payload.amount:1
            const items = state.cartItems.filter((item) => item.product._id === payload._id);
            if (items.length === 0) {
                state.cartItems.push({
                    product: payload,
                    amount: amount,
                });
            } else {
                const cartItem = state.cartItems.find((item) => item.product._id === payload._id);
                cartItem.amount += amount;
            }
            state.amount += amount;
        },
        removeItem: (state, action) => {
            const payload = action.payload;
            const cartItem = state.cartItems.find((item) => item.product._id === payload);
            state.cartItems = state.cartItems.filter((item) => item.product._id !== payload);
            state.amount -= cartItem.amount;
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.product._id === payload);
            state.amount++;
            cartItem.amount++;
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => item.product._id === payload);
            state.amount--;
            cartItem.amount--;
        },
        calculateTotal: (state) => {
            let total = 0;
            state.cartItems.forEach((item) => total += item.product.price * item.amount);
            state.total = total;
        }
    }
});

export const { setCart, addToCart, removeItem, increase, decrease, calculateTotal } = cartSlice.actions;

export default cartSlice.reducer;
