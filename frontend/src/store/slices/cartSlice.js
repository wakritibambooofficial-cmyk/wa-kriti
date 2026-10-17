import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { productId, variantId, name, image, price, mrp, quantity, sku, slug }
  isDrawerOpen: false,
};

const findIndex = (items, productId, variantId) =>
  items.findIndex((i) => i.productId === productId && i.variantId === variantId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      const item = action.payload;
      const idx = findIndex(state.items, item.productId, item.variantId);
      if (idx > -1) {
        state.items[idx].quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    updateQuantity: (state, action) => {
      const { productId, variantId, quantity } = action.payload;
      const idx = findIndex(state.items, productId, variantId);
      if (idx > -1) {
        if (quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter((i) => !(i.productId === productId && i.variantId === variantId));
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCartDrawer: (state, action) => {
      state.isDrawerOpen = action.payload ?? !state.isDrawerOpen;
    },
  },
});

export const { setCart, addItem, updateQuantity, removeItem, clearCart, toggleCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
