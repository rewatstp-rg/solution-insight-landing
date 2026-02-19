import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Box,
    Grid,
    Button,
    Container,
    Typography,
    CircularProgress
} from "@mui/material";

import { useRouter } from "src/routes/hooks";
import { ROOT_ADMIN } from "src/routes/paths";

import { DAILOG_KEY, ERROR_MESSAGE, DAILOG_MESSAGE } from 'src/utils/constants';
import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';
import { enqueueSnackbarErrorComponent, enqueueSnackbarSuccessComponent } from 'src/utils/enqueueSnackbarComponent';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';
import { seleceEmailMarketingModel } from 'src/slices/email-marketing.slices';
import { setLoadingState, setDialogMessage, closeDialogMessage } from 'src/slices/error-message.slices';
import {
    useSendExampleEmailMutation,
    useListEmailTemplateMutation,
    useGetEmailTransactionMutation,
    useUpdateEmailTransactionMutation
} from "src/api/email-marketing.api";

import CardCustom from "src/components/card/card-custom";
import { useSettingsContext } from "src/components/settings";
import { ButtonSubmitForm } from 'src/components/button-forom';
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import FormProvider, { Field, RHFMobileDateTimePicker } from 'src/components/hook-form';

import { EmailMktTransactionType, createDefaultEmailMktTransaction } from "src/types/email-mkt-transaction.model";

import TransactionTempTable from "../transaction-temp.table";
import TransactionInfoComponent from "../transaction-info.component";
import TransactionFormComponent from '../transaction-form.component';

