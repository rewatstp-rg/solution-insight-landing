import { PAGE_SIZE_DEFAULT } from "src/utils/constants";
import getQueryStringObj from "src/utils/getQueryStringObj";

export type FormValue = { emailTemplateName?: string, status?: string };

export const getStringObj = () => {
    const queryString = getQueryStringObj(window.location);

    const {
        pageNo = 1,
        pageSize = PAGE_SIZE_DEFAULT,
        productName = '',
        status = '',
        sortBy = 'last_update_dtm',
        orderType = 'DESC',
    } = queryString;

    const body = {
        pageNo: pageNo as number,
        pageSize: pageSize as number,
        productName: productName as string,
        status: status as string,
        sortBy: sortBy as string,
        orderType: orderType as string,
    };

    return body;
};
