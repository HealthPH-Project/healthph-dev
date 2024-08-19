import { baseAPI } from "./_baseAPI";

export const datasetsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/datasets/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        "Datasets",
        "AnalyticsSuspected",
        "AnalyticsFrequent",
        "AnalyticsPercentage",
        "AnalyticsWordcloud",
      ],
    }),
    fetchDatasets: builder.query({
      query: () => "/datasets",
      providesTags: ["Datasets"],
    }),
    deleteDataset: builder.mutation({
      query: (id) => ({
        url: `/datasets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "Datasets",
        "Points",
        "PointsDisease",
        "AnalyticsSuspected",
        "AnalyticsFrequent",
        "AnalyticsPercentage",
        "AnalyticsWordcloud",
      ],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useFetchDatasetsQuery,
  useDeleteDatasetMutation,
} = datasetsApi;