type Prop = {
    type: string;
    transactionNo: string;
};
export default function EmailTransactionFormView({ type, transactionNo }: Prop) {

    // const isAdd = () => type === 'add';
    const isDetail = () => type === 'inquiry';
    // const isUpdate = () => type === 'edit';

    const router = useRouter();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [isLoading, setIsLoading] = useState(false);
    const [headerColumns, setHeaderColumns] = useState<any>([]);
    const [dataDetall, setDataDetall] = useState<any>(null);
    const [isLoadingSendExampleEmail, setIsLoadingSendExampleEmail] = useState(false);

    const [sendExampleEmail] = useSendExampleEmailMutation();
    const [listEmailTemplate] = useListEmailTemplateMutation();
    const [updateEmailTran] = useUpdateEmailTransactionMutation();
    const [getEmailTranInfo, { isLoading: isLoadingEmailTran }] = useGetEmailTransactionMutation();

    const { listEmailTemplateOption } = useAppSelector(selectMasterData);
    const { emailTransactionInfo } = useAppSelector(seleceEmailMarketingModel);
    // console.log("🚀 ~ file: email-transaction-form-view.tsx:55 ~ EmailTransactionFormView ~ emailTransactionInfo:", emailTransactionInfo)

    const importDataSchema = Yup.object().shape({
        id: Yup.number().default(0),
        transactionNo: Yup.string().default(''),
        transactionFileId: Yup.number().default(0),
        transactionFileName: Yup.string().default(''),
        emailTemplateCode: Yup.string().default('').when(['status'], {
            is: (status: string) => (status === 'DRAFT' || status === 'PENDING'),
            then: () => Yup.string().required(ERROR_MESSAGE.REQUIRED),
            otherwise: () => Yup.string()
        }),
        emailTemplateName: Yup.string().default(''),
        emailSubject: Yup.string().default('').default('').when(['status'], {
            is: (status: string) => (status === 'DRAFT' || status === 'PENDING'),
            then: () => Yup.string().required(ERROR_MESSAGE.REQUIRED),
            otherwise: () => Yup.string()
        }),
        transactionDesc: Yup.string().default(''),
        status: Yup.string().default(''),
        sendEmailDateTime: Yup.date().default(null).nullable().transform((curr, orig) => (orig === undefined || orig === '' || orig === 'Invalid Date') ? null : curr),
        createDtm: Yup.date().default(null).nullable(),
        createBy: Yup.string().default(''),
        lastUpdateDtm: Yup.date().default(null).nullable(),
        lastUpdateBy: Yup.string().default(''),
        statusDesc: Yup.string().default(''),
        sentToExampleEmail: Yup.string().default(''),
        fileUpload: Yup.array(),
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
            sendEmailDateTime: null,
            status: '',
            createDtm: null,
            createBy: '',
            lastUpdateDtm: null,
            lastUpdateBy: '',
            statusDesc: '',
            sentToExampleEmail: '',
            fileUpload: []
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [emailTransactionInfo, isLoadingEmailTran, emailTransactionInfo?.id]
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
                message: DAILOG_MESSAGE.modify,
                open: true,
                showSave: true,
                showCancel: true,
                labelOk: 'ตกลง',
                labelCancel: 'ยกเลิก',
                type: DAILOG_KEY.modify,
                onOk: async () => {

                    dispatch(setLoadingState(true));
                    dispatch(closeDialogMessage());
                    const importUploadModel: EmailMktTransactionType = {
                        ...createDefaultEmailMktTransaction(),
                        ...data,
                        sentToExampleEmail: ''
                    }

                    // const formData = new FormData();

                    // if (data?.fileUpload && data?.fileUpload?.length > 0) {

                    //     data?.fileUpload?.forEach((file: any) => {
                    //         importUploadModel.transactionFileName = file.name;
                    //     });

                    //     formData.append('file', data.fileUpload[0]);
                    // }

                    // formData.append('data', JSON.stringify(importUploadModel));

                    let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                    dataResponse = await updateEmailTran(importUploadModel).unwrap();

                    if (checkServiceResponse(dataResponse)) {
                        if (dataResponse?.data?.status === 'FILE_UPLOAD_NAME_INVALID') {
                            enqueueSnackbar('ไม่พบ File Name กรุณาลองอีกครั้ง', {
                                variant: 'warning',
                            });
                            dispatch(setLoadingState(false));
                        } else if (dataResponse?.data?.status === 'INVALID_FILE_UPLOAD_DATA') {
                            enqueueSnackbar('ไม่พบข้อมูล กรุณาลองอีกครั้ง', {
                                variant: 'warning',
                            });
                            dispatch(setLoadingState(false));
                        } else {

                            enqueueSnackbarSuccessComponent();
                            dispatch(setLoadingState(false));
                            setTimeout(() => {
                                setIsLoading(false);
                                router.back();
                            }, 500);
                        }

                    } else {
                        enqueueSnackbarErrorComponent();
                        setIsLoading(false);
                        dispatch(setLoadingState(false))
                    }
                },
            }));

        } catch (error) {
            console.error(error);
        }
    });

    const loadContent = async () => {
        if (transactionNo) {
            await listEmailTemplate();
            const modelFileUploadTempData: EmailMktTransactionType = { ...createDefaultEmailMktTransaction(), transactionNo };
            await getEmailTranInfo(modelFileUploadTempData).unwrap().then((res) => {
                // console.log("🚀 ~ file: email-transaction-form-view.tsx:197 ~ awaitgetEmailTranInfo ~ res:", res)
                if (res) {
                    setDataDetall(res);
                    if (res?.header) {
                        setHeaderColumns(res.header);
                    }

                    // console.log("🚀 ~ file: email-transaction-form-view.tsx:199 ~ awaitgetEmailTranInfo ~ res:", res.emailSubject);

                    setValue('id', res.id);
                    setValue('emailTemplateCode', res.emailTemplateCode);
                    setValue('emailTemplateName', res.emailTemplateName);
                    setValue('emailSubject', res.emailSubject);
                    setValue('status', res.status);
                    setValue('transactionDesc', res.transactionDesc);
                    setValue('transactionFileId', res.transactionFileId);
                    setValue('transactionNo', res.transactionNo);
                    setValue('sendEmailDateTime', res.sendEmailDateTime);
                    setValue('sentToExampleEmail', '');
                }
            });
        }
    }

    const onResetForm = () => {
        reset(createDefaultEmailMktTransaction());
        router.back();
    }

    const handleSendExampleEmail = () => {

        dispatch(setDialogMessage({
            title: '',
            message: 'ยืนยันการส่งอีเมล',
            open: true,
            showSave: true,
            showCancel: true,
            labelOk: 'ตกลง',
            labelCancel: 'ยกเลิก',
            type: 'alert',
            onOk: async () => {
                dispatch(setLoadingState(true));
                dispatch(closeDialogMessage());
                setIsLoadingSendExampleEmail(true);

                const modelToSend = {
                    ...dataDetall,
                    sentToExampleEmail: values.sentToExampleEmail
                }

                // console.log("🚀 ~ file: email-transaction-form-view.tsx:283 ~ onOk: ~ modelToSend:", modelToSend)

                let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                dataResponse = await sendExampleEmail(modelToSend).unwrap();

                if (checkServiceResponse(dataResponse)) {
                    enqueueSnackbar('ส่งอีเมลสําเร็จ', {
                        variant: 'success',
                    });
                    setValue('sentToExampleEmail', '');
                    dispatch(setLoadingState(false));
                    setIsLoadingSendExampleEmail(false);
                } else {
                    enqueueSnackbarErrorComponent();
                    setValue('sentToExampleEmail', '');
                    dispatch(setLoadingState(false));
                    setIsLoadingSendExampleEmail(false);
                }
                dispatch(setLoadingState(false));
            },
        }));
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionNo])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading='Transaction Information' links={[
                    { name: 'Email Transaction', href: `${ROOT_ADMIN}/email/transaction` },
                    { name: transactionNo },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            {
                !isLoadingEmailTran ? (
                    <FormProvider methods={methods} onSubmit={onSubmit} >
                        {
                            (isDetail() || emailTransactionInfo?.status === 'SENDING' || emailTransactionInfo?.status === 'SENDED') ?
                                (
                                    <Grid container spacing={3}>
                                        <CardCustom title='Transaction Information'>
                                            <TransactionInfoComponent />
                                        </CardCustom>
                                    </Grid>
                                ) : (
                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <CardCustom title='List Email Transaction Information'>
                                            <TransactionFormComponent values={values} listEmailTemplateOption={listEmailTemplateOption} isLoading={isLoading} />
                                        </CardCustom>
                                    </Grid>
                                )
                        }
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <CardCustom title='Email Transaction'>
                                <TransactionTempTable
                                    headerColumns={headerColumns}
                                />
                            </CardCustom>
                        </Grid>
                        <Grid container spacing={3}>
                            <CardCustom title='Setting Send email'>
                                <Grid container xs={12} md={12} spacing={3}>
                                    <Grid item xs={12} md={4} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            ตั้งเวลาที่ต้องการส่ง
                                            {/* <span style={{ color: 'red' }}>*</span> */}
                                        </Typography>
                                        <RHFMobileDateTimePicker
                                            minDate={new Date()}
                                            viewType={type}
                                            name="sendEmailDateTime"
                                            label=""
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                            Email สำหรับส่งทดสอบ
                                        </Typography>
                                        <Field.Text
                                            name="sentToExampleEmail"
                                            label=""
                                            // value={values?.sentToExampleEmail || ''}
                                            required
                                            inputProps={{ maxLength: 255 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ mb: 3, justifyContent: 'flex-start !important', display: 'flex !important', alignItems: 'center !important' }}>
                                        <Box sx={{ marginTop: '32px' }}>
                                            <Button
                                                disabled={isLoadingSendExampleEmail}
                                                startIcon={
                                                    isLoadingSendExampleEmail && <CircularProgress color="inherit" size={24} />
                                                }
                                                sx={{ minWidth: 100 }}
                                                color="success"
                                                size='medium'
                                                type="button"
                                                variant="contained" onClick={() => handleSendExampleEmail()}>
                                                ทดสอบส่งอีเมล
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardCustom>
                        </Grid>
                        <ButtonSubmitForm
                            cancelLabel='กลับ'
                            submitLabel='บันทึก'
                            isSubmit={!isDetail()}
                            onCancel={() => onResetForm()}
                        />
                    </FormProvider>
                ) : null
            }

        </Container>
    )
}