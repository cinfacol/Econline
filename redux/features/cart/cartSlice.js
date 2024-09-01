import { createSlice } from "@reduxjs/toolkit";

//Create Initial State
const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartItemQty: 0,
};

//Create the slice with Reducers
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementQty: (state, action) => {
      const cartId = action.payload;
      const cartItem = state.find((item) => item.id === cartId);
      if (cartItem) {
        cartItem.cartItemQty += 1;
      }
    },
    /* decrementQty: (state, action) => {
      const cartId = action.payload;
      const cartItem = state.find((item) => item.id === cartId);
      if (cartItem && cartItem.cartItemQty > 1) {
        cartItem.cartItemQty -= 1;
      }
    }, */
    decrementQty(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;

        toast.info("Decreased product quantity", {
          position: "bottom-left",
        });
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );

        state.cartItems = nextCartItems;

        toast.error("Product removed from cart", {
          position: "bottom-left",
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});

//export the reducers(actions)
export const { incrementQty, decrementQty } = cartSlice.actions;
export default cartSlice.reducer;
