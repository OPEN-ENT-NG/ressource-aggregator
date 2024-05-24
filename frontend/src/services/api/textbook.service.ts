import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const textbooksApi = createApi({
  reducerPath: "textbooks",
  baseQuery: fetchBaseQuery({ baseUrl: "/mediacentre/" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getTextbooks: builder.query({
      query: () => "textbooks",
    }),
  }),
});

export const { useGetTextbooksQuery } = textbooksApi;
