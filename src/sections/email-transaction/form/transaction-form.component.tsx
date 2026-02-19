import { Grid, Stack, Typography } from "@mui/material";

import { BaseOption } from "src/api/base/types";

import Label from "src/components/label";
import { Field } from "src/components/hook-form";

export default function TransactionFormComponent({
    values,
    listEmailTemplateOption,
    isLoading,
}: {
    values: any,
    listEmailTemplateOption: any[],
    isLoading: boolean
}) {

    return (
        <Grid container spacing={3} >
            <Grid item xs={12} md={9}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Field.Autocomplete
                            required
                            name="emailTemplateCode"
                            label="Email Template"
                            disabled={isLoading}
                            value={values?.emailTemplateCode || ''}
                            options={listEmailTemplateOption && listEmailTemplateOption?.length && listEmailTemplateOption.map(({
                                value1,
                                name,
                            }) => ({
                                id: value1,
                                name,
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
                    <Grid item xs={12} md={6}>
                        <Field.Text
                            name="emailSubject"
                            label="Subject email"
                            // value={values?.emailSubject || ''}
                            required
                            inputProps={{ maxLength: 255 }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
                <Stack spacing={1} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Label
                        sx={{ width: 100 }}
                        variant="soft"
                        color={
                            (values?.status === 'ACTIVE' && 'success') ||
                            (values?.status === 'INACTIVE' && 'warning') ||
                            (values?.status === 'SENDING' && 'success') ||
                            (values?.status === 'PENDING' && 'success') ||
                            (values?.status === 'SENDED' && 'success') ||
                            (values?.status === 'DRAFT' && 'default') ||
                            'error'
                        }
                    >
                        {
                            (values?.status === 'ACTIVE' && 'เปิดการใช้งาน') ||
                            (values?.status === 'INACTIVE' && 'ปิดการใช้งาน') ||
                            (values?.status === 'SENDING' && 'กำลังส่ง') ||
                            (values?.status === 'PENDING' && 'รอดำเนินการ') ||
                            (values?.status === 'SENDED' && 'ส่งสำเร็จ') ||
                            (values?.status === 'DRAFT' && 'แบบร่าง') ||
                            'ส่งไม่สำเร็จ'
                        }
                    </Label>

                    <Typography variant="h6" sx={{ mt: 1 }}>Transaction No : {values?.transactionNo}</Typography>

                </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
                <Field.Text
                    name="transactionDesc"
                    label="รายละเอียดเพิ่มเติม"
                    // value={values?.transactionDesc || ''}
                    inputProps={{ maxLength: 255 }}
                    multiline
                    rows={4}
                />
            </Grid>
        </Grid>
    )
}