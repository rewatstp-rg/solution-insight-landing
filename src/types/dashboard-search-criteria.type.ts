import { BaseDataResponse } from "src/api/base/types";

export type DashboardRequestSearchCriteria = {
    dateFromStr: any,
    dateToStr: any,
    month?: any,
    year?: any
}

export type DashboardModelResponse = {
    data: any
} & BaseDataResponse;
