/* eslint import/newline-after-import: "off" */
import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { setListUserAddressByUserId } from 'src/slices/user.slices';

import { UserAddressModel, UserAddressModelListResponse } from 'src/types/user';

import { axiosBaseQuery } from './base/axiosBaseQuery';


const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.user.root}`;

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        listUserAddressByUserId: builder.mutation<UserAddressModel[], UserAddressModel>({
            query: (body) => ({
                url: `${endpoints.user.listUserAddressByUserId}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: UserAddressModelListResponse) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setListUserAddressByUserId([]));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setListUserAddressByUserId(data));
                } catch (err) {
                    console.log("🚀 ~ file: user.api.ts:32 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveUserAddress: builder.mutation<UserAddressModelListResponse, UserAddressModel>({
            query: (body) => ({
                url: `${endpoints.user.saveUserAddress}`,
                method: 'POST',
                body
            })
        })
    })
});

export const {
    useListUserAddressByUserIdMutation,
    useSaveUserAddressMutation
} = userApi;
