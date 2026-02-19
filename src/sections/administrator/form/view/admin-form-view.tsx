
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect, useCallback } from "react";

import {
    Box,
    Grid,
    // Stack,
    // Button,
    Switch,
    Container,
    Typography,
    FormControlLabel,
} from "@mui/material";

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import {
    checkServiceResponse,
    PropsCheckServiceResponse
} from 'src/utils/check-service-response';
import {
    DAILOG_KEY,
    DAILOG_TITLE,
    ERROR_MESSAGE,
    DAILOG_MESSAGE,
    ADMIN_USER_STATUS,
    ADMIN_USER_DUPLICATE,
    ALREADY_REGISTERED_EMAIL,
} from 'src/utils/constants';

import { BaseOption } from 'src/api/base/types';
import { selectRole } from 'src/slices/role.slices';
import { useListRoleMutation } from 'src/api/role.api';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectAdministrator, setAdministratorDetail } from 'src/slices/administrator.slices';
import {
    useGetAdminByCodeMutation,
    useUpdateAdminUserMutation,
    useCreateAdminUserMutation
} from 'src/api/administrator.api';

import Label from 'src/components/label';
import CardCustom from 'src/components/card/card-custom';
import { useSettingsContext } from "src/components/settings";
import AlertDialog from 'src/components/dialog/alert-dialog';
import { ButtonSubmitForm } from 'src/components/button-forom';
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import FormProvider from 'src/components/hook-form/form-provider';
import {
    Field,
    RHFTextField,
    RHFUploadAvatar
} from 'src/components/hook-form';

import { AdminUserModel } from 'src/types/administrator.type';
import { AlertDialogModel } from 'src/types/alert-dialog.type';

// ----------------------------------------------------------------------

type Props = {
    adminCode: string;
    type: string;
};

