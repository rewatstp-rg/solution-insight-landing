/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ButtonSearchCriteriaShort } from 'src/components/button-search';
import FormProvider, { Field , RHFTextField } from 'src/components/hook-form';

import { useTranslate } from 'src/locales';
import { BaseOption } from 'src/api/base/types';
import { useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';

import { AdminUserSearchRequest } from 'src/types/administrator.type';
import { Config } from 'src/types/master-config';

type AdminUserSearchCriteriaProps = {
    adminUserSearchCriteria?: AdminUserSearchRequest;
    onSubmit?: (value: AdminUserSearchRequest) => void;
    onReset?: () => void;
    isLoading?: boolean;
};

export default function AdministratorSearchCriteria({ adminUserSearchCriteria, onSubmit, onReset, isLoading }: AdminUserSearchCriteriaProps) {

    const { t } = useTranslate();

    const { listUserAdminStatus } = useAppSelector(selectMasterData);


    const searchCriteriaSchema = Yup.object().shape({
        firstName: Yup.string(),
        lastName: Yup.string(),
        adminCode: Yup.string(),
        status: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            firstName: adminUserSearchCriteria?.firstName || '',
            lastName: adminUserSearchCriteria?.lastName || '',
            adminCode: adminUserSearchCriteria?.adminCode || '',
            status: adminUserSearchCriteria?.status || '',
        }),
        [adminUserSearchCriteria]
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

                {/* <RHFTextField name="adminCode" label={t('administrater.administraterSearch.adminCode')} placeholder={t('administrater.administraterSearch.adminCode')} /> */}
                <RHFTextField name="firstName" label={t('administrater.administraterSearch.fullName')} placeholder={t('administrater.administraterSearch.fullName')} />

                <Field.Autocomplete
                    name="status"
                    label={t('administrater.administraterSearch.status')}
                    value={values.status}
                    options={listUserAdminStatus && listUserAdminStatus?.length && listUserAdminStatus?.map((res: Config) => ({
                        id: res.value1 || '',
                        name: res.name || '',
                        nameEn: res.nameEn || '',
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

