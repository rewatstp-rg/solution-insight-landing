/* eslint-disable perfectionist/sort-imports */
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';
// import { DesktopDatePicker } from '@mui/x-date-pickers';

import { BaseOption } from 'src/api/base/types';
import { useAppSelector } from 'src/store/hooks';
import { selectMasterData } from 'src/slices/master-data.slices';

import FormProvider, { Field } from 'src/components/hook-form';
import { ButtonSearchCriteriaShort } from 'src/components/button-search';

import { Config } from 'src/types/master-config';
import { EmailMktTransactionSearchType, createDefaultEmailMktTransactionSearch } from 'src/types/email-mkt-transaction.model';

// ----------------------------------------------------------------------

type Props = {
    onSubmit?: (e: EmailMktTransactionSearchType) => void,
    onReset?: () => void,
    isLoading: boolean
}

export default function EmailTransactionSearchCriteria({ onSubmit, onReset, isLoading }: Props) {

    const { listEmailTransectionStatus } = useAppSelector(selectMasterData);

    const searchCriteriaSchema = Yup.object().shape({
        transactionNo: Yup.string().default(''),
        emailTemplateCode: Yup.string().default(''),
        dateForm: Yup.date().nullable().default(null),
        dateTo: Yup.date().nullable().default(null),
        status: Yup.string().default(''),
        pageNo: Yup.number().default(1),
        pageSize: Yup.number().default(10)
    });

    const defaultValues = useMemo(
        () => ({
            transactionNo: createDefaultEmailMktTransactionSearch().transactionNo || '',
            emailTemplateCode: createDefaultEmailMktTransactionSearch().emailTemplateCode || '',
            status: createDefaultEmailMktTransactionSearch().status || '',
            dateForm: createDefaultEmailMktTransactionSearch().dateForm || null,
            dateTo: createDefaultEmailMktTransactionSearch().dateTo || null,
            pageNo: 1,
            pageSize: 10
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(searchCriteriaSchema),
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        // watch
    } = methods;

    // const values = watch();

    const onSubmitForm = handleSubmit(async (dataValue) => {
        try {
            onSubmit?.(dataValue);
        } catch (error) {
            console.error(error);
        }
    });

    const onResetForm = () => {
        reset(createDefaultEmailMktTransactionSearch());
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

                <Field.Text 
                name="transactionNo" 
                // value={values.transactionNo} 
                label="Transaction No." 
                inputProps={{ maxLength: 100 }} />

                {/* <DesktopDatePicker
                    sx={{ mb: 0, mt: 0 }}
                    label="วันที่เริ่ม"
                    value={values.dateForm}
                    onChange={(newValue) => {
                        setValue('dateForm', newValue);
                    }}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            size: 'medium'
                        },
                    }}
                />

                <DesktopDatePicker
                    sx={{ mb: 0, mt: 0 }}
                    label="วันที่สิ้นสุด"
                    value={values.dateTo}
                    minDate={values.dateForm}
                    onChange={(newValue) => {
                        setValue('dateTo', newValue);
                    }}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            margin: 'normal',
                            size: 'medium'
                        },
                    }}
                /> */}

                <Field.Autocomplete
                    name="status"
                    label="สถานะ"
                    options={listEmailTransectionStatus && listEmailTransectionStatus?.length && listEmailTransectionStatus?.map((res: Config) => ({
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

