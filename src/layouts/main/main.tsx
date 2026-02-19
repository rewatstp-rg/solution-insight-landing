import Box, { BoxProps } from '@mui/material/Box';
import { Backdrop, CircularProgress } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useAppSelector, useAppDispatch } from 'src/store/hooks';
import { setIsLoadingDailog, closeDialogMessage, selectErrorMessage } from 'src/slices/error-message.slices';

import { ErrorMessageModal } from 'src/components/dialog';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { useSettingsContext } from 'src/components/settings';

import { NAV, HEADER } from '../config-layout';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {

  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const dispatch = useAppDispatch();
  const { alertDialogModel, isLoadingDailog, loadingState } = useAppSelector(selectErrorMessage);

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const onCloseDialogAlert = () => {
    dispatch(setIsLoadingDailog(false));
    dispatch(closeDialogMessage());
  }

  if (isNavHorizontal) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: `${HEADER.H_MOBILE + 24}px`,
          pb: 10,
          ...(lgUp && {
            pt: `${HEADER.H_MOBILE * 2 + 40}px`,
            pb: 15,
          }),
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...sx,
      }}
      {...other}
    >
      <ErrorMessageModal />
      <AlertDialog model={alertDialogModel} onCancel={onCloseDialogAlert} loading={isLoadingDailog} />
      {(loadingState) && (
        <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      {children}
    </Box>
  );
}
