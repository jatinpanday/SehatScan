import { configureStore } from "@reduxjs/toolkit";
import { queryClient } from "@/api/queryClient";
import { authReducer, logout } from "@/store/authSlice";
import { languageReducer } from "@/store/languageSlice";
import { themeReducer } from "@/store/themeSlice";
import { userReducer, setUser } from "@/store/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    language: languageReducer,
    theme: themeReducer,
  },
});

window.addEventListener("auth:logout", () => {
  queryClient.clear();
  store.dispatch(logout());
  store.dispatch(setUser(null));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
