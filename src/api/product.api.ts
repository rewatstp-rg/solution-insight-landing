import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { BasePaginateResponse } from 'src/types/base-paginate';
import { ProductModel, ProductSearchModel } from 'src/types/product.type';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.product.root}`;

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        saveProduct: builder.mutation<any, FormData>({
            query: (body) => ({
                url: `${endpoints.product.saveProduct}`,
                method: 'POST',
                body
            }),
        }),
        searchProduct: builder.mutation<BasePaginateResponse<ProductModel>, ProductSearchModel>({
            query: (body) => ({
                url: `${endpoints.product.searchProduct}`,
                method: 'POST',
                body
            }),
        }),
        getProduct: builder.mutation<any, FormData>({
            query: (body) => ({
                url: `${endpoints.product.getProduct}`,
                method: 'POST',
                body
            }),
        }),
        deleteProduct: builder.mutation<any, FormData>({
            query: (body) => ({
                url: `${endpoints.product.deleteProduct}`,
                method: 'POST',
                body
            }),
        })
    })
});

export const {
    useSaveProductMutation,
    useSearchProductMutation
} = productApi;