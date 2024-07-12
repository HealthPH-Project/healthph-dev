import { baseAPI } from "./_baseAPI";

export const activityLogApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    sendContactUs: builder.mutation({
      query: (data) => ({
        url: "/contact-us",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendContactUsMutation } = activityLogApi;
