import { createApi } from '@reduxjs/toolkit/query/react';

import { endpoints } from 'src/utils/axios';

import { setlistEmailTemplateOtion } from 'src/slices/master-data.slices';
import { setEmailTransactionInfo, setTransactionFileDetailTempResult } from 'src/slices/email-marketing.slices';

import { BasePaginateResponse } from 'src/types/base-paginate';
import { Config, ConfigResponse } from 'src/types/master-config';
import { EmailMktTemplateType, EmailMktTemplateResponse, EmailMktTemplateSearchType } from 'src/types/email-mkt-template.type';
import {
    ListEmailDataTemp,
    EmailMktTransactionType,
    ListEmailDataTempResponsePage,
    EmailMktTransactionSearchType,
    EmailMktTransactionResponseType
} from 'src/types/email-mkt-transaction.model';

import { axiosBaseQuery } from './base/axiosBaseQuery';

const ENV_URL = `${import.meta.env.VITE_HOST_API}${endpoints.emailMarketing.root}`;

export const emailMarketingApi = createApi({
    reducerPath: 'emailMarketingApi',
    baseQuery: axiosBaseQuery({ baseUrl: ENV_URL }),
    endpoints: (builder) => ({
        searchEmailTemplate: builder.mutation<BasePaginateResponse<EmailMktTemplateType>, EmailMktTemplateSearchType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.searchEmailTemplate}`,
                method: 'POST',
                body
            }),
        }),
        createEmailTemplate: builder.mutation<EmailMktTemplateResponse, FormData>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.create}`,
                method: 'POST',
                body
            }),
        }),
        updateEmailTemplate: builder.mutation<EmailMktTemplateResponse, FormData>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.update}`,
                method: 'POST',
                body
            }),
        }),
        getByEmailTemplateCode: builder.mutation<EmailMktTemplateResponse, EmailMktTemplateType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.getByEmailTemplateCode}`,
                method: 'POST',
                body
            }),
        }),
        searchEmailTransaction: builder.mutation<BasePaginateResponse<EmailMktTransactionType>, EmailMktTransactionSearchType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.searchEmailTransaction}`,
                method: 'POST',
                body
            }),
        }),
        createEmailTransaction: builder.mutation<EmailMktTransactionResponseType, FormData>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.createEmailTransaction}`,
                method: 'POST',
                body
            }),
        }),
        updateEmailTransaction: builder.mutation<EmailMktTransactionResponseType, EmailMktTransactionType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.updateEmailTransaction}`,
                method: 'POST',
                body
            }),
        }),
        getEmailTransaction: builder.mutation<EmailMktTransactionType, EmailMktTransactionType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.getEmailTransaction}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: EmailMktTransactionResponseType) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setEmailTransactionInfo(data));
                } catch (err) {
                    console.log("🚀 ~ file: email-marketing.api.ts:85 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        listEmailTemplate: builder.mutation<Config[], void>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.listEmailTemplate}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: ConfigResponse) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setlistEmailTemplateOtion(data));
                } catch (err) {
                    console.log("🚀 ~ file: email-marketing.api.ts:85 ~ onQueryStarted ~ err:", err)
                }
            },
        }),
        listEmailTransactionData: builder.mutation<ListEmailDataTemp[], { transactionNo: string, pageNo: number, pageSize: number }>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.listEmailTransactionData}`,
                method: 'POST',
                body
            }),
            transformResponse: ({ data }: ListEmailDataTempResponsePage) => data,
            async onQueryStarted(_body, { dispatch, queryFulfilled }) {
                dispatch(setTransactionFileDetailTempResult(undefined));
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setTransactionFileDetailTempResult(data));
                } catch (err) {
                    console.log("🚀 ~ file: document-upload-file.ts:75 ~ onQueryStarted ~ err:", err);
                }
            },
        }),
        deleteEmailTransaction: builder.mutation<any, EmailMktTransactionType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.deleteEmailTransaction}`,
                method: 'POST',
                body
            }),
        }),
        sendExampleEmail: builder.mutation<EmailMktTransactionResponseType, EmailMktTransactionType>({
            query: (body) => ({
                url: `${endpoints.emailMarketing.sendExampleEmail}`,
                method: 'POST',
                body
            }),
        }),
    })
});

export const {
    useSearchEmailTemplateMutation,
    useCreateEmailTemplateMutation,
    useGetByEmailTemplateCodeMutation,
    useUpdateEmailTemplateMutation,
    useSearchEmailTransactionMutation,
    useCreateEmailTransactionMutation,
    useUpdateEmailTransactionMutation,
    useGetEmailTransactionMutation,
    useListEmailTemplateMutation,
    useListEmailTransactionDataMutation,
    useDeleteEmailTransactionMutation,
    useSendExampleEmailMutation
} = emailMarketingApi;


// searchEmailTransaction()
// getEmailTransaction (transactionNo)
// createEmailTransaction() -> formData
// updateEmailTransaction() -> formData เผื่อมี Upload File

// deleteEmailTransaction() อยู่หน้า Search