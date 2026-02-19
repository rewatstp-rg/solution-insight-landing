/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/material';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import axios, { endpoints } from 'src/utils/axios';

import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { setStorage } from 'src/hooks/use-local-storage';

import { AUTH_TYPE, STORAGE_KEYS, AUTH_INVALID_MESSAGE } from 'src/utils/constants';

import { useAppDispatch } from 'src/store/hooks';
import { setSession } from 'src/auth/context/jwt/utils';
import { setUserProfile, setAccessToken, setTokenProfile } from 'src/slices/otp.slices';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('กรุณาระบุ'),
    password: Yup.string().required('กรุณาระบุ'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit(async (dataValue) => {
    try {
      setLoading(true);
      const formValue = dataValue;

      const url = endpoints.auth.login;

      const res = await axios.post(url, formValue);
      const { data, status } = res.data;

      if (status.description === "SUCCESS" && data.accessToken) {
        dispatch(setUserProfile({ ...formValue }));
        if (res?.data?.data?.status === AUTH_TYPE.NEW_USER) {

          axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

          dispatch(setTokenProfile(data));
          dispatch(setAccessToken(data?.accessToken));

          router.push('/new-password');

        } else if (res?.data?.data?.status === AUTH_TYPE.ACTIVE) {

          // console.log("🚀 ~ file: jwt-login-view.tsx:75 ~ onSubmit ~ data:", data)

          const key = STORAGE_KEYS.USER_INFO;

          setSession(data?.accessToken);
          setStorage(key, data);

          axios.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

          const urlDashboard = '/admin/dashboard/overview';
          // console.log("🚀 ~ file: jwt-login-view.tsx:96 ~ setTimeout ~ returnTo:", returnTo)

          setTimeout(() => {
            enqueueSnackbar("ยินดีต้อนรับเข้าสู่ระบบ", {
              variant: 'success',
            });

            router.push(returnTo || urlDashboard);
            setLoading(false);
          }, 1500);
        }

      } else {
        setLoading(false);
        setErrorMsg(AUTH_INVALID_MESSAGE[status.description]);
      }

    } catch (error) {
      setLoading(false);
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Typography variant="h4">Sign in to Administrator</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="username" label="ชื่อผู้ใช้งาน" placeholder='ชื่อผู้ใช้งาน' />

      <RHFTextField
        name="password"
        label="รหัสผ่าน"
        placeholder='รหัสผ่าน'
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link variant="body2" color="inherit" component={RouterLink} href="/forgot-password" underline="always" sx={{ alignSelf: 'flex-end', fontSize: '0.935rem', cursor: 'pointer' }}>
        ลืมรหัสผ่าน ?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
      >
        เข้าสู่ระบบ
      </LoadingButton>
    </Stack>
  );

  return (
    <Box sx={{ maxWidth: 450, position: 'relative' }}>
      <Typography variant="h3" sx={{ textAlign: 'center', position: 'relative', top: -200 }}>
        {/* <img src="/assets/logo/Solution-Insight.png" alt="logo" width={300} style={{ textAlign: 'center' }} /> */}
      </Typography>

      <Page>
        {renderHead}
      </Page>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </Box>
  );
}

const Page = styled.div` 
@media screen and (min-width: 900px) {
  margin-top: -125px;
}
  
`
