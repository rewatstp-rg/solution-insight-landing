/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';

import FormProvider, { Field } from 'src/components/hook-form';
import { ButtonSearchCriteriaShort } from 'src/components/button-search';

import { FormValue } from './defaultValue';

// ----------------------------------------------------------------------

type Props = {
    onSubmit: (e: FormValue) => void,
    onReset?: () => void,
    isLoading: boolean
}

export default function DiscountSearchCriteria({ onSubmit, onReset, isLoading }: Props) {

    const searchCriteriaSchema = Yup.object().shape({
        emailTemplateName: Yup.string(),
        status: Yup.string()
    });

    const defaultValues = useMemo(
        () => ({
            emailTemplateName: '',
            status: ''
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(searchCriteriaSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        // watch
    } = methods;

    // const values = watch();

    const onSubmitForm = handleSubmit(async (dataValue: FormValue) => {
        try {
            onSubmit(dataValue);
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

                <Field.Text name="emailTemplateName"  label="ชื่อ Email template" inputProps={{ maxLength: 100 }} />

                <ButtonSearchCriteriaShort
                    loading={isLoading}
                    onCancel={() => onResetForm()}
                />

            </Stack>

        </FormProvider>
    )
};

