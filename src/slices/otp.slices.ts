import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

import { OTPModel } from 'src/types/otp.type';

export type OtpMessageState = {
    otpModel?: OTPModel,
    userProfile?: {
        username: string,
        password: string,
    },
    tokenProfile?: {
        accessToken: string,
        adminCode: string,
        email: string,
        firstname: string,
        fullName: string,
        id: number,
        lastname: string,
        status: string,
        username: string,
    },
    accessToken?: string;
}

const initialState: OtpMessageState = {
    otpModel: undefined,
    userProfile: undefined
}

const otpMessageSlice = createSlice({
    name: 'otpMessage',
    initialState,
    reducers: {
        setOtpMessage: (state, action) => {
            state.otpModel = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
        setTokenProfile: (state, action) => {
            state.tokenProfile = action.payload
        },
    },
})

export const { setOtpMessage, setUserProfile, setTokenProfile, setAccessToken } = otpMessageSlice.actions;

export const selectOtpMessage = (state: RootState) => state.otpMessage;

export default otpMessageSlice.reducer;
