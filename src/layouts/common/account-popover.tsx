/* eslint-disable perfectionist/sort-imports */
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { getStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEYS } from 'src/utils/constants';
import { getPathImageByfile64 } from 'src/utils/getPathImageByfile64';

import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const key = STORAGE_KEYS.USER_INFO;
  const userProfile : any  = getStorage(key);

  const { logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const OPTIONS = [
    // {
    //   label: 'Dashboard Overview',
    //   linkTo: '/',
    // },
    {
      label: 'แก้ไขข้อมูลส่วนตัว',
      linkTo: '/admin/profile',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      Object.keys(localStorage).forEach((keyItem) => {
        if (keyItem !== "version")
          delete localStorage[keyItem];
      })
      router.replace(`/login?returnTo=${window.location.pathname}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
   
  };

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={getPathImageByfile64(userProfile?.fileResponse) || _mock.image.avatar(24)}
          alt={userProfile?.fullName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {userProfile?.fullName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userProfile?.fullName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {userProfile?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          ออกจากระบบ
        </MenuItem>
      </CustomPopover>
    </>
  );
}
