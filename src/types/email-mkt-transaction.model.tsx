import { BaseDataResponse } from "src/api/base/types";

import { BasePaginateRequest } from "./base-paginate";

export type EmailMktTransactionType = {
    id: number;
    transactionNo: string | '';
    transactionFileId: number;
    transactionFileName: string | '';
    emailTemplateCode: string | '';
    emailTemplateName: string | '';
    emailSubject: string | '';
    transactionDesc: string | '';
    sendEmailDateTime: Date | null;
    status: string;
    createDtm: Date | null;
    createBy: string;
    lastUpdateDtm: Date | null;
    lastUpdateBy: string | '';
    statusDesc: string | '';
    fileUpload: any[]
    header: any[]
    sentToExampleEmail: string
}

export const createDefaultEmailMktTransaction = (): EmailMktTransactionType => ({
    id: 0,
    transactionNo: '',
    transactionFileId: 0,
    transactionFileName: '',
    emailTemplateCode: '',
    emailTemplateName: '',
    emailSubject: '',
    transactionDesc: '',
    sendEmailDateTime: null,
    status: 'DRAFT',
    createDtm: null,
    createBy: 'SYSTEM',
    lastUpdateDtm: null,
    lastUpdateBy: '',
    statusDesc: '',
    fileUpload: [],
    header: [],
    sentToExampleEmail: ''
});

export type EmailMktTransactionSearchType = {
    transactionNo: string;
    emailTemplateCode: string;
    status: string;
    dateForm: any;
    dateTo: any;
    sortBy?: string;
    orderType?: string;
} & BasePaginateRequest;

export const createDefaultEmailMktTransactionSearch = (): EmailMktTransactionSearchType => ({
    transactionNo: '',
    emailTemplateCode: '',
    status: '',
    dateForm: null,
    dateTo: null,
    pageNo: 1,
    pageSize: 10,
    sortBy: 'lastUpdateDtm',
    orderType: 'DESC'
});

export type EmailMktTransactionResponseType = {
    data: EmailMktTransactionType
} & BaseDataResponse;

export type EmailMktTransactionResponseListType = {
    data: EmailMktTransactionType[]
} & BaseDataResponse;

export type ListEmailDataTemp = {
    id: number;
    email: string;
    transactionNo: string;
    value1: string;
    value2: string;
    value3: string;
    value4: string;
    value5: string;
    value6: string;
    value7: string;
    value8: string;
    value9: string;
    value10: string;
    value11: string;
    value12: string;
    value13: string;
    value14: string;
    value15: string;
    value16: string;
    value17: string;
    value18: string;
    value19: string;
    value20: string;
    value21: string;
    value22: string;
    value23: string;
    value24: string;
    value25: string;
    value26: string;
    value27: string;
    value28: string;
    value29: string;
    value30: string;
}

export type ListEmailDataTempResponsePage = {
    data: {
        id: number;
        email: string;
        transactionNo: string;
        value1: string;
        value2: string;
        value3: string;
        value4: string;
        value5: string;
        value6: string;
        value7: string;
        value8: string;
        value9: string;
        value10: string;
        value11: string;
        value12: string;
        value13: string;
        value14: string;
        value15: string;
        value16: string;
        value17: string;
        value18: string;
        value19: string;
        value20: string;
        value21: string;
        value22: string;
        value23: string;
        value24: string;
        value25: string;
        value26: string;
        value27: string;
        value28: string;
        value29: string;
        value30: string;
    }[]
} & BaseDataResponse;
