import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  data: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.data = action.payload;
    },
    closeModal: (state, action) => {
      state.isOpen = false;
      state.data = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
