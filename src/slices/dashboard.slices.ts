import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

export type dashboardState = {
    dashboardModel?: any,
}

const initialState: dashboardState = {
    dashboardModel: undefined,
}

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setEmailModel: (state, action) => {
            state.dashboardModel = action.payload
        },
    },
})

export const { setEmailModel } = dashboardSlice.actions;

export const seleceDashboardModel = (state: RootState) => state.dashboard;

export default dashboardSlice.reducer;
