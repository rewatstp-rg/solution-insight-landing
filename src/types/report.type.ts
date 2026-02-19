import { BaseDataResponse } from "src/api/base/types";

export type ReportResponse = {
    data: {
        eventCode: string;
        dateFromStr: string;
        dateToStr: string;
        fileResponse?: {
            file: any,
            name: string,
            success: boolean
        };
    }
} & BaseDataResponse

export type ReportRequest = {
    eventCode: string;
    dateFromStr: string;
    dateToStr: string;
}