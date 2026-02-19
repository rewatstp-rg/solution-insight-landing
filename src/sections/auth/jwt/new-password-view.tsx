import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { setStorage } from 'src/hooks/use-local-storage';

import axios, { endpoints } from 'src/utils/axios';
import { STORAGE_KEYS, ENV_NAME_ADMIN, RESPONSE_STATUS } from 'src/utils/constants';

import { SentIcon } from 'src/assets/icons';
import { useAppSelector } from 'src/store/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { setSession } from 'src/auth/context/jwt/utils';
import { selectOtpMessage } from 'src/slices/otp.slices';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const ENV = import.meta.env.VITE_HOST_NAME;

export default function NewPasswordView() {

  const router = useRouter();

  const { t } = useTranslate();

  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const { userProfile, tokenProfile, accessToken } = useAppSelector(selectOtpMessage);

  const email = searchParams.get('email');

  const password = useBoolean();
  const oldPassword = useBoolean();
  const confirmPassword = useBoolean();
  const { currentLang } = useLocales();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const VerifySchema = Yup.object().shape({
    code: Yup.string(),
    email: Yup.string(),
    oldPassword: Yup.string().required('กรุณาระบุ'),
    password: Yup.string()
      .min(6, t('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'))
      .required('กรุณาระบุ')
      .notOneOf(
        [Yup.ref('oldPassword'), null],
        t('รหัสผ่านปัจจุบันต้องไม่เหมือนกับรหัสผ่านใหม่')
      ),
    confirmPassword: Yup.string()
      .required('กรุณาระบุ')
      .oneOf([Yup.ref('password')], t('รหัสผ่านไม่ตรงกัน'))
      .notOneOf(
        [Yup.ref('oldPassword'), null],
        t('รหัสผ่านปัจจุบันต้องไม่เหมือนกับรหัสผ่านใหม่')
      ),
  });

  const defaultValues = {
    code: '',
    email: email || '',
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    // mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    // watch,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = handleSubmit(async (value: any) => {

    try {
      setLoading(true);
      if (userProfile && userProfile?.username && userProfile?.password && tokenProfile && accessToken) {
        // etax@2024
        const formValue: any = {
          username: userProfile?.username,
          userName: userProfile?.username,
          password: value.oldPassword,
          newPassword: value.password
        };

        const urlChangePassword = ENV === ENV_NAME_ADMIN ? endpoints.auth.changePasswordAdminUser : endpoints.auth.changePasswordCustomer;
        const resChangePassword: any = await axios.post(urlChangePassword, formValue);

        const { status } = resChangePassword.data;

        if (status.description === RESPONSE_STATUS.SUCCESS) {
          const key = ENV === ENV_NAME_ADMIN ? STORAGE_KEYS.USER_INFO : STORAGE_KEYS.CUSTOMER_INFO;

          setSession(accessToken);
          setStorage(key, tokenProfile);

          const urlDashboard = ENV === ENV_NAME_ADMIN ? '/admin/dashboard' : '/cus-admin/dashboard';

          setTimeout(() => {
            enqueueSnackbar('ยินดีต้อนรับเข้าสู่ระบบ', {
              variant: 'success',
            });
            router.push(urlDashboard);
            setLoading(false);
          }, 1500);

        } else {
          if (status.description === "VALIDATION_FAILED") {
            setErrorMsg('รหัสผ่านไม่ถูกต้อง');
          }
          setLoading(false);
        }


      } else {
        setLoading(false);
        router.push(paths.auth.jwt.login);
      }

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      {/* <RHFTextField
        name="email"
        label="อีเมล"
        placeholder="example@gmail.com"
        InputLabelProps={{ shrink: true }}
      /> */}

      <RHFTextField
        name="oldPassword"
        label='รหัสผ่านเก่า'
        type={oldPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={oldPassword.onToggle} edge="end">
                <Iconify icon={oldPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* <RHFCode name="code" /> */}

      <RHFTextField
        name="password"
        label='รหัสผ่าน'
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

      <RHFTextField
        name="confirmPassword"
        label='ยืนยันรหัสผ่าน'
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={loading}
      >
        เปลี่ยนรหัสผ่าน
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.jwt.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        {currentLang?.value === 'en' ? "Go to Login." : "กลับสู่หน้าล็อคอิน"}
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <SentIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        {/* <Typography variant="h3">ส่งคำขอสำเร็จแล้ว !</Typography> */}
        <Typography variant="h3">เปลี่ยนรหัสผ่าน</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* เราได้ส่งอีเมลยืนยัน 6 หลักไปยังอีเมลของคุณแล้ว */}
          <br />
          {currentLang.value === 'en' ? ' Please enter the code in the field below to change your password.' : 'กรุณากรอกรหัสในช่องด้านล่างเพื่อเปลี่ยนรหัสผ่าน'}
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
