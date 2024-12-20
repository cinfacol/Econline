import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  categoryTerm: "",
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.categoryTerm = "";
      state.searchTerm = action.payload;
    },
    setCategoryTerm: (state, action) => {
      state.searchTerm = "";
      state.categoryTerm = action.payload;
    },
  },
});

export const { setSearchTerm, setCategoryTerm } = inventorySlice.actions;
export default inventorySlice.reducer;
