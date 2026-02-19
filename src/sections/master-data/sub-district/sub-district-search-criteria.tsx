/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';

import { ButtonSearchCriteriaShort } from 'src/components/button-search';
import FormProvider, {
    Field,
    RHFTextField
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import { BaseOption } from 'src/api/base/types';
import { selectMasterData, setListDistrictOption } from 'src/slices/master-data.slices';
import { useListDistrictByProvinceCodeMutation } from 'src/api/master-data.api';

import { MasterDistrictModel, MasterDistrictSearchRequest, MasterProvinceSearchResponse } from 'src/types/master-config';

type DistrictSearchCriteriaProps = {
    districtSearchCriteria?: MasterDistrictSearchRequest;
    onSubmit?: (value: MasterDistrictSearchRequest) => void;
    onReset?: () => void;
    isLoading?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export default function SubDistrictSearchCriteria({ districtSearchCriteria, onSubmit, onReset, isLoading }: DistrictSearchCriteriaProps) {

    const { t } = useTranslate();
    const dispatch = useAppDispatch();

    const { listProvinceOption, listDistrictOption } = useAppSelector(selectMasterData);

    const [getListDistrictByCode] = useListDistrictByProvinceCodeMutation();

    const searchCriteriaSchema = Yup.object().shape({
        provinceCode: Yup.string(),
        provinceName: Yup.string(),
        districtCode: Yup.string(),
        districtName: Yup.string(),
        postcode: Yup.string(),
        status: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            provinceCode: districtSearchCriteria?.provinceCode || '',
            provinceName: districtSearchCriteria?.provinceName || '',
            districtCode: districtSearchCriteria?.districtCode || '',
            districtName: districtSearchCriteria?.districtName || '',
            postcode: districtSearchCriteria?.postcode || '',
            status: districtSearchCriteria?.status || '',
        }),
        [districtSearchCriteria]
    );

    const methods = useForm({
        resolver: yupResolver(searchCriteriaSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
    } = methods;

    const values = watch();

    const onSubmitForm = handleSubmit(async (data: any) => {
        try {
            onSubmit?.(await data);
        } catch (error) {
            console.error(error);
        }
    });

    const onResetForm = () => {
        reset();
        onReset?.();
    }

    const getListDistrictByProvinceCode = async (provinceCode: string) => {
        await getListDistrictByCode({ provinceCode }).unwrap();
    }

    useEffect(() => {
        if (values?.provinceCode) {
            getListDistrictByProvinceCode(values.provinceCode);
            dispatch(setListDistrictOption([]));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values?.provinceCode]);

    return (
        <FormProvider methods={methods} onSubmit={onSubmitForm}>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-end', md: 'center' }}
                direction={{
                    xs: 'column',
                    md: 'row',
                }}
                sx={{
                    p: 2.5,
                    pr: { xs: 2.5, md: 1 },
                }}
            >

                <Field.Autocomplete
                    name="provinceCode"
                    label={t('masterData.province.provinceName')}
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
                />

                <Field.Autocomplete
                    name="districtCode"
                    label='แขวง/ตำบล'
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
                />


                <RHFTextField name="postcode" label={t('masterData.subDistrict.zipCode')} placeholder={t('masterData.subDistrict.zipCode')} />

                <ButtonSearchCriteriaShort
                    loading={isLoading}
                    onCancel={() => onResetForm()}
                />

            </Stack>
        </FormProvider>
    )
};

