import { memo } from "react";

import { Box, Button, CircularProgress } from "@mui/material";

import Iconify from "../iconify";

type Props = {
    isSubmit?: boolean;
    isAction?: boolean;
    isCancel?: boolean;
    actionLabel?: string;
    submitLabel?: string;
    cancelLabel?: string;
    onCancel?: () => void;
    onSubmit?: () => void;
    onAction?: () => void;
    loading?: boolean;
    disabledCancel?: boolean;
    disabledSubmit?: boolean;
    justifyContent?: string;
    isUoload?: boolean;
    uploadLabel?: string;
    onUpload?: () => void;
};

const ButtonSubmitForm = memo((props: Props) => {
    const {
        disabledCancel = false,
        disabledSubmit = false,
        justifyContent = "center",
        submitLabel = 'ค้นหา',
        cancelLabel = 'คืนค่า',
        onCancel,
        onSubmit,
        loading = false,
        isSubmit = true,
        isAction = false,
        onAction,
        actionLabel = 'ปิด',
        isCancel = true,
        isUoload = false,
        uploadLabel = 'นำเข้าข้อมูล',
        onUpload
    } = props;
    return (
        <Box
            rowGap={1}
            columnGap={6}
            mt={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                lg: 'repeat(1, 1fr)',
            }}
        >
            <Box display="flex" justifyContent={justifyContent} columnGap={2} sx={{ py: 1, px: 2 }}>
                {
                    isCancel && (
                        <Button
                            disabled={loading || disabledCancel}
                            startIcon={
                                <>
                                    {
                                        loading && <CircularProgress color="inherit" size={24} />
                                    }
                                    {
                                        !loading && (cancelLabel !== 'ปิด' && cancelLabel !== 'ยกเลิก') && <Iconify icon="mingcute:back-2-line" />
                                    }
                                    {
                                        !loading && (cancelLabel === 'ปิด' || cancelLabel === 'ยกเลิก') && <Iconify icon="mingcute:close-circle-line" />
                                    }
                                </>
                            }
                            sx={{ minWidth: 100 }}
                            size='medium'
                            type="button"
                            variant="outlined" onClick={() => onCancel?.()}>
                            {cancelLabel}
                        </Button>
                    )
                }


                {
                    isSubmit && (
                        <Button
                            disabled={loading || disabledSubmit}
                            startIcon={
                                <>
                                    {
                                        loading && <CircularProgress color="inherit" size={24} />
                                    }
                                    {
                                        !loading && <Iconify icon="mingcute:save-2-fill" />
                                    }
                                </>
                            }
                            sx={{ minWidth: 100 }}
                            color="primary"
                            size='medium'
                            variant="contained"
                            type="submit"
                            onClick={() => onSubmit?.()}
                        >
                            {submitLabel}
                        </Button>
                    )
                }

                {
                    isUoload && (
                        <Button
                            disabled={loading || disabledSubmit}
                            startIcon={
                                <>
                                    {
                                        loading && <CircularProgress color="inherit" size={24} />
                                    }
                                    {
                                        !loading && <Iconify icon="mingcute:upload-2-fill" />
                                    }
                                </>
                            }
                            sx={{ minWidth: 100 }}
                            color="primary"
                            size='medium'
                            variant="contained"
                            type="button"
                            onClick={() => onUpload?.()}
                        >
                            {uploadLabel}
                        </Button>
                    )
                }


                {
                    isAction && (
                        <Button
                            disabled={loading}
                            startIcon={
                                loading && <CircularProgress color="inherit" size={24} />
                            }
                            sx={{ minWidth: 100 }}
                            color="success"
                            size='medium'
                            type="button"
                            variant="contained" onClick={() => onAction?.()}>
                            {actionLabel}
                        </Button>
                    )
                }

            </Box>
        </Box >
    )
});

export default ButtonSubmitForm;