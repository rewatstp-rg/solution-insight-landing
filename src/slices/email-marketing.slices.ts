import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

import { EmailMktTemplateType } from 'src/types/email-mkt-template.type';
import { EmailMktTransactionType } from 'src/types/email-mkt-transaction.model';

export type emailMarketingState = {
    emailMarketingTemplateDetail?: EmailMktTemplateType;
    emailTransactionInfo?: EmailMktTransactionType;
    transactionFileDetailTempResult: any
}

const initialState: emailMarketingState = {
    emailMarketingTemplateDetail: undefined,
    emailTransactionInfo: undefined,
    transactionFileDetailTempResult: undefined,
}

const emailMarketingSlice = createSlice({
    name: 'emailMarketing',
    initialState,
    reducers: {
        setEmailMarketingTemplateDetail: (state, action) => {
            state.emailMarketingTemplateDetail = action.payload
        },
        setEmailTransactionInfo: (state, action) => {
            state.emailTransactionInfo = action.payload
        },
        setTransactionFileDetailTempResult: (state, action) => {
            state.transactionFileDetailTempResult = action.payload
        }
    }
})

export const { setEmailMarketingTemplateDetail, setEmailTransactionInfo, setTransactionFileDetailTempResult } = emailMarketingSlice.actions;

export const seleceEmailMarketingModel = (state: RootState) => state.emailMarketing;

export default emailMarketingSlice.reducer;
