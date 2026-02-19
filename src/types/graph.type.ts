import { BaseDataResponse } from "src/api/base/types";

export type GraphModel = {
    ticketName: string;
    ticketId: string;
    data: DataModel[];
    label: string[];
}

export type DataModel = {
    backgroundColor: string;
    label: string;
    data: string[];
}

export type GraphModelRequest = {
    month: string;
    year: string;
}


export type GraphModelResponse = {
    data: GraphModel
} & BaseDataResponse;