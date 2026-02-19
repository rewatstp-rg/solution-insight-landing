import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

import { FileModel } from 'src/types/file.model';

export type fileState = {
    fileModel?: FileModel,
}

const initialState: fileState = {
    fileModel: undefined,
}

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setFileModel: (state, action) => {
            state.fileModel = action.payload
        },
    },
})

export const { setFileModel } = fileSlice.actions;

export const seleceFileModel = (state: RootState) => state.file;

export default fileSlice.reducer;
