import { baseAPI } from "./_baseAPI";

export const datasetsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "/datasets/upload",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Datasets"],
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
      invalidatesTags: ["Datasets"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useFetchDatasetsQuery,
  useDeleteDatasetMutation,
} = datasetsApi;
