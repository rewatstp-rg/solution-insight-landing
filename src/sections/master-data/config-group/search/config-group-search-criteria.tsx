/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';

import { BaseOption } from 'src/api/base/types';

import { ButtonSearchCriteriaShort } from 'src/components/button-search';
import FormProvider, { Field, RHFTextField } from 'src/components/hook-form';

import { useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';

import { ConfigGroup, ConfigGroupSearchRequest } from 'src/types/master-config';

type DistrictSearchCriteriaProps = {
    dataCriteria?: ConfigGroupSearchRequest;
    onSubmit?: (value: ConfigGroupSearchRequest) => void;
    onReset?: () => void;
    isLoading?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export default function SubDistrictSearchCriteria({ dataCriteria, onSubmit, onReset, isLoading }: DistrictSearchCriteriaProps) {

    const { listAllListboxGroup } = useAppSelector(selectMasterData);

    const searchCriteriaSchema = Yup.object().shape({
        listboxGroupDesc: Yup.string(),
        listboxGroup: Yup.string(),
        status: Yup.string(),
    });

    const defaultValues = useMemo(
        () => ({
            listboxGroupDesc: dataCriteria?.listboxGroupDesc || '',
            listboxGroup: dataCriteria?.listboxGroup || '',
            status: dataCriteria?.status || '',
        }),
        [dataCriteria]
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
                <Field.Autocomplete
                    name="listboxGroup"
                    label="Config Group type"
                    value={values.listboxGroup}
                    options={listAllListboxGroup && listAllListboxGroup?.length > 0 && listAllListboxGroup.map(({ listboxGroup, listboxGroupDesc }: ConfigGroup) => (
                        {
                            id: listboxGroup,
                            name: listboxGroupDesc
                        })
                    ) || []}
                    getOptionLabel={(option: BaseOption['name']) => option.name || ''}
                    isOptionEqualToValue={(option: BaseOption, value: BaseOption) => option?.name === value?.name}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                />

                <RHFTextField name="listboxGroupDesc" label="รายละเอียด" placeholder='รายละเอียด' />

                <ButtonSearchCriteriaShort
                    loading={isLoading}
                    onCancel={() => onResetForm()}
                />

            </Stack>
        </FormProvider>
    )
};