const AdminForm = ({ adminCode, type }: Props) => {

    const isAdd = () => type === 'add';
    const isDetail = () => type === 'inquiry';
    const isUpdate = () => type === 'edit';

    const router = useRouter();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getListRole] = useListRoleMutation();
    const [getAdminByCode, { isLoading: isLoadingGetAdminByCode }] = useGetAdminByCodeMutation();
    const [updateAdmin, { isLoading: isLoadingUpdateAdmin }] = useUpdateAdminUserMutation();
    const [createAdmin, { isLoading: isLoadingCreateAdmin }] = useCreateAdminUserMutation();

    const { administratorDetail } = useAppSelector(selectAdministrator);
    const { listRole } = useAppSelector(selectRole);

    const [fileProfile, setFileProfile] = useState<File>();
    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    const administratorSchema = Yup.object().shape({
        id: Yup.number(),
        username: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        userName: Yup.string(),
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

    const defaultValues = {
        id: 0,
        username: '',
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        departmentName: '',
        createDtm: '',
        createBy: '',
        adminCode: '',
        imageProfileFileId: 0,
        lastUpdateDtm: '',
        tel: '',
        positionName: '',
        status: 'ACTIVE',
        lastUpdateBy: '',
        password: '',
        imageProfileFileName: '',
        imageProfileFileUrl: '',
        statusDesc: '',
        roleId: '',
        adminRole: [],
    }

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

    const resetForm = () => {
        reset({
            id: 0,
            username: '',
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            departmentName: '',
            createDtm: '',
            createBy: '',
            adminCode: '',
            imageProfileFileId: 0,
            lastUpdateDtm: '',
            tel: '',
            positionName: '',
            status: 'ACTIVE',
            lastUpdateBy: '',
            password: '',
            imageProfileFileName: '',
            imageProfileFileUrl: '',
            statusDesc: '',
            roleId: '',
            adminRole: [],
        });
        dispatch(setAdministratorDetail(null));
    }


    useEffect(() => {
        if (administratorDetail) {
            setValue('id', administratorDetail.id);
            setValue('username', administratorDetail.username || '');
            setValue('userName', administratorDetail.username);
            setValue('firstName', administratorDetail.firstName || '');
            setValue('lastName', administratorDetail.lastName || '');
            setValue('email', administratorDetail.email || '');
            setValue('departmentName', administratorDetail.departmentName);
            setValue('adminCode', administratorDetail.adminCode);
            setValue('imageProfileFileId', administratorDetail.imageProfileFileId);
            setValue('tel', administratorDetail.tel || '');
            setValue('positionName', administratorDetail.positionName);
            setValue('status', administratorDetail.status || 'ACTIVE');
            setValue('imageProfileFileName', administratorDetail.imageProfileFileName);
            setValue('statusDesc', administratorDetail.statusDesc);
            setValue('roleId', administratorDetail.roleId);
            setValue('adminRole', administratorDetail.adminRole || []);
        } else {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, administratorDetail]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setDialogMessage({
                title: '',
                message: isUpdate() ? DAILOG_MESSAGE.modify : DAILOG_MESSAGE.add,
                open: true,
                showSave: true,
                showCancel: true,
                labelOk: 'ตกลง',
                labelCancel: 'ยกเลิก',
                type: isUpdate() ? DAILOG_KEY.modify : DAILOG_KEY.add,
                onOk: async () => {

                    onCloseDialogAlert();

                    let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                    if (data?.roleId && listRole?.length > 0) {
                        const role = listRole?.find((x: any) => x.id === data?.roleId);
                        const listRoleSave: any = [{
                            id: data?.adminRole && data?.adminRole.length > 0 ? data.adminRole[0].id : 0,
                            "userCode": "",
                            "roleId": role.id,
                            "roleName": role.name
                        }];

                        data.adminRole = [];
                        data.adminRole = listRoleSave;
                    }

                    // data.username = data.userName;

                    const formData = new FormData();
                    formData.append('data', JSON.stringify({ ...data, imageProfileFileUrl: '' }));

                    if (fileProfile) {
                        formData.append(fileProfile.name, fileProfile);
                    }

                    if (isUpdate()) {
                        dataResponse = await updateAdmin(formData).unwrap();
                    } else {
                        dataResponse = await createAdmin(formData).unwrap();
                    }

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
        resetForm();
        router.back();
    }
    // form submit

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: isUpdate() ? DAILOG_KEY.modify : DAILOG_KEY.add,
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

    const listOption = async () => {
        await getListRole();
    }

    const loadContent = async () => {

        listOption();
        if (adminCode && !isAdd()) {
            const adminModel: AdminUserModel = {} as AdminUserModel;
            adminModel.adminCode = adminCode;
            await getAdminByCode(adminModel).unwrap();
        }

        // getPathImageByfile64(generateDocumentDetail?.fileResponse);
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (administratorDetail?.imageProfileFileUrl) {
            setValue('imageProfileFileUrl', administratorDetail.imageProfileFileUrl, { shouldValidate: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [administratorDetail]);

    return (
        <>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                    <CustomBreadcrumbs
                        heading="ข้อมูลผู้ดูแลระบบ"
                        links={[
                            { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                            { name: 'ผู้ดูแลระบบ' },
                            { name: isAdd() ? 'เพิ่มผู้ดูแลระบบ' : adminCode },
                            { name: isAdd() ? 'ข้อมูลผู้ดูแลระบบ' : '' },
                        ]}
                        sx={{
                            mb: { xs: 3, md: 5 },
                        }}
                    />
                    <CardCustom title='ข้อมูลผู้ดูแลระบบ'>
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
                                                maxSize={3145728}
                                                onDrop={handleDrop}
                                                disabled={isDetail()}
                                                helperText={
                                                    isDetail() ? null : (
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
                                                            <br /> ขนาดไฟล์สูง {fData(3145728)}
                                                        </Typography>
                                                    )
                                                }
                                            />
                                        </Box>
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
                                        {
                                            !isAdd() && (
                                                <RHFTextField name="adminCode" label="รหัสผู้ดูแลระบบ" inputProps={{ maxLength: 20 }} disabled viewType={type} />
                                            )
                                        }

                                        <Field.Text name="username" label="ชื่อผู้เข้าใช้งานระบบ" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={type} disabled={(values?.id !== 0)} />
                                        <Field.Text name="firstName" label="ชื่อ" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={type} />
                                        <RHFTextField name="lastName" label="นามสกุล" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={type} />
                                        <RHFTextField name="email" label="อีเมล" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={type} />
                                        <RHFTextField name="tel" label="เบอร์โทรศัพท์" inputProps={{ maxLength: 50 }} required={!isDetail()} viewType={type} />

                                        <Field.Autocomplete
                                            viewType={type}
                                            required={!isDetail()}
                                            name="roleId"
                                            label="ระดับการเข้าถึงข้อมูล"
                                            value={values.roleId}
                                            options={listRole?.map((role: any) => ({ id: role.id, name: role.roleName }))}
                                            getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                                            isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.name}
                                                </li>
                                            )}
                                        />

                                        {values && !isDetail() && (
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
                            isSubmit={!isDetail()}
                            cancelLabel='กลับ'
                            submitLabel='บันทึก'
                            loading={isLoadingGetAdminByCode || isLoadingUpdateAdmin || isLoadingCreateAdmin}
                            onCancel={() => onResetForm()}
                        />
                    </Box>
                </Container>
            </FormProvider>
        </>
    );
}

export default AdminForm;
