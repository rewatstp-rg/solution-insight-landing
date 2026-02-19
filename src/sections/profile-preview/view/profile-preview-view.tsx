
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from "react";

import {
    Box,
    Grid,
    Stack,
    Button,
    Switch,
    Container,
    Typography,
    FormControlLabel,
} from "@mui/material";

import { useRouter } from 'src/routes/hooks';

import { getStorage } from 'src/hooks/use-local-storage';

import { fData } from 'src/utils/format-number';
import { getPathImageByfile64 } from 'src/utils/getPathImageByfile64';
import {
    checkServiceResponse,
    PropsCheckServiceResponse
} from 'src/utils/check-service-response';
import {
    DAILOG_KEY,
    STORAGE_KEYS,
    DAILOG_TITLE,
    ERROR_MESSAGE,
    DAILOG_MESSAGE,
    ADMIN_USER_STATUS,
    ADMIN_USER_DUPLICATE,
    ALREADY_REGISTERED_EMAIL,
} from 'src/utils/constants';

// import { BaseOption } from 'src/api/base/types';
import { useAppSelector } from 'src/store/hooks';
import { selectAdministrator } from 'src/slices/administrator.slices';
import {
    useGetAdminByCodeMutation,
    useUpdateAdminUserMutation
} from 'src/api/administrator.api';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CardCustom from 'src/components/card/card-custom';
import { useSettingsContext } from "src/components/settings";
import AlertDialog from 'src/components/dialog/alert-dialog';
import { ButtonSubmitForm } from 'src/components/button-forom';
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import FormProvider from 'src/components/hook-form/form-provider';
import {
    // Field,
    RHFTextField,
    RHFUploadAvatar
} from 'src/components/hook-form';

import NewPasswordViewIn from 'src/sections/auth/jwt/new-password-view-in';

import { AdminUserModel } from 'src/types/administrator.type';
import { AlertDialogModel } from 'src/types/alert-dialog.type';

// ----------------------------------------------------------------------

