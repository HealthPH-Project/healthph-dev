import { baseAPI } from "./_baseAPI";

export const pointsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    fetchPoints: builder.query({
      query: () => "/points",
      providesTags: ["Points"],
    }),
    fetchPointsByDisease: builder.query({
      query: () => "/points/disease",
      providesTags: ["PointsDisease"],
    }),
    fetchPointsByDiseaseByUser: builder.query({
      query: () => "/points/disease/user",
      providesTags: ["PointsDisease"],
    }),
  }),
});

export const {
  useFetchPointsQuery,
  useFetchPointsByDiseaseQuery,
  useFetchPointsByDiseaseByUserQuery,
} = pointsApi;
