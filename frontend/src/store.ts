import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { favoriteApi } from "./services/api/favorite.service";

const rootReducer = combineReducers({
  [favoriteApi.reducerPath]: favoriteApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat(favoriteApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
