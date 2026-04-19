'client side' //
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  products:[]
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
            addIntoCart : (state, action) => {
                const payload = action.payload
                const existingProduct = state.products.find
            }
    },
  },
});

export const {  } = authReducer.actions;
export default authReducer.reducer;