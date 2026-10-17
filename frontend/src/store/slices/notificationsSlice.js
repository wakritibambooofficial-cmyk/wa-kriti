import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    markRead: (state, action) => {
      const notif = state.items.find((n) => n._id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead: (state) => {
      state.items.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n._id !== action.payload);
    },
  },
});

export const { setNotifications, addNotification, markRead, markAllRead, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
