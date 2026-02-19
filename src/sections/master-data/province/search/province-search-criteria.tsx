/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';

import FormProvider, { Field } from 'src/components/hook-form';
import { ButtonSearchCriteriaShort } from 'src/components/button-search';

import { useTranslate } from 'src/locales';
import { BaseOption } from 'src/api/base/types';
import { useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';

import { Config, MasterProvinceSearchRequest, MasterProvinceSearchResponse } from 'src/types/master-config';

type ProvinceSearchCriteriaProps = {
    provinceSearchCriteria?: MasterProvinceSearchRequest;
    onSubmit?: (value: MasterProvinceSearchRequest) => void;
    onReset?: () => void;
    isLoading?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export default function ProvinceSearchCriteria({ provinceSearchCriteria, onSubmit, onReset, isLoading }: ProvinceSearchCriteriaProps) {

    const { t } = useTranslate();

    const { listProvinceStatusOption, listProvinceOption } = useAppSelector(selectMasterData);

    const searchCriteriaSchema = Yup.object().shape({
        provinceCode: Yup.string(),
        provinceName: Yup.string(),
        status: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            provinceCode: provinceSearchCriteria?.provinceCode || '',
            provinceName: provinceSearchCriteria?.provinceName || '',
            status: provinceSearchCriteria?.status || '',
        }),
        [provinceSearchCriteria]
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

                {/* <RHFTextField name="provinceName" label="ชื่อจังหวัด" placeholder='ชื่อจังหวัด' /> */}

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
                    name="status"
                    label={t('masterData.province.status')}
                    value={values.status}
                    options={listProvinceStatusOption && listProvinceStatusOption?.length && listProvinceStatusOption?.map((res: Config) => ({
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

                <ButtonSearchCriteriaShort
                    loading={isLoading}
                    onCancel={() => onResetForm()}
                />

            </Stack>
        </FormProvider>
    )
};

