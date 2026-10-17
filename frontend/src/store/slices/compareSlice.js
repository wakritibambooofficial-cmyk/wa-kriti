import { createSlice } from '@reduxjs/toolkit';

const MAX_COMPARE_ITEMS = 4;

const initialState = {
  items: [], // full product objects, capped at MAX_COMPARE_ITEMS
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.some((p) => p._id === action.payload._id);
      if (exists) return;
      if (state.items.length >= MAX_COMPARE_ITEMS) {
        state.items.shift();
      }
      state.items.push(action.payload);
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
export { MAX_COMPARE_ITEMS };
