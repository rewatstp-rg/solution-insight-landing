/* eslint import/newline-after-import: "off" */
import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { BasePaginateResponse } from 'src/types/base-paginate';
import { FileRequest, FileResponse, FileResponseData } from 'src/types/file';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.common.root}`;

export const commonApi = createApi({
    reducerPath: 'commonApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        uploadImageFrame: builder.mutation<FileResponse, FormData>({
            query: (body) => ({
                url: `${endpoints.common.uploadImageFrame}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: FileResponseData) => data
        }),
        searchImageFrameByType: builder.mutation<BasePaginateResponse<FileResponse>, FileRequest>({
            query: (body) => ({
                url: `${endpoints.common.searchImageFrameByType}`,
                method: 'POST',
                body
            }),
        }),
    })
});

export const {
    useUploadImageFrameMutation,
    useSearchImageFrameByTypeMutation
} = commonApi;