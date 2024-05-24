import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const favoriteApi = createApi({
  reducerPath: "favorite",
  baseQuery: fetchBaseQuery({ baseUrl: "/mediacentre/" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getFavorite: builder.query({
      query: () => "favorites",
    }),
  }),
});

export const { useGetFavoriteQuery } = favoriteApi;
