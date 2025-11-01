import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: true, // 🔥 Bật Redux DevTools
});

export default store;
