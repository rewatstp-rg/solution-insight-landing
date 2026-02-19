import * as Yup from 'yup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import { Alert } from '@mui/material';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

// import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { getStorage } from 'src/hooks/use-local-storage';

import axios, { endpoints } from 'src/utils/axios';
import { STORAGE_KEYS, ENV_NAME_ADMIN } from 'src/utils/constants';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import FormProvider, { RHFTextField } from 'src/components/hook-form';


// ----------------------------------------------------------------------

const ENV = import.meta.env.VITE_HOST_NAME;

export default function NewPasswordViewIn({ goBack }: any) {

  const router = useRouter();
  const popover = usePopover();
  const { logout } = useAuthContext();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const userProfile : any = getStorage(ENV === ENV_NAME_ADMIN ? STORAGE_KEYS.USER_INFO : STORAGE_KEYS.CUSTOMER_INFO);

  const email = searchParams.get('email');

  const password = useBoolean();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const VerifySchema = Yup.object().shape({
    code: Yup.string(),
    email: Yup.string(),
    oldPassword: Yup.string().required('กรุณาระบุ'),
    password: Yup.string()
      .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      .required('กรุณาระบุ'),
    confirmPassword: Yup.string()
      .required('กรุณาระบุ')
      .oneOf([Yup.ref('password')], 'รหัสผ่านไม่ตรงกัน'),
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
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const changePasswordSuccess = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  }

  const onSubmit = handleSubmit(async (value: any) => {

    try {
      setLoading(true);
      // etax@2024
      const formValue: any = {
        username: userProfile?.username,
        userName: userProfile?.username,
        password: value.oldPassword,
        newPassword: value.password
      };

      if (userProfile?.accessToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${userProfile.accessToken}`;
      }

      const urlChangePassword = ENV === ENV_NAME_ADMIN ? endpoints.auth.changePasswordAdminUser : endpoints.auth.changePasswordCustomer;
      const resChangePassword: any = await axios.post(urlChangePassword, formValue);

      const { status } = resChangePassword.data;

      if (status.description === "SUCCESS") {

        setTimeout(() => {
          enqueueSnackbar("เปลี่ยนรหัสผ่านสําเร็จ", {
            variant: 'success',
          });
          changePasswordSuccess();
          setLoading(false);
        }, 1500);

      } else {
        if (status.description === "VALIDATION_FAILED") {
          setErrorMsg("รหัสผ่านไม่ถูกต้อง");
        }
        setLoading(false);
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
        label="รหัสผ่านเก่า"
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

      {/* <RHFCode name="code" /> */}

      <RHFTextField
        name="password"
        label="รหัสผ่าน"
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
        label="ยืนยันรหัสผ่าน"
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

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={loading || isSubmitting}
      >
        เปลี่ยนรหัสผ่าน
      </LoadingButton>

      <Link
        onClick={() => goBack()}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
          cursor: 'pointer',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        กลับสู่หน้าโปรไฟล์
      </Link>
    </Stack>
  );

  // const renderHead = (
  //   <>
  //     {/* <SentIcon sx={{ height: 96 }} /> */}

  //     <Stack spacing={1} sx={{ mt: 0, mb: 2, textAlign: 'center' }}>
  //       {/* <Typography variant="h3">ส่งคำขอสำเร็จแล้ว !</Typography> */}
  //       <Typography variant="h3">เปลี่ยนรหัสผ่าน</Typography>

  //       {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //         <br />
  //         กรุณากรอกรหัสในช่องด้านล่างเพื่อเปลี่ยนรหัสผ่าน
  //       </Typography> */}
  //     </Stack>
  //   </>
  // );

  return (
    <>
      {/* {renderHead} */}

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
