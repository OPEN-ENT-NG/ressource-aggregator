import { emptySplitApi } from "./emptySplitApi.service";

export const signetsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisciplines: builder.query({
      query: () => "disciplines",
      providesTags: ["PinsChanged"],
    }),
  }),
});

export const { useGetDisciplinesQuery } = signetsApi;
