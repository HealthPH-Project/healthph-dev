import { baseAPI } from "./_baseAPI";

export const pointsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    fetchPoints: builder.query({
      query: () => "/points",
      providesTags: ["Points"],
    }),
    fetchPointsByDisease: builder.query({
        query: () => "/points/disease",
        providesTags: ["PointsDisease"]
    })
  }),
});

export const { useFetchPointsQuery, useFetchPointsByDiseaseQuery } = pointsApi;
