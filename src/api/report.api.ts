/* eslint import/newline-after-import: "off" */
import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { ReportRequest, ReportResponse } from 'src/types/report.type';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.report.root}`;

export const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        summaryOrderDetailCheckrace: builder.mutation<ReportResponse, ReportRequest>({
            query: (body) => ({
                url: `${endpoints.report.summaryOrderDetailCheckrace}`,
                method: 'POST',
                body
            }),
        }),
        importBib: builder.mutation<any, FormData>({
            query: (body) => ({
                url: `${endpoints.report.importBib}`,
                method: 'POST',
                body
            }),
        }),
        importTracking: builder.mutation<any, FormData>({
            query: (body) => ({
                url: `${endpoints.report.importTracking}`,
                method: 'POST',
                body
            }),
        }),
        summaryOrderVrCheckrace: builder.mutation<ReportResponse, ReportRequest>({
            query: (body) => ({
                url: `${endpoints.report.summaryOrderVrCheckrace}`,
                method: 'POST',
                body
            }),
        }),
    })
});

export const {
    useSummaryOrderDetailCheckraceMutation,
    useImportBibMutation,
    useImportTrackingMutation,
    useSummaryOrderVrCheckraceMutation
} = reportApi;