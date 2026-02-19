import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

export type RoleState = {
    listRole: any[],
}

const initialState: RoleState = {
    listRole: [],
}

const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setListRole: (state, action) => {
            state.listRole = action.payload
        },
    },
})

export const { setListRole } = roleSlice.actions;

export const selectRole = (state: RootState) => state.role;

export default roleSlice.reducer;
