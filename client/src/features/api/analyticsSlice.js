import { baseAPI } from "./_baseAPI";

export const activityLogApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    generateSuspectedSymptoms: builder.query({
      query: () => {
        return {
          url: "/suspected-symptom"
        };
      },
      providesTags: ["AnalyticsSuspected"],
    }),
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
      providesTags: ["AnalyticsWordcloud"],
    }),
  }),
});

export const {
  useGenerateSuspectedSymptomsQuery,
  useGenerateFrequentWordsQuery,
  useGeneratePercentageQuery,
  useGenerateWordCloudQuery,
} = activityLogApi;
