import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.products.find(
        (p) => p.variantId === item.variantId
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.products.push(item);
      }

      state.count = state.products.length;
    },

    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (p) => p.variantId !== action.payload
      );

      state.count = state.products.length;
    },

    // ✅ ADD THIS (important for checkout)
    clearCart: (state) => {
      state.products = [];
      state.count = 0;
    },

    // ✅ OPTIONAL (better UX)
    updateQuantity: (state, action) => {
      const { variantId, quantity } = action.payload;

      const item = state.products.find(
        (p) => p.variantId === variantId
      );

      if (item) {
        item.quantity = quantity;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;