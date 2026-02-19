import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from 'src/store/types';

import { AlertDialogModel } from 'src/types/alert-dialog.type';

export type ErrorMessageState = {
  open: boolean;
  message: string;
  alertDialogModel: AlertDialogModel;
  isLoadingDailog: boolean;
  urlCallBack: string;
  loadingState: boolean;
}

const initialState: ErrorMessageState = {
  open: false,
  message: '',
  alertDialogModel: {},
  isLoadingDailog: false,
  urlCallBack: '',
  loadingState: false
}

const errorMessageSlice = createSlice({
  name: 'errorMessage',
  initialState,
  reducers: {
    showErrorMessage: (state, action) => {
      state.open = true
      state.message = action.payload
    },
    closeErrorMessage: (state) => {
      state.open = false
      state.message = ''
    },
    setDialogMessage: (state, action) => {
      state.alertDialogModel = action.payload;
    },
    closeDialogMessage: (state) => {
      state.alertDialogModel.open = false;
    },
    setIsLoadingDailog: (state, action) => {
      state.isLoadingDailog = action.payload;
    },
    setUrlCallBack: (state, action) => {
      state.urlCallBack = action.payload;
    },
    setLoadingState: (state, action) => {
      state.loadingState = action.payload
    },
  },
})

export const { showErrorMessage, closeErrorMessage, setDialogMessage, closeDialogMessage, setIsLoadingDailog, setUrlCallBack, setLoadingState } = errorMessageSlice.actions;

export const selectErrorMessage = (state: RootState) => state.errorMessage;

export default errorMessageSlice.reducer;
