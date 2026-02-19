import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useMemo, useState, useEffect } from 'react';

import { Grid, Divider } from "@mui/material";

import { useRouter } from 'src/routes/hooks';
import { ROOT_ADMIN } from 'src/routes/paths';

import { DAILOG_KEY, DAILOG_TITLE, ERROR_MESSAGE, DAILOG_MESSAGE } from 'src/utils/constants';
import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';

import { BaseOption } from 'src/api/base/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';
import { setDialogMessage, closeDialogMessage, setIsLoadingDailog } from 'src/slices/error-message.slices';
import { useCreateEmailTemplateMutation, useUpdateEmailTemplateMutation } from 'src/api/email-marketing.api';

import CardCustom from 'src/components/card/card-custom';
import FormProvider, { Field } from 'src/components/hook-form';
import { ButtonSubmitForm } from 'src/components/button-forom';

import { Config } from 'src/types/master-config';
import { EmailMktTemplateType, DefaultValueEmailMktTemplateType } from 'src/types/email-mkt-template.type';

import './test.css';
import FormEditor from "./form-editor";
import UploadFileAndCreateUrl from './upload-file-and-create-url';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

type Props = {
    emailMktTemplateDetail: EmailMktTemplateType;
    type: string;
}

export default function EditorMain({ emailMktTemplateDetail, type }: Props) {

    const isAdd = () => type === 'add';
    const isUpdate = () => type === 'edit';

    const router = useRouter();

    const emailEditorRef = useRef<any>(null);
    const [blockList, setBlockList] = useState<any>([]);

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [createEmailTemplate] = useCreateEmailTemplateMutation();
    const [updateEmailTemplate] = useUpdateEmailTemplateMutation();

    const { listEmailMktTemplateStatus } = useAppSelector(selectMasterData);

    const formSchema = Yup.object().shape({
        id: Yup.number(),
        emailTemplateCode: Yup.string(),
        emailTemplateName: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        emailTemplateNameEn: Yup.string(),
        fileId: Yup.number(),
        emailTemplateType: Yup.string(),
        emailTemplateDesc: Yup.string(),
        emailTemplateJson: Yup.mixed().nullable(),
        statusDesc: Yup.string(),
        createDtm: Yup.string(),
        createBy: Yup.string(),
        lastUpdateDtm: Yup.string(),
        lastUpdateBy: Yup.string(),
        emailTemplateFileName: Yup.string(),
        status: Yup.string().default('ACTIVE'),
    });

    const defaultValues = useMemo(
        () => ({
            id: emailMktTemplateDetail.id || DefaultValueEmailMktTemplateType.id,
            emailTemplateCode: emailMktTemplateDetail.emailTemplateCode || DefaultValueEmailMktTemplateType.emailTemplateCode,
            emailTemplateName: emailMktTemplateDetail.emailTemplateName || DefaultValueEmailMktTemplateType.emailTemplateName,
            emailTemplateNameEn: emailMktTemplateDetail.emailTemplateNameEn || DefaultValueEmailMktTemplateType.emailTemplateNameEn,
            fileId: emailMktTemplateDetail.fileId || DefaultValueEmailMktTemplateType.fileId,
            emailTemplateType: emailMktTemplateDetail.emailTemplateType || DefaultValueEmailMktTemplateType.emailTemplateType,
            emailTemplateDesc: emailMktTemplateDetail.emailTemplateDesc || DefaultValueEmailMktTemplateType.emailTemplateDesc,
            emailTemplateJson: emailMktTemplateDetail.emailTemplateJson || DefaultValueEmailMktTemplateType.emailTemplateJson,
            statusDesc: emailMktTemplateDetail.statusDesc || DefaultValueEmailMktTemplateType.statusDesc,
            createDtm: emailMktTemplateDetail.createDtm || DefaultValueEmailMktTemplateType.createDtm,
            createBy: emailMktTemplateDetail.createBy || DefaultValueEmailMktTemplateType.createBy,
            lastUpdateDtm: emailMktTemplateDetail.lastUpdateDtm || DefaultValueEmailMktTemplateType.lastUpdateDtm,
            lastUpdateBy: emailMktTemplateDetail.lastUpdateBy || DefaultValueEmailMktTemplateType.lastUpdateBy,
            emailTemplateFileName: emailMktTemplateDetail.emailTemplateFileName || DefaultValueEmailMktTemplateType.emailTemplateFileName,
            status: emailMktTemplateDetail.status || DefaultValueEmailMktTemplateType.status
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [emailMktTemplateDetail]
    );

    const methods = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: { ...DefaultValueEmailMktTemplateType, ...defaultValues },
    });

    const {
        reset,
        handleSubmit,
        // watch
    } = methods;

    function createElementFromHTML(htmlString: string) {
        const HTML = document.createElement('html');
        HTML.innerHTML = htmlString.trim();
        HTML.getElementsByTagName('body')[0].style.display = 'block !important';
        HTML.getElementsByTagName('body')[0].style.overflowY = 'unset !important';
        HTML.getElementsByTagName('body')[0].style.height = 'max-content !important';

        const meta = document.createElement('meta');
        meta.httpEquiv = "X-UA-Compatible";
        meta.content = "IE=edge";

        const meta2 = document.createElement('meta');
        meta2.name = "x-apple-disable-message-reformatting";

        const meta3 = document.createElement('meta');
        meta3.name = "format-detection";
        meta3.content = "telephone=no";

        HTML.getElementsByTagName('head')[0].appendChild(meta);
        HTML.getElementsByTagName('head')[0].appendChild(meta2);
        HTML.getElementsByTagName('head')[0].appendChild(meta3);

        return HTML.outerHTML;
    }

    const onSubmitForm = handleSubmit(async (dataValue) => {
        try {
            if (emailEditorRef.current?.blockList && emailEditorRef.current?.blockList?.length > 0) {
                // console.log("🚀 ~ onSubmitForm ~ emailEditorRef:", emailEditorRef)
                // const html = emailEditorRef.current.exportHtml();
                // const body = createElementFromHTML(html);
                // const blob = new Blob([body], { type: "text/html" });
                // console.log("🚀 ~ onSubmitForm ~ blob:", blob)
                // const a = document.createElement("a");
                // a.download = "email.html";
                // a.href = URL.createObjectURL(blob);
                // a.click();

                dispatch(setDialogMessage({
                    title: '',
                    message: isUpdate() ? DAILOG_MESSAGE.modify : DAILOG_MESSAGE.add,
                    open: true,
                    showSave: true,
                    showCancel: true,
                    labelOk: 'ตกลง',
                    labelCancel: 'ยกเลิก',
                    type: isUpdate() ? DAILOG_KEY.modify : DAILOG_KEY.add,
                    onOk: async () => {

                        dispatch(setIsLoadingDailog(true));

                        const formData = new FormData();
                        let timeName: any = new Date().getTime();

                        let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;

                        if (blockList === emailEditorRef.current?.blockList) {
                            // console.log("🚀 ~ onOk: ~ emailEditorRef:", emailEditorRef)
                            timeName = '';
                        }

                        if (isAdd()) {
                            formData.append('data', JSON.stringify({
                                ...dataValue,
                                lastUpdateDtm: null,
                                createDtm: null,
                                emailTemplateJson: JSON.stringify(emailEditorRef.current?.blockList),
                                emailTemplateFileName: timeName ? `${timeName}.html` : ''
                            }));
                        } else {
                            formData.append('data', JSON.stringify({
                                ...dataValue,
                                emailTemplateJson: JSON.stringify(emailEditorRef.current?.blockList),
                                emailTemplateFileName: timeName ? `${timeName}.html` : ''
                            }));
                        }

                        const html = emailEditorRef.current.exportHtml();
                        const body = createElementFromHTML(html);
                        const blob = new Blob([body], { type: "text/html" });

                        // const fileItem: File = new File([blob], 'test', { lastModified: new Date().getTime(), type: "text/html" });

                        if (timeName) {
                            formData.append('file', blob, `${timeName}.html`);
                        }

                        if (isUpdate()) {
                            dataResponse = await updateEmailTemplate(formData).unwrap();
                        } else {
                            dataResponse = await createEmailTemplate(formData).unwrap();
                        }

                        if (checkServiceResponse(dataResponse)) {
                            setTimeout(() => {
                                dispatch(setIsLoadingDailog(false));
                                dispatch(closeDialogMessage());
                                enqueueSnackbar(DAILOG_MESSAGE.success, {
                                    variant: 'success',
                                });


                                router.replace(`${ROOT_ADMIN}/email/editor/edit/${dataResponse.data.emailTemplateCode}`);
                                // router.push(`${ROOT_ADMIN}/email/editor/edit/${dataResponse.data.emailTemplateCode}`);

                            }, 200);
                        } else {
                            dispatch(setIsLoadingDailog(false));
                            dispatch(closeDialogMessage());
                            enqueueSnackbar(DAILOG_TITLE.seriveUnSuccess, {
                                variant: 'error',
                            });
                        }
                        // console.log("🚀 ~ file: editor-view.tsx:44 ~ onSubmitForm ~ dataValue:", dataValue);
                    },
                }));
            } else {
                enqueueSnackbar('กรุณาร่าง Template อย่างน้อย 1 อย่าง', {
                    variant: 'warning',
                });
            }

        } catch (error) {
            console.error(error);
            dispatch(setIsLoadingDailog(false));
            dispatch(closeDialogMessage());
            enqueueSnackbar(DAILOG_TITLE.seriveUnSuccess, {
                variant: 'error',
            });
        }

    });

    const onResetForm = () => {
        reset();
        router.back();
        // router.push(`${ROOT_ADMIN}/email/template`);
    }

    useEffect(() => {
        if (emailMktTemplateDetail?.emailTemplateJson && !isAdd()) {
            if (JSON.parse(emailMktTemplateDetail.emailTemplateJson)) {
                const arr = JSON.parse(emailMktTemplateDetail.emailTemplateJson);
                setBlockList(arr);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailMktTemplateDetail?.emailTemplateJson])

    return (
        <>



            {
                emailMktTemplateDetail && <CardCustom title='Email Template'>
                    <FormProvider methods={methods} >
                        <Grid container spacing={3} >
                            <Grid item xs={12} md={8}>
                                <Field.Text
                                    name="emailTemplateName"
                                    label="ชื่อ Email template"
                                    inputProps={{ maxLength: 255 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Field.Autocomplete
                                    required
                                    name="status"
                                    label="สถานะ"
                                    options={listEmailMktTemplateStatus && listEmailMktTemplateStatus?.length && listEmailMktTemplateStatus?.map((res: Config) => ({
                                        id: res.value1 || '',
                                        name: res.name || '',
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
                            <Grid item xs={12} md={12}>
                                <Field.Text
                                    name="emailTemplateDesc"
                                    label="รายละเอียดเพิ่มเติม"
                                    inputProps={{ maxLength: 255 }}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                    </FormProvider>

                    <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

                    <UploadFileAndCreateUrl />

                    <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

                    {
                        (emailMktTemplateDetail.id && !isAdd() && blockList.length) ? <FormEditor emailEditorRef={emailEditorRef} blockList={blockList} /> : null
                    }

                    {
                        isAdd() ? <FormEditor emailEditorRef={emailEditorRef} blockList={[]} /> : null
                    }

                    <FormProvider methods={methods} onSubmit={onSubmitForm}>
                        <ButtonSubmitForm
                            cancelLabel='กลับ'
                            submitLabel='บันทึก'
                            onCancel={() => onResetForm()}
                        />
                    </FormProvider>
                </CardCustom>
            }


        </>
    )
}