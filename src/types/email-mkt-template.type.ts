import { BaseDataResponse } from "src/api/base/types";

import { BasePaginateRequest } from "./base-paginate";

export type EmailMktTemplateType = {
    id: number;
    emailTemplateCode: string;
    fileId: number;
    emailTemplateName: string;
    emailTemplateNameEn: string;
    emailTemplateType: string;
    emailTemplateDesc: string;
    emailTemplateJson: any | null;
    status: string;
    statusDesc: string;
    createDtm: string | null;
    createBy: string;
    lastUpdateDtm: string  | null;
    lastUpdateBy: string;
    emailTemplateFileName: string;
}

export const DefaultValueEmailMktTemplateType = {
    id: 0,
    emailTemplateCode: '',
    fileId: 0,
    emailTemplateName: '',
    emailTemplateNameEn: '',
    emailTemplateType: '',
    emailTemplateDesc: '',
    emailTemplateJson:  null,
    status: 'ACTIVE',
    statusDesc :'เปิดการใช้งาน',
    createDtm: '',
    createBy: '',
    lastUpdateDtm: '',
    lastUpdateBy: '',
    emailTemplateFileName:''
}

export type EmailMktTemplateSearchType = {
    emailTemplateCode: string;
    emailTemplateName: string;
    status: string;
} & BasePaginateRequest;

export const DefaultValueEmailMktTemplateSearchType = {
    emailTemplateCode: '',
    emailTemplateName: '',
    status: '',
    pageNo: 1,
    pageSize: 10
}

export type EmailMktTemplateResponse = {
    data: EmailMktTemplateType
} & BaseDataResponse;