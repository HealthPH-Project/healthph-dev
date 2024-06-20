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
    verifyCode: builder.mutation({
      query: (formData) => ({
        url: `/auth/verify-code`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
    resendCode: builder.mutation({
      query: (formData) => ({
        url: `/auth/resend-otp-code`,
        method: "POST",
        body: formData,
      }),
    }),
    registerUser: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
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
  useVerifyCodeMutation,
  useResendCodeMutation,
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useVerifyResetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
