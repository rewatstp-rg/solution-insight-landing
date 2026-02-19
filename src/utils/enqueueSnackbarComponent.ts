import { enqueueSnackbar } from "notistack";

import { DAILOG_TITLE, DAILOG_MESSAGE } from "./constants";

export const enqueueSnackbarSuccessComponent = () => {

    enqueueSnackbar(DAILOG_MESSAGE.success, {
        variant: 'success',
    });
}


export const enqueueSnackbarErrorComponent = () => {

    enqueueSnackbar(DAILOG_TITLE.seriveUnSuccess, {
        variant: 'error',
    });
}