const ProfilePreview = () => {

    const userProfile : any = getStorage(STORAGE_KEYS.USER_INFO);

    const router = useRouter();
    const settings = useSettingsContext();

    const [updateAdmin, { isLoading: isLoadingUpdateAdmin }] = useUpdateAdminUserMutation();
    const [getAdminByCode, { isLoading: isLoadingGetAdminByCode }] = useGetAdminByCodeMutation();

    const { administratorDetail } = useAppSelector(selectAdministrator);

    const [fileProfile, setFileProfile] = useState<File>();
    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});
    const [onChangePasswordStatus, setOnChangePasswordStatus] = useState(false);

    const administratorSchema = Yup.object().shape({
        id: Yup.number(),
        userName: Yup.string(),
        username: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        firstName: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        lastName: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        email: Yup.string().required(ERROR_MESSAGE.REQUIRED).email(ERROR_MESSAGE.EMAIL),
        departmentName: Yup.string(),
        createDtm: Yup.string(),
        createBy: Yup.string(),
        adminCode: Yup.string(),
        imageProfileFileId: Yup.number(),
        lastUpdateDtm: Yup.string(),
        tel: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        positionName: Yup.string(),
        status: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        lastUpdateBy: Yup.string(),
        password: Yup.string(),
        imageProfileFileName: Yup.string(),
        imageProfileFileUrl: Yup.mixed<any>().nullable(),
        statusDesc: Yup.string(),
        roleId: Yup.string(),
        adminRole: Yup.array(),
    });

    const defaultValues = useMemo(
        () => ({
            id: administratorDetail?.id || 0,
            username: administratorDetail?.username || '',
            userName: administratorDetail?.username || '',
            firstName: administratorDetail?.firstName || '',
            lastName: administratorDetail?.lastName || '',
            email: administratorDetail?.email || '',
            departmentName: administratorDetail?.departmentName || '',
            createDtm: administratorDetail?.createDtm || '',
            createBy: administratorDetail?.createBy || '',
            adminCode: administratorDetail?.adminCode || '',
            imageProfileFileId: administratorDetail?.imageProfileFileId || 0,
            lastUpdateDtm: administratorDetail?.lastUpdateDtm || '',
            tel: administratorDetail?.tel || '',
            positionName: administratorDetail?.positionName || '',
            status: administratorDetail?.status || 'ACTIVE',
            lastUpdateBy: administratorDetail?.lastUpdateBy || '',
            password: administratorDetail?.password || '',
            imageProfileFileName: administratorDetail?.imageProfileFileName || '',
            imageProfileFileUrl: administratorDetail?.imageProfileFileUrl || '',
            statusDesc: administratorDetail?.statusDesc || '',
            roleId: administratorDetail?.roleId || '',
            adminRole: administratorDetail?.adminRole || []
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [administratorDetail]
    );

    const methods = useForm({
        resolver: yupResolver(administratorSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        watch,
        control,
        setValue,
    } = methods;

    const values = watch();

    // form submit
    const resetAsyncForm = useCallback(async () => {
        const result = administratorDetail;
        // if (isAdd()) reset(defaultValues);
        reset(result)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, administratorDetail]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setDialogMessage({
                title: '',
                message: DAILOG_MESSAGE.modify,
                open: true,
                showSave: true,
                showCancel: true,
                labelOk: 'ตกลง',
                labelCancel: 'ยกเลิก',
                type: DAILOG_KEY.modify ,
                onOk: async () => {

                    onCloseDialogAlert();

                    let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                    const roleMockUp: any = [{ id: 'R001', name: 'Administrator' },{ id: 'R003', name: 'Organizer By Event' }];
                    if (data?.roleId) {
                        const role = roleMockUp.find((x: any) => x.id === data?.roleId);
                        const listRole: any = [{
                            id: data?.adminRole && data?.adminRole.length > 0 ? data.adminRole[0].id : 0,
                            "userCode": "",
                            "roleId": role.id,
                            "roleName": role.name
                        }];

                        data.adminRole = [];
                        data.adminRole = listRole;
                    }

                    // data.username = data.userName;

                    const formData = new FormData();
                    formData.append('data', JSON.stringify({ ...data, imageProfileFileUrl: '' }));

                    if (fileProfile) {
                        formData.append(fileProfile.name, fileProfile);
                    }

                    dataResponse = await updateAdmin(formData).unwrap();

                    if (checkServiceResponse(dataResponse)) {
                        if (dataResponse?.data && dataResponse.data.status !== ADMIN_USER_DUPLICATE && dataResponse.data.status !== ALREADY_REGISTERED_EMAIL) {
                            enqueueSnackbar(DAILOG_MESSAGE.success, {
                                variant: 'success',
                            });
                            setTimeout(() => {
                                router.back();
                            }, 500);
                        } else {
                            enqueueSnackbar(dataResponse.data.status === ADMIN_USER_DUPLICATE ? 'ชื่อผู้ใช้งาน ถูกใช้ไปแล้ว' : 'อีเมล ถูกใช้ไปแล้ว', {
                                variant: 'error',
                            });
                        }
                    } else {
                        enqueueSnackbar(DAILOG_TITLE.seriveUnSuccess, {
                            variant: 'error',
                        });
                    }
                },
            });
        } catch (error) {
            console.error(error);
        }
    });

    const onResetForm = () => {
        resetAsyncForm();
        router.back();
    }
    // form submit

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.modify,
        })
    }

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {

                setValue('imageProfileFileUrl', newFile, { shouldValidate: true });
                setValue('imageProfileFileName', newFile.name, { shouldValidate: true });

                setFileProfile(file);
            }
        },
        [setValue]
    );

    const onChangePassword = () => {
        setOnChangePasswordStatus(true);
    }

    const goBackChangePassword = () => {
        setOnChangePasswordStatus(false);
    }

    const loadContent = async () => {

        if (userProfile && userProfile?.userCode) {
            const adminModel: AdminUserModel = {} as AdminUserModel;
            adminModel.adminCode = userProfile.userCode;
            await getAdminByCode(adminModel).unwrap();
        }

        // getPathImageByfile64(generateDocumentDetail?.fileResponse);
    }

    useEffect(() => {
        resetAsyncForm();
    }, [resetAsyncForm]);

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {

        if (administratorDetail?.fileResponse) {
            setValue('imageProfileFileUrl', getPathImageByfile64(administratorDetail.fileResponse), { shouldValidate: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [administratorDetail]);

    return (
        <>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            {
                onChangePasswordStatus && (
                    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                        <CustomBreadcrumbs
                            heading="ข้อมูลส่วนตัว"
                            links={[
                                { name: 'แก้ไขข้อมูลส่วนตัว' },
                                { name: userProfile?.userCode }
                            ]}
                            sx={{
                                mb: { xs: 3, md: 5 },
                            }}
                        />
                        <CardCustom title='เปลี่ยนรหัสผ่าน'>
                            <Grid container spacing={3} sx={{ mt: 3, justifyContent: 'center', alignContent: 'center' }}>
                                <Grid item xs={12} md={4} sx={{ gap: 3, justifyContent: 'center', alignContent: 'center' }}>
                                    <NewPasswordViewIn goBack={() => goBackChangePassword()} />
                                </Grid>
                            </Grid>
                        </CardCustom>
                    </Container>
                )
            }
            {

                !onChangePasswordStatus && (
                    <FormProvider methods={methods} onSubmit={onSubmit}>
                        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                            <CustomBreadcrumbs
                                heading="ข้อมูลส่วนตัว"
                                links={[
                                    { name: 'แก้ไขข้อมูลส่วนตัว' },
                                    { name: userProfile?.userCode }
                                ]}
                                sx={{
                                    mb: { xs: 3, md: 5 },
                                }}
                            />
                            <CardCustom title='ข้อมูลส่วนตัว'>
                                <Grid item xs={12} md={12}>
                                    <Grid container spacing={3} sx={{ mt: 3 }}>
                                        <Grid item xs={12} md={4} sx={{ gap: 3 }}>
                                            <Box sx={{ pt: 5, pb: 5, px: 3 }}>

                                                {values && (
                                                    <Label
                                                        color={
                                                            (values.status === ADMIN_USER_STATUS.ACTIVE && 'success') ||
                                                            (values.status === ADMIN_USER_STATUS.INACTIVE && 'error') ||
                                                            'warning'
                                                        }
                                                        sx={{ position: 'absolute', top: 24, right: 24 }}
                                                    >
                                                        {
                                                            (values.status === ADMIN_USER_STATUS.ACTIVE && 'เปิดใช้งาน')
                                                        }
                                                        {
                                                            (values.status === ADMIN_USER_STATUS.INACTIVE && 'ปิดใช้งาน')
                                                        }
                                                    </Label>
                                                )}

                                                <Box sx={{ mb: 5 }}>
                                                    <RHFUploadAvatar
                                                        name="imageProfileFileUrl"
                                                        maxSize={1000000}
                                                        onDrop={handleDrop}
                                                        helperText={
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    mt: 3,
                                                                    mx: 'auto',
                                                                    display: 'block',
                                                                    textAlign: 'center',
                                                                    color: 'text.disabled',
                                                                }}
                                                            >
                                                                รองรับ *.jpeg, *.jpg, *.png, *.gif
                                                                <br /> ขนาดไฟล์สูง {fData(1000000)}
                                                            </Typography>
                                                        }
                                                    />
                                                </Box>

                                                {values && (
                                                    <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                                                        <Button
                                                            onClick={() => onChangePassword()}
                                                            variant="soft"
                                                            color="error"
                                                            startIcon={
                                                                <Iconify icon="ic:round-key" width={24} />
                                                            }
                                                        >
                                                            เปลี่ยนรหัสผ่าน
                                                        </Button>
                                                    </Stack>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Box
                                                rowGap={3}
                                                columnGap={2}
                                                display="grid"
                                                gridTemplateColumns={{
                                                    xs: 'repeat(1, 1fr)',
                                                    sm: 'repeat(2, 1fr)',
                                                }}
                                            >
                                                 <RHFTextField name="adminCode" label="รหัสผู้ดูแลระบบ" inputProps={{ maxLength: 20 }} disabled />

                                                <RHFTextField name="username" label="ชื่อผู้เข้าใช้งานระบบ" inputProps={{ maxLength: 100 }} disabled={(values?.id !== 0)} required />
                                                <RHFTextField name="firstName" label="ชื่อ" inputProps={{ maxLength: 100 }} required />
                                                <RHFTextField name="lastName" label="นามสกุล" inputProps={{ maxLength: 100 }} required />
                                                <RHFTextField name="email" label="อีเมล" inputProps={{ maxLength: 100 }} required />
                                                <RHFTextField name="tel" label="เบอร์โทรศัพท์" inputProps={{ maxLength: 50 }} required />
                                                {/* <RHFTextField name="positionName" label="ตำแหน่ง" inputProps={{ maxLength: 100 }} /> */}
                                                {/* <RHFTextField name="departmentName" label="สังกัด" inputProps={{ maxLength: 100 }} /> */}

                                                {/* <Field.Autocomplete
                                                   
                                                    required
                                                    name="roleId"
                                                    label="ระดับการเข้าถึงข้อมูล"
                                                    value={values.roleId || administratorDetail?.adminRole && administratorDetail?.adminRole[0]?.roleId || [{ id: 'R001', name: 'Administrator' },{ id: 'R003', name: 'Organizer By Event' }]}
                                                    options={[{ id: 'R001', name: 'Administrator' },{ id: 'R003', name: 'Organizer By Event' }]}
                                                    getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                                                    isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                                                    renderOption={(props, option) => (
                                                        <li {...props} key={option.id}>
                                                            {option.name}
                                                        </li>
                                                    )}
                                                /> */}

                                                {values && (
                                                    <FormControlLabel
                                                        labelPlacement="start"
                                                        control={
                                                            <Controller
                                                                name="status"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Switch
                                                                        {...field}
                                                                        checked={field.value !== ADMIN_USER_STATUS.INACTIVE}
                                                                        onChange={(event) =>
                                                                            field.onChange(event.target.checked ? ADMIN_USER_STATUS.ACTIVE : ADMIN_USER_STATUS.INACTIVE)
                                                                        }
                                                                    />
                                                                )}
                                                            />
                                                        }
                                                        label={
                                                            <>
                                                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                                                    สถานะ
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                    ปรับสถานะการใช้งานของผู้ใช้งาน
                                                                </Typography>
                                                            </>
                                                        }
                                                        sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                                                    />
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </CardCustom>
                            <Box
                                rowGap={1}
                                columnGap={6}
                                mt={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(1, 1fr)',
                                    lg: 'repeat(1, 1fr)',
                                }}
                            >
                                <ButtonSubmitForm
                                    cancelLabel='กลับ'
                                    submitLabel='บันทึก'
                                    loading={isLoadingGetAdminByCode || isLoadingUpdateAdmin}
                                    onCancel={() => onResetForm()}
                                />
                            </Box>
                        </Container>
                    </FormProvider>
                )
            }

        </>
    );
}

export default ProfilePreview;
