import { baseAPI } from "./_baseAPI";

export const activityLogApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    generateFrequentWords: builder.query({
      query: (filters) => {
        return {
          url: "/frequent-words",
          params: { filters: filters },
        };
      },
      providesTags: ["AnalyticsFrequent"],
    }),
    generatePercentage: builder.query({
      query: (filters) => {
        return {
          url: "/percentage",
          params: { filters: filters },
        };
      },
      providesTags: ["AnalyticsPercentage"],
    }),
    generateWordCloud: builder.query({
      query: (filters) => {
        return {
          url: "/wordcloud",
          params: { filters: filters },
        };
      },
      providesTags: ["AnalyticsPercentage"],
    }),
  }),
});

export const {
  useGenerateFrequentWordsQuery,
  useGeneratePercentageQuery,
  useGenerateWordCloudQuery,
} = activityLogApi;
