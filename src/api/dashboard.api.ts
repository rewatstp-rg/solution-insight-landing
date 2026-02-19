/* eslint import/newline-after-import: "off" */
import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { GraphModelRequest, GraphModelResponse } from 'src/types/graph.type';
import { DashboardModelResponse, DashboardRequestSearchCriteria } from 'src/types/dashboard-search-criteria.type';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.dashboard.root}`;

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        getDashBoard: builder.mutation<DashboardModelResponse, DashboardRequestSearchCriteria>({
            query: (body) => ({
                url: `${endpoints.dashboard.getDashBoard}`,
                method: 'POST',
                body
            }),
        }),
        getGraph30Day: builder.mutation<GraphModelResponse, GraphModelRequest>({
            query: (body) => ({
                url: `${endpoints.dashboard.getGraph30Day}`,
                method: 'POST',
                body
            }),
        }),
        getGraph3Month: builder.mutation<GraphModelResponse, GraphModelRequest>({
            query: (body) => ({
                url: `${endpoints.dashboard.getGraph3Month}`,
                method: 'POST',
                body
            }),
        }),
    })
});

export const {
    useGetDashBoardMutation,
    useGetGraph30DayMutation,
    useGetGraph3MonthMutation
} = dashboardApi;