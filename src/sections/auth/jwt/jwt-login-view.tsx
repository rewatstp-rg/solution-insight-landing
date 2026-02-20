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

import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { setStorage } from 'src/hooks/use-local-storage';

import { STORAGE_KEYS } from 'src/utils/constants';
import { generateMockToken } from 'src/utils/mock-token';

import { setSession } from 'src/auth/context/jwt/utils';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------
// 🔐 FIXED AUTH CONFIG
const FIXED_AUTH = {
  username: 'admin',
  password: '1234',
};

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const { enqueueSnackbar } = useSnackbar();
  const isPassword = useBoolean();

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------------------------
  // VALIDATION
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('กรุณาระบุชื่อผู้ใช้งาน'),
    password: Yup.string().required('กรุณาระบุรหัสผ่าน'),
  });

  const defaultValues = {
    username: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  // ----------------------------------------------------------------------
  // SUBMIT
  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const { username, password } = data;

      // FIXED AUTH CHECK
      const isValid =
        username === FIXED_AUTH.username &&
        password === FIXED_AUTH.password;

      if (!isValid) {
        setLoading(false);
        setErrorMsg('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        return;
      }

      // MOCK SESSION / TOKEN

      const mockToken = generateMockToken({
        id: 1,
        username: 'admin',
        adminCode: 'ADM-001',
        email: 'admin@company.com',
        firstname: 'Admin',
        lastname: 'System',
        fullName: 'Admin System',
        status: 'ACTIVE',
      });

      setSession(mockToken);

      setStorage(STORAGE_KEYS.USER_INFO, mockToken);

      enqueueSnackbar('ยินดีต้อนรับเข้าสู่ระบบ', {
        variant: 'success',
      });

      setTimeout(() => {
        router.push(returnTo || '/admin');
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
      reset();
      setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  });

  // ----------------------------------------------------------------------
  // RENDER
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Typography variant="h4">Sign in to Administrator</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField
        name="username"
        label="ชื่อผู้ใช้งาน"
        placeholder="ชื่อผู้ใช้งาน"
      />

      <RHFTextField
        name="password"
        label="รหัสผ่าน"
        placeholder="รหัสผ่าน"
        type={isPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={isPassword.onToggle} edge="end">
                <Iconify
                  icon={
                    isPassword.value
                      ? 'solar:eye-bold'
                      : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        variant="body2"
        color="inherit"
        component={RouterLink}
        href="/forgot-password"
        underline="always"
        sx={{ alignSelf: 'flex-end', fontSize: '0.935rem' }}
      >
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
      <Typography
        variant="h3"
        sx={{ textAlign: 'center', position: 'relative', top: -200 }}
      />

      <Page>{renderHead}</Page>

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

// ----------------------------------------------------------------------

const Page = styled.div`
  @media screen and (min-width: 900px) {
    margin-top: -125px;
  }
`;