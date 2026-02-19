import { PAGE_SIZE_DEFAULT } from "src/utils/constants";
import getQueryStringObj from "src/utils/getQueryStringObj";

export const getStringObj = () => {
    const queryString = getQueryStringObj(window.location);
    const {
        pageNo = 1,
        pageSize = PAGE_SIZE_DEFAULT,
        provinceCode = '',
        districtCode = '',
        subDistrictName = '',
        postcode = '',
        status = '',
        sortBy = 'id',
        orderType = 'asc',
    } = queryString;

    const body = {
        pageNo: pageNo as number,
        pageSize: pageSize as number,
        provinceCode: provinceCode as string,
        districtCode: districtCode as string,
        subDistrictName: subDistrictName as string,
        postcode: postcode as string,
        status: status as string,
        sortBy: sortBy as string,
        orderType: orderType as string,
    };

    return body;
};
