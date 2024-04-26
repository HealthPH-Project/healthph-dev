import { baseAPI } from "./_baseAPI";

export const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    authenticate: builder.mutation({
      query: (loginData) => ({
        url: `/auth/authenticate`,
        method: "POST",
        body: loginData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Auth"],
    }),
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ['Users']
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    verifyResetPassword: builder.mutation({
      query: (token) => ({
        url: "/auth/verify-reset-password",
        method: "POST",
        body: { token },
      }),
    }),
    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useVerifyResetPasswordMutation,
  useResetPasswordMutation
} = authApi;
