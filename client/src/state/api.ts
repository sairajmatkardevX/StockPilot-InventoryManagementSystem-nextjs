
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    prepareHeaders: async (headers) => {
      const session = await getSession();
      const token = session?.user?.accessToken; // ✅ use accessToken from NextAuth
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users", "Products", "Dashboard", "Expenses"],
  endpoints: (builder) => ({
    /* ------------------ USERS ------------------ */
    getUsers: builder.query<
  { userId: number; name: string; email?: string; role: "ADMIN" | "USER" }[],
  void
>({
  query: () => "/users",
  providesTags: ["Users"],
}),

    createUser: builder.mutation<
      { userId: number; name: string; email: string; role: "ADMIN" | "USER" },
      { name: string; email: string; password: string; role: "ADMIN" | "USER" }
    >({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      { userId: number; name: string; email: string; role: "ADMIN" | "USER" },
      { id: number; name?: string; email?: string; password?: string; role?: "ADMIN" | "USER" }
    >({
      query: ({ id, ...body }) => ({ url: `/users/${id}`, method: "PUT", body }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    /* ------------------ PRODUCTS ------------------ */
    getProducts: builder.query<
      {
        products: {
          id: string;
          name: string;
          price: number;
          rating?: number;
          stockQuantity: number;
          sales?: any[];
          purchases?: any[];
        }[];
        pagination: { page: number; limit: number; totalCount: number; totalPages: number };
      },
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Products"],
    }),
    getProduct: builder.query<
      {
        id: string;
        name: string;
        price: number;
        rating?: number;
        stockQuantity: number;
        sales?: any[];
        purchases?: any[];
      },
      string
    >({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation<
      { id: string; name: string; price: number; rating?: number; stockQuantity: number },
      { name: string; price: number; rating?: number; stockQuantity: number }
    >({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      { id: string; name: string; price: number; rating?: number; stockQuantity: number },
      { id: string; name?: string; price?: number; rating?: number; stockQuantity?: number }
    >({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: "PUT", body }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),
    getProductStats: builder.query<
      {
        _count: { id: number };
        _avg: { price: number | null; rating: number | null };
        _sum: { stockQuantity: number | null };
        _min: { price: number | null; stockQuantity: number | null };
        _max: { price: number | null; stockQuantity: number | null };
      },
      void
    >({
      query: () => "/products/stats/all",
    }),

    /* ------------------ DASHBOARD ------------------ */
    getDashboardMetrics: builder.query<
      {
        popularProducts: any[];
        salesSummary: any[];
        purchaseSummary: any[];
        expenseSummary: any[];
        expenseByCategorySummary: any[];
      },
      void
    >({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),

    /* ------------------ EXPENSES ------------------ */
    getExpensesByCategory: builder.query<
      {
        id: string;
        expenseSummaryId: string;
        category: string;
        amount: string;
        date: string;
      }[],
      void
    >({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductStatsQuery,
  useGetDashboardMetricsQuery,
  useGetExpensesByCategoryQuery,
} = api;
