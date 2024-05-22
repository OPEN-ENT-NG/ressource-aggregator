import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signetsApi = createApi({
  reducerPath: 'signets',
  baseQuery: fetchBaseQuery({ baseUrl: "/mediacentre/" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getSignets: builder.query({
      query: () => "signets",
    }),
  }),
});

export const { useGetSignetsQuery } = signetsApi;
