import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';
import { MASTER_CONFIG_GROUP } from 'src/utils/constants';

import {
    setDistrictDetail,
    setProvinceDetail,
    setListGenderOption,
    setConfigGroupDetail,
    setSubDistrictDetail,
    setListDefaultStatus,
    setListProvinceOption,
    setSearchDetailResult,
    setListDistrictOption,
    setListAllListboxGroup,
    setProvinceStatusOption,
    setSearchProvinceResult,
    searchSubDistrictResult,
    setSearchConfigGroupResult,
    setListEmailMktTemplateStatusOtion,
    setListEmailTransectionStatusOtion,
} from 'src/slices/master-data.slices';

import { BasePaginateResponse } from 'src/types/base-paginate';
import type {
    Config,
    ConfigGroup,
    ConfigResponse,
    ProvinceResponse,
    MasterDistrictModel,
    ConfigGroupResponse,
    ProvinceResponseList,
    MasterSubDistrictModel,
    MasterDistrictResponse,
    ConfigGroupSearchRequest,
    MasterSubDistrictResponse,
    MasterDistrictResponseList,
    MasterDistrictSearchRequest,
    MasterProvinceSearchRequest,
    MasterProvinceSearchResponse,
    MasterSubDistrictResponseList
} from 'src/types/master-config';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.masterData.root}`;

export const masterDataApi = createApi({
    reducerPath: 'masterDataApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        getConfigByGroup: builder.mutation<Config[], Config>({
            query: (body) => ({
                url: `${endpoints.masterData.listboxByGroup}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: ConfigResponse) => data,
            async onQueryStarted(body, { dispatch, queryFulfilled }) {

                const {
                    PROVINCE_STATUS,
                    DEFAULT_STATUS,
                    GENDER,
                    EMAIL_TEMPLATE_STATUS,
                    EMAIL_TRANSACTION_STATUS
                } = MASTER_CONFIG_GROUP;

                try {
                    const { data } = await queryFulfilled;

                    if (body.listboxGroup === PROVINCE_STATUS) {
                        dispatch(setProvinceStatusOption(data));
                    } else if (body.listboxGroup === DEFAULT_STATUS) {
                        dispatch(setListDefaultStatus(data));
                    } else if (body.listboxGroup === GENDER) {
                        dispatch(setListGenderOption(data));
                    } else if (body.listboxGroup === EMAIL_TEMPLATE_STATUS) {
                        dispatch(setListEmailMktTemplateStatusOtion(data));
                    } else if (body.listboxGroup === EMAIL_TRANSACTION_STATUS) {
                        dispatch(setListEmailTransectionStatusOtion(data));
                    }

                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:152 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        searchProvince: builder.mutation<BasePaginateResponse<MasterProvinceSearchResponse>, MasterProvinceSearchRequest>({
            query: (body) => ({
                url: `${endpoints.masterData.searchProvince}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setSearchProvinceResult(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSearchProvinceResult(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:96 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveProvince: builder.mutation<ProvinceResponse, MasterProvinceSearchResponse>({
            query: (body) => ({
                url: `${endpoints.masterData.saveProvince}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setProvinceDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setProvinceDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:119 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        getProvinceByCode: builder.mutation<ProvinceResponse, MasterProvinceSearchResponse>({
            query: (body) => ({
                url: `${endpoints.masterData.getProvinceByCode}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setProvinceDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setProvinceDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:135 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        searchDistrict: builder.mutation<BasePaginateResponse<MasterDistrictModel>, MasterDistrictSearchRequest>({
            query: (body) => ({
                url: `${endpoints.masterData.searchDistrict}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setSearchDetailResult(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSearchDetailResult(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:96 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        getByDistrictCode: builder.mutation<MasterDistrictResponse, MasterDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.getByDistrictCode}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setDistrictDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setDistrictDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:171 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveDistrict: builder.mutation<MasterDistrictResponse, MasterDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.saveDistrict}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setDistrictDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setDistrictDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:187 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        searchSubDistrict: builder.mutation<BasePaginateResponse<MasterDistrictModel>, MasterDistrictSearchRequest>({
            query: (body) => ({
                url: `${endpoints.masterData.searchSubDistrict}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(searchSubDistrictResult(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(searchSubDistrictResult(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:210 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        getBySubDistrictCode: builder.mutation<MasterSubDistrictResponse, MasterSubDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.getBySubDistrictCode}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setSubDistrictDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSubDistrictDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:171 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        searchConfigGroup: builder.mutation<BasePaginateResponse<ConfigGroup>, ConfigGroupSearchRequest>({
            query: (body) => ({
                url: `${endpoints.masterData.searchConfig}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setSearchConfigGroupResult(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSearchConfigGroupResult(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:206 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        getByConfigGroup: builder.mutation<ConfigGroupResponse, ConfigGroup>({
            query: (id) => ({
                url: `${endpoints.masterData.getByConfigGroup}/${id}`,
                method: 'GET',
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setConfigGroupDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setConfigGroupDetail(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:223 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        listProvince: builder.mutation<ProvinceResponseList, void>({
            query: () => ({
                url: `${endpoints.masterData.listProvince}`,
                method: 'POST',
            }),
            transformResponse: ({ data }: any) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setListProvinceOption([]));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setListProvinceOption(data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:276 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        listDistrictByProvinceCode: builder.mutation<MasterDistrictResponseList, MasterDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.listDistrictByProvinceCode}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setListDistrictOption([]));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setListDistrictOption(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:276 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveSubDistrict: builder.mutation<MasterSubDistrictResponse, MasterSubDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.saveSubDistrict}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setSubDistrictDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setSubDistrictDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:311 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        listSubDistrictByDistrictCode: builder.mutation<MasterSubDistrictResponseList, MasterSubDistrictModel>({
            query: (body) => ({
                url: `${endpoints.masterData.listSubDistrictByDistrictCode}`,
                method: 'POST',
                body
            })
        }),
        listAllListboxGroup: builder.mutation<ConfigResponse, void>({
            query: (body) => ({
                url: `${endpoints.masterData.listAllListboxGroup}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setListAllListboxGroup([]));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setListAllListboxGroup(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:276 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        getBoxGroupMaster: builder.mutation<ConfigGroupResponse, ConfigGroup>({
            query: (body) => ({
                url: `${endpoints.masterData.listboxGroupMaster}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: any) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setConfigGroupDetail(undefined));
                try {
                    const { data }: any = await queryFulfilled;
                    dispatch(setConfigGroupDetail(data[0]));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:352 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveListBoxGroupMaster: builder.mutation<ConfigGroupResponse, ConfigGroup>({
            query: (body) => ({
                url: `${endpoints.masterData.saveListBoxGroupMaster}`,
                method: 'POST',
                body
            }),
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setConfigGroupDetail(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setConfigGroupDetail(data.data));
                } catch (err) {
                    console.log("🚀 ~ file: master-data.api.ts:311 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        saveListBoxMaster: builder.mutation<ConfigResponse, Config>({
            query: (body) => ({
                url: `${endpoints.masterData.saveListBoxMaster}`,
                method: 'POST',
                body
            })
        })
    })
});

export const {
    useGetConfigByGroupMutation,
    useSearchProvinceMutation,
    useSaveProvinceMutation,
    useGetProvinceByCodeMutation,
    useSearchDistrictMutation,
    useGetByDistrictCodeMutation,
    useSaveDistrictMutation,
    useSearchConfigGroupMutation,
    useGetByConfigGroupMutation,
    useSearchSubDistrictMutation,
    useGetBySubDistrictCodeMutation,
    useListProvinceMutation,
    useListDistrictByProvinceCodeMutation,
    useSaveSubDistrictMutation,
    useListSubDistrictByDistrictCodeMutation,
    useListAllListboxGroupMutation,
    useGetBoxGroupMasterMutation,
    useSaveListBoxGroupMasterMutation,
    useSaveListBoxMasterMutation
} = masterDataApi;
