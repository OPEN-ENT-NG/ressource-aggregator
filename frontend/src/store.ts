import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { favoriteApi } from "./services/api/favorite.service";
import { signetsApi } from "./services/api/signet.service";

const rootReducer = combineReducers({
  [favoriteApi.reducerPath]: favoriteApi.reducer,
  [signetsApi.reducerPath]: signetsApi.reducer,
});

const middlewares = [favoriteApi.middleware, signetsApi.middleware];

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
      getDefaultMiddleware().concat(...middlewares),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
