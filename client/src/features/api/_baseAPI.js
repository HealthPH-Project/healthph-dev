import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_API_URL;

export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = Cookies.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Object",
    "Objects",
    "Auth",
    "Users",
    "User",
    "Admins",
    "Admin",
    "ActivityLogs",
    "ActivityLog",
    "AnalyticsFrequent",
    "AnalyticsPercentage",
    "AnalyticsWordcloud",
    "Datasets",
    "Datasets",
    "Points",
    "PointsDisease"
  ],
  endpoints: () => ({}),
});
