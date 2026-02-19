
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { Box, Grid, Stack, Dialog, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// import { useRouter } from 'src/routes/hooks';

import {
    DAILOG_KEY,
    ERROR_MESSAGE,
    DAILOG_MESSAGE
} from 'src/utils/constants';
import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';
import { enqueueSnackbarErrorComponent, enqueueSnackbarSuccessComponent } from 'src/utils/enqueueSnackbarComponent';

import { BaseOption } from 'src/api/base/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';
import { useCreateEmailTransactionMutation } from 'src/api/email-marketing.api';
import { setLoadingState, setDialogMessage, closeDialogMessage } from 'src/slices/error-message.slices';

import { Field, RHFUpload } from 'src/components/hook-form';
import { ButtonSubmitForm } from 'src/components/button-forom';
import FormProvider from 'src/components/hook-form/form-provider';

import { EmailMktTransactionType, createDefaultEmailMktTransaction } from 'src/types/email-mkt-transaction.model';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onSuccess: VoidFunction;
};

const ImportDialog = ({ open, onClose, onSuccess }: Props) => {

    // const router = useRouter();
    const dispatch = useAppDispatch();

    const [uploadFile] = useCreateEmailTransactionMutation();

    const { listEmailTemplateOption } = useAppSelector(selectMasterData);

    const [isLoading, setIsLoading] = useState(false);

    const importDataSchema = Yup.object().shape({
        id: Yup.number().default(0),
        transactionNo: Yup.string().default(''),
        transactionFileId: Yup.number().default(0),
        transactionFileName: Yup.string().default(''),
        emailTemplateCode: Yup.string().default('').required(ERROR_MESSAGE.REQUIRED),
        emailTemplateName: Yup.string().default(''),
        emailSubject: Yup.string().default('').required(ERROR_MESSAGE.REQUIRED),
        transactionDesc: Yup.string().default(''),
        sendEmailDateTime: Yup.string().default(''),
        status: Yup.string().default(''),
        createDtm: Yup.date().default(null).nullable(),
        createBy: Yup.string().default(''),
        lastUpdateDtm: Yup.date().default(null).nullable(),
        lastUpdateBy: Yup.string().default(''),
        statusDesc: Yup.string().default(''),
        fileUpload: Yup.array().min(1, ERROR_MESSAGE.REQUIRED).max(1, 'แนบเอกสารได้แค่ 1 ไฟล์'),
    });

    const defaultValues = useMemo(
        () => ({
            id: 0,
            transactionNo: '',
            transactionFileId: 0,
            transactionFileName: '',
            emailTemplateCode: '',
            emailTemplateName: '',
            emailSubject: '',
            transactionDesc: '',
            sendEmailDateTime: '',
            status: '',
            createDtm: null,
            createBy: '',
            lastUpdateDtm: null,
            lastUpdateBy: '',
            statusDesc: '',
            fileUpload: []
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const methods = useForm({
        resolver: yupResolver(importDataSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        watch,
        setValue
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {

        try {
            dispatch(setDialogMessage({
                title: '',
                message: DAILOG_MESSAGE.add,
                open: true,
                showSave: true,
                showCancel: true,
                labelOk: 'ตกลง',
                labelCancel: 'ยกเลิก',
                type: DAILOG_KEY.add,
                onOk: async () => {
                    dispatch(setLoadingState(true));
                    dispatch(closeDialogMessage());
                    // dispatch(setIsLoadingDailog(true));
                    const importUploadModel: EmailMktTransactionType = {
                        ...createDefaultEmailMktTransaction(),
                        id: 0,
                        emailTemplateCode: data.emailTemplateCode,
                        emailSubject: data.emailSubject,
                        transactionDesc: data.transactionDesc,
                        transactionFileName: '',
                        status: 'DRAFT',
                    }

                    const formData = new FormData();

                    if (data?.fileUpload) {

                        data?.fileUpload?.forEach((file: any) => {
                            importUploadModel.transactionFileName = file.name;
                        });

                        formData.append('file', data.fileUpload[0]);
                    }

                    formData.append('data', JSON.stringify(importUploadModel));

                    console.log("🚀 ~ file: import-dialog.tsx:163 ~ onSubmit ~ importUploadModel:", importUploadModel);

                    let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                    dataResponse = await uploadFile(formData).unwrap();

                    if (checkServiceResponse(dataResponse)) {
                        if (dataResponse?.data?.status === 'FILE_UPLOAD_NAME_INVALID') {
                            enqueueSnackbar('ไม่พบ File Name กรุณาลองอีกครั้ง', {
                                variant: 'warning',
                            });
                        } else if (dataResponse?.data?.status === 'INVALID_FILE_UPLOAD_DATA') {
                            enqueueSnackbar('ไม่พบข้อมูล กรุณาลองอีกครั้ง', {
                                variant: 'warning',
                            });
                        } else {

                            enqueueSnackbarSuccessComponent();

                            setTimeout(() => {
                                setIsLoading(false);
                                dispatch(setLoadingState(false));
                                enqueueSnackbar(DAILOG_MESSAGE.success, {
                                    variant: 'success',
                                });
                                onSuccess();
                            }, 500);
                        }

                    } else {
                        enqueueSnackbarErrorComponent();

                        setIsLoading(false);
                    }
                },
            }));
        } catch (error) {
            console.error(error);
        }
    });

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            setValue('fileUpload', [...newFiles], {
                shouldValidate: true,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setValue, values.fileUpload]
    );

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.upload,
        });
    }

    const closeDialog = () => {
        onCloseDialogAlert();
        onClose();
        reset({ ...defaultValues, });
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dialog
            fullWidth
            maxWidth={false}
            open={open}
            PaperProps={{
                sx: { maxWidth: 900 },
            }}
        >

            <FormProvider methods={methods} onSubmit={onSubmit} >
                <DialogTitle>
                    อัปโหลดเอกสาร
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 3 }}>
                        *โปรดตัวสอบรายละเอียดเเละความถูกต้องของข้อมูลก่อนอัพโหลดไฟล์เอกสารเข้าระบบ
                    </Typography>
                    <Stack spacing={2}>
                        <Grid container spacing={3} >
                            <Grid item xs={12} md={6}>
                                <Field.Autocomplete
                                    required
                                    name="emailTemplateCode"
                                    label="Email Template"
                                    disabled={isLoading}
                                    value={values?.emailTemplateCode || ''}
                                    options={listEmailTemplateOption && listEmailTemplateOption?.length && listEmailTemplateOption.map(({
                                        value1,
                                        name,
                                    }) => ({
                                        id: value1,
                                        name,
                                    })) || []}
                                    getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                                    isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.name}
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Field.Text
                                    name="emailSubject"
                                    label="Subject email"
                                    inputProps={{ maxLength: 255 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Field.Text
                                    name="transactionDesc"
                                    label="รายละเอียดเพิ่มเติม"
                                    inputProps={{ maxLength: 255 }}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                    </Stack>

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                                lg: 'repeat(1, 1fr)',
                            }}
                        >
                            <RHFUpload
                                multiple
                                disabled={isLoading}
                                thumbnail
                                accept={{ 'application/vnd.ms-excel': ['.xlsx', '.xls'] }}
                                name="fileUpload"
                                // maxSize={1024000}
                                onDrop={handleDrop}
                                onRemove={(inputFile) =>
                                    setValue(
                                        'fileUpload',
                                        values.fileUpload && values.fileUpload?.filter((file) => file !== inputFile),
                                        { shouldValidate: true }
                                    )
                                }
                                onRemoveAll={() => setValue('fileUpload', [], { shouldValidate: true })}
                            // onUpload={() => console.info('ON UPLOAD')}
                            />
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <ButtonSubmitForm
                        cancelLabel='ยกเลิก'
                        submitLabel='อัพโหลดเอกสาร'
                        loading={isLoading}
                        onCancel={() => closeDialog()}
                    />
                </DialogActions>
            </FormProvider>

        </Dialog>
    )
};

export default ImportDialog;
