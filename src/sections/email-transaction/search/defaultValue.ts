import ISOToDate from "src/utils/ISOToDate";
import { PAGE_SIZE_DEFAULT } from "src/utils/constants";
import getQueryStringObj from "src/utils/getQueryStringObj";

export const getStringObj = () => {
    const queryString = getQueryStringObj(window.location);
    const {
        pageNo = 1,
        pageSize = PAGE_SIZE_DEFAULT,
        transactionNo = '',
        emailTemplateCode = '',
        status = '',
        dateForm = '',
        dateTo = '',
        sortBy = 'lastUpdateDtm',
        orderType = 'DESC',
    } = queryString;

    const body = {
        pageNo: pageNo as number,
        pageSize: pageSize as number,
        emailTemplateCode: emailTemplateCode as string,
        transactionNo: transactionNo as string,
        dateForm: dateForm ? ISOToDate(dateForm as any, 'dateRequest') : null,
        dateTo: dateTo ? ISOToDate(dateTo as any, 'dateRequest') : null,
        status: status as string,
        sortBy: sortBy as string,
        orderType: orderType as string
    };

    return body;
};
