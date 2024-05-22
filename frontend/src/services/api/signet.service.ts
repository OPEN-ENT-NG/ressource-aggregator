import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signetsApi = createApi({
  reducerPath: 'signets',
  baseQuery: fetchBaseQuery({ baseUrl: "/mediacentre/" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getPublishedSignets: builder.query({
      query: () => "signets",
    }),

  }),
});

const getAllSignets = () => {
  return []
}

export const { useGetPublishedSignetsQuery } = signetsApi;
