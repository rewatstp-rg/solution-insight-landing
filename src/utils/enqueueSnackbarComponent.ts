import { enqueueSnackbar } from "notistack";

import { DAILOG_TITLE, DAILOG_MESSAGE } from "./constants";

export const enqueueSnackbarSuccessComponent = (message?: string) => {
    enqueueSnackbar(message || DAILOG_MESSAGE.success, {
        variant: 'success',
    });
}


export const enqueueSnackbarErrorComponent = (message?: string) => {
    enqueueSnackbar(message || DAILOG_TITLE.seriveUnSuccess, {
        variant: 'error',
    });
}