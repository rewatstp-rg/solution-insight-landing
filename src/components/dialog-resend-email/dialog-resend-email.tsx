import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';

import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog, { dialogClasses } from '@mui/material/Dialog';
import { Box, Stack, DialogActions, DialogContent } from "@mui/material";

import Logo from "src/components/logo";
import FormProvider, { RHFTextField } from 'src/components/hook-form';

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onSubmitEmail: ({ email }: { email: string }) => void;
    defaultEmail: string;
}
const DialogResendEmail = ({ open, onClose, defaultEmail, onSubmitEmail }: Props) => {

    const theme = useTheme();

    const authenSchema = Yup.object().shape({
        email: Yup.string().required('กรุณาระบุอีเมล').email('รูปแบบอีเมลไม่ถูกต้อง')
    });

    const defaultValues = useMemo(
        () => ({
            email: defaultEmail
        }),
        [defaultEmail]
    );

    const methods = useForm({
        resolver: yupResolver(authenSchema),
        defaultValues,
    });

    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (dataForm) => {
        onSubmitEmail(dataForm);
    });

    const handleClose = () => {
        reset();
        onClose();
    }

    useEffect(() => {
        setValue('email', defaultEmail);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultEmail])

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={() => handleClose()}
            transitionDuration={{
                enter: theme.transitions.duration.shortest,
                exit: 0,
            }}
            PaperProps={{
                sx: {
                    mt: 1,
                    overflow: 'unset'
                },
            }}
            sx={{
                [`& .${dialogClasses.container}`]: {
                    alignItems: 'center',
                },
            }}
            scroll="body"
        >
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Logo />
                </Box>

                <DialogContent dividers>
                    <Box sx={{ px: 3, pb: 0 }}>
                        <Box
                            gap={5}
                            display="grid"
                            gridTemplateColumns={{
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            <Stack spacing={2}>
                                <RHFTextField name="email" label='อีเมล' size="small" required sx={{ mt: 1 }} />
                            </Stack>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>
                    <LoadingButton
                        fullWidth
                        color="primary"
                        size="medium"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        ยืนยัน
                    </LoadingButton>
                </DialogActions>

            </FormProvider>
        </Dialog>
    )
}

export default DialogResendEmail;