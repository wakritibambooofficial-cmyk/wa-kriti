import { createSlice } from '@reduxjs/toolkit';

const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const initialState = {
  mode: 'system', // 'light' | 'dark' | 'system'
  resolved: getSystemPreference(), // the actual applied theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      state.resolved = action.payload === 'system' ? getSystemPreference() : action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
