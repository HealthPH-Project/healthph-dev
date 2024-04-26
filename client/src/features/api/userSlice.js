import { baseAPI } from "./_baseAPI";

export const userSlice = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    updatePersonalInfo: builder.mutation({
      query: (formData) => ({
        url: "/users/update-personal-information",
        method: "PUT",
        body: formData,
      }),
    }),
    updateEmail: builder.mutation({
      query: (formData) => ({
        url: "/users/update-email",
        method: "PUT",
        body: formData,
      }),
    }),
    updatePassword: builder.mutation({
      query: (formData) => ({
        url: "/users/update-password",
        method: "PUT",
        body: formData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        body: { user_id: id },
      }),
    }),
    fetchUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    createUser: builder.mutation({
      query: (formData) => ({
        url: `/users/`,
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["Users", "Admins"],
    }),
    deleteUsers: builder.mutation({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"]
    }),
    fetchAdmins: builder.query({
      query: () => "/users/admins",
      providesTags: ["Admins"],
    }),
    verifyUser: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/verify/${id}`,
        method: "PUT",
        body: { verify_status: status },
      }),
      invalidatesTags: ["Users", "Admins"],
    }),
    createAdmin: builder.mutation({
      query: (formData) => ({
        url: `/users/admins/`,
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/users/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    })
  }),
});

export const {
  useUpdatePersonalInfoMutation,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useDeleteUserMutation,
  useFetchUsersQuery,
  useCreateUserMutation,
  useFetchAdminsQuery,
  useDeleteUsersMutation,
  useVerifyUserMutation,
  useCreateAdminMutation,
  useDeleteAdminMutation
} = userSlice;
