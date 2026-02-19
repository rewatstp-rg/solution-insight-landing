/* eslint import/newline-after-import: "off" */
import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { setListRole } from 'src/slices/role.slices';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.role.root}`;

export const roleApi = createApi({
    reducerPath: 'roleApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        listRole: builder.mutation<any, void>({
            query: (body) => ({
                url: `${endpoints.role.listRole}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setListRole(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setListRole(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: event-config.api.ts:37 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
    })
});

export const {
    useListRoleMutation
} = roleApi;