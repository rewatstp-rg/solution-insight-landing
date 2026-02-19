import { BaseDataResponse } from "src/api/base/types";

export type ValidateModel = { 
    validateStatus: boolean,
    validateType: string
}
export type ValidateResponseModel = {
    data: {
        validateStatus: boolean,
        validateType: string
    }
} & BaseDataResponse;