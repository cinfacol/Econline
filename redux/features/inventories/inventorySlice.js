import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  categorySlug: "",
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setcategorySlug: (state, action) => {
      state.categorySlug = action.payload;
    },
  },
});

export const { setSearchTerm, setcategorySlug } = inventorySlice.actions;
export default inventorySlice.reducer;
