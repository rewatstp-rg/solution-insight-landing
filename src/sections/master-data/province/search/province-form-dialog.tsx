import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';
import { DAILOG_KEY, DAILOG_TITLE, ERROR_MESSAGE, DEFAULT_STATUS, DAILOG_MESSAGE, PROVINCE_STATUS, DIALOG_MODE_KEY, DIALOG_MODE_TITLE } from 'src/utils/constants';

import { useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';
import { useSaveProvinceMutation } from 'src/api/master-data.api';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { ButtonSubmitForm } from 'src/components/button-forom';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { AlertDialogModel } from 'src/types/alert-dialog.type';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onSuccess: VoidFunction;
};

const ProvinceFormDialog = ({ open, onClose, onSuccess }: Props) => {
    const { enqueueSnackbar } = useSnackbar();

    const { provinceDetailDialogMode, provinceDetail } = useAppSelector(selectMasterData);
    // const { listProvinceStatusOption } = useAppSelector(selectMasterData);

    const [saveProvince, { isLoading: isLoadingUpdate }] = useSaveProvinceMutation();

    const isDetail = () => provinceDetailDialogMode === DIALOG_MODE_KEY.INQUIRY;
    const isUpdate = () => provinceDetailDialogMode === DIALOG_MODE_KEY.MODIFY;
    // const isAdd = () => provinceDetailDialogMode === DIALOG_MODE_KEY.ADD;

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    const provinceSchema = Yup.object().shape({
        id: Yup.number(),
        provinceCode: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        provinceNameTh: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        provinceNameEng: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        geoId: Yup.string(),
        seq: Yup.number(),
        status: Yup.string(),
        statusDesc: Yup.string(),
        lastUpdateDtm: Yup.string(),
        lastUpdateBy: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            id: provinceDetail?.id || 0,
            provinceCode: provinceDetail?.provinceCode || '',
            provinceNameTh: provinceDetail?.provinceNameTh || '',
            provinceNameEng: provinceDetail?.provinceNameEng || '',
            geoId: provinceDetail?.geoId || '',
            seq: provinceDetail?.seq || 0,
            status: provinceDetail?.status || 'ACTIVE',
            statusDesc: provinceDetail?.statusDesc || '',
            lastUpdateDtm: provinceDetail?.lastUpdateDtm || '',
            lastUpdateBy: provinceDetail?.lastUpdateBy || ''
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [provinceDetail]
    );

    const methods = useForm({
        resolver: yupResolver(provinceSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        watch,
        control,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

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
                    dataResponse = await saveProvince(data).unwrap();

                    if (checkServiceResponse(dataResponse)) {
                        enqueueSnackbar(DAILOG_MESSAGE.success, {
                            variant: 'success',
                        });
                        setTimeout(() => {
                            onSuccess();
                        }, 500);
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

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: isUpdate() ? DAILOG_KEY.modify : DAILOG_KEY.add,
        })
    }

    const resetAsyncForm = useCallback(async () => {
        const result = provinceDetail;
        if (provinceDetailDialogMode === DIALOG_MODE_KEY.ADD) reset(defaultValues);
        reset(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, provinceDetail]);


    useEffect(() => {
        resetAsyncForm();
    }, [resetAsyncForm]);

    return (
        <>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <Dialog
                fullWidth
                maxWidth={false}
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { maxWidth: 820 },
                }}
            >
                <FormProvider methods={methods} onSubmit={onSubmit} >
                    <DialogTitle>
                        {DIALOG_MODE_TITLE[provinceDetailDialogMode]}
                    </DialogTitle>

                    <DialogContent>

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            ข้อมูลจังหวัด
                        </Typography>
                        {values && (
                            <Label
                                color={
                                    (values.status === DEFAULT_STATUS.ACTIVE && 'success') ||
                                    (values.status === DEFAULT_STATUS.INACTIVE && 'error') ||
                                    'warning'
                                }
                                sx={{ position: 'absolute', top: 24, right: 24, padding: '0px 10px', fontSize: '0.875rem' }}
                            >
                                {
                                    (values.status === DEFAULT_STATUS.ACTIVE && 'เปิดใช้งาน')
                                }
                                {
                                    (values.status === DEFAULT_STATUS.INACTIVE && 'ปิดใช้งาน')
                                }
                            </Label>
                        )}

                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >

                            <RHFTextField name="provinceCode" label="รหัสจังหวัด" inputProps={{ maxLength: 20 }} disabled={isDetail() || isUpdate()} required={!isDetail() && !isUpdate()} viewType={provinceDetailDialogMode} />

                            <RHFTextField name="provinceNameTh" label="ชื่อจังหวัด ภาษาไทย" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={provinceDetailDialogMode} />
                            <RHFTextField name="provinceNameEng" label="ชื่อจังหวัด ภาษาอังกฤษ" inputProps={{ maxLength: 13 }} required={!isDetail()} viewType={provinceDetailDialogMode} />

                            <RHFTextField name="seq" label="ลำดับ" type='number' inputProps={{ maxLength: 400 }} viewType={provinceDetailDialogMode} />

                            {values && provinceDetailDialogMode !== 'inquiry' && (
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    {...field}
                                                    checked={field.value !== PROVINCE_STATUS.INACTIVE}
                                                    onChange={(event) =>
                                                        field.onChange(event.target.checked ? PROVINCE_STATUS.ACTIVE : PROVINCE_STATUS.INACTIVE)
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
                                                ปรับสถานะการใช้งานของจังหวัด
                                            </Typography>
                                        </>
                                    }
                                    sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                                />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <ButtonSubmitForm
                            isSubmit={!isDetail()}
                            cancelLabel='ปิด'
                            submitLabel={provinceDetailDialogMode === DIALOG_MODE_KEY.ADD ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}
                            loading={isSubmitting || isLoadingUpdate}
                            onCancel={() => onClose()}
                        />
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </>
    );
};


export default ProvinceFormDialog;
