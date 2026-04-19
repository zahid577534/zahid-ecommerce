'use client';

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

// ✅ Use this for client-only storage
import storage from "redux-persist/lib/storage"; 

import authReducer from "./reducer/authReducer";

// Combine reducers
const rootReducer = combineReducers({
  authStore: authReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage, // ✅ only works in browser
  version: 1,
  whitelist: ["authStore"], // only persist authStore
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);