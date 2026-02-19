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
import {
    DAILOG_KEY,
    DAILOG_TITLE,
    ERROR_MESSAGE,
    DAILOG_MESSAGE,
    DEFAULT_STATUS,
    DIALOG_MODE_KEY,
    PROVINCE_STATUS,
    DIALOG_MODE_TITLE
} from 'src/utils/constants';

import { BaseOption } from 'src/api/base/types';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectMasterData, setListDistrictOption } from 'src/slices/master-data.slices';
import { useSaveSubDistrictMutation, useListDistrictByProvinceCodeMutation } from 'src/api/master-data.api';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { ButtonSubmitForm } from 'src/components/button-forom';
import FormProvider, { Field, RHFTextField } from 'src/components/hook-form';

import { AlertDialogModel } from 'src/types/alert-dialog.type';
import { MasterDistrictModel, MasterProvinceSearchResponse } from 'src/types/master-config';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onSuccess: VoidFunction;
};

const SubDistrictFormDialog = ({ open, onClose, onSuccess }: Props) => {

    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();

    const { subDistrictDetailDialogMode, subDistrictDetail, listProvinceOption, listDistrictOption } = useAppSelector(selectMasterData);

    const [getListDistrictByCode] = useListDistrictByProvinceCodeMutation();
    const [saveSubDistrict, { isLoading: isLoadingUpdate }] = useSaveSubDistrictMutation();

    const isDetail = () => subDistrictDetailDialogMode === DIALOG_MODE_KEY.INQUIRY;
    const isUpdate = () => subDistrictDetailDialogMode === DIALOG_MODE_KEY.MODIFY;
    // const isAdd = () => subDistrictDetailDialogMode === DIALOG_MODE_KEY.ADD;

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    const districtSchema = Yup.object().shape({
        id: Yup.number(),
        subDistrictCode: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        districtCode: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        provinceCode: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        subDistrictNameEng: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        subDistrictNameTh: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        postcode: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        status: Yup.string(),
        statusDesc: Yup.string(),
        lastUpdateDtm: Yup.string(),
        lastUpdateBy: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            id: subDistrictDetail?.id || 0,
            provinceCode: subDistrictDetail?.provinceCode || '',
            districtCode: subDistrictDetail?.districtCode || '',
            subDistrictCode: subDistrictDetail?.subDistrictCode || '',
            subDistrictNameEng: subDistrictDetail?.subDistrictNameEng || '',
            subDistrictNameTh: subDistrictDetail?.subDistrictNameTh || '',
            postcode: subDistrictDetail?.zipcode || '',
            status: subDistrictDetail?.status || 'ACTIVE',
            statusDesc: subDistrictDetail?.statusDesc || '',
            lastUpdateDtm: subDistrictDetail?.lastUpdateDtm || '',
            lastUpdateBy: subDistrictDetail?.lastUpdateBy || ''
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [subDistrictDetail]
    );

    const methods = useForm({
        resolver: yupResolver(districtSchema),
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
                    dataResponse = await saveSubDistrict(data).unwrap();

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
        });
        reset();
    }

    const resetAsyncForm = useCallback(async () => {
        const result = subDistrictDetail;
        if (subDistrictDetailDialogMode === DIALOG_MODE_KEY.ADD) reset(defaultValues);
        reset(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset, subDistrictDetail]);


    useEffect(() => {
        resetAsyncForm();
    }, [resetAsyncForm]);

    const getListDistrictByProvinceCode = async (provinceCode: string) => {
        const model = { provinceCode };
        await getListDistrictByCode(model).unwrap();
    }

    useEffect(() => {
        if (values?.provinceCode) {
            getListDistrictByProvinceCode(values.provinceCode);
            dispatch(setListDistrictOption([]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values?.provinceCode]);

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
                        {DIALOG_MODE_TITLE[subDistrictDetailDialogMode]}
                    </DialogTitle>

                    <DialogContent>

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            ข้อมูลแขวง/ตำบล
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

                            <RHFTextField name="subDistrictCode" label="รหัสแขวง/ตำบล" inputProps={{ maxLength: 20 }} disabled={isDetail() || isUpdate()} required={!isDetail() && !isUpdate()} viewType={subDistrictDetailDialogMode} />

                            <Field.Autocomplete
                                name="provinceCode"
                                label="ชื่อจังหวัด"
                                value={values.provinceCode}
                                options={listProvinceOption && listProvinceOption?.length && listProvinceOption?.map((res: MasterProvinceSearchResponse) => ({
                                    id: res.provinceCode || '',
                                    name: res.provinceNameTh || '',
                                })) || []}
                                getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                                isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                )}
                                required={!isDetail() && !isUpdate()}
                                viewType={subDistrictDetailDialogMode}
                            />

                            <Field.Autocomplete
                                name="districtCode"
                                label="ชื่อเขต/อำเภอ"
                                value={values.districtCode}
                                options={listDistrictOption && listDistrictOption?.length && listDistrictOption?.map((res: MasterDistrictModel) => ({
                                    id: res.districtCode || '',
                                    name: res.districtNameTh || '',
                                })) || []}
                                getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                                isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.name}
                                    </li>
                                )}
                                required={!isDetail() && !isUpdate()}
                                viewType={subDistrictDetailDialogMode}
                            />

                            <RHFTextField name="subDistrictNameTh" label="ชื่อแขวง/ตำบล ภาษาไทย" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={subDistrictDetailDialogMode} />
                            <RHFTextField name="subDistrictNameEng" label="ชื่อแขวง/ตำบล ภาษาอังกฤษ" inputProps={{ maxLength: 100 }} required={!isDetail()} viewType={subDistrictDetailDialogMode} />

                            <RHFTextField name="postcode" label="รหัสไปรษณย์" inputProps={{ maxLength: 5 }} required={!isDetail()} viewType={subDistrictDetailDialogMode} />

                            {values && subDistrictDetailDialogMode !== 'inquiry' && (
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
                                                ปรับสถานะการใช้งานของแขวง/ตำบล
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
                            submitLabel={subDistrictDetailDialogMode === DIALOG_MODE_KEY.ADD ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'}
                            loading={isSubmitting || isLoadingUpdate}
                            onCancel={() => onClose()}
                        />
                    </DialogActions>
                </FormProvider>
            </Dialog>
        </>
    );
};


export default SubDistrictFormDialog;
