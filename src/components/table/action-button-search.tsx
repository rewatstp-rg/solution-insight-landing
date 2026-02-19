import { Tooltip, useTheme, IconButton, CircularProgress } from "@mui/material";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from 'src/components/iconify';

type PropsActionMenu = {
    add?: boolean;
    icon?: string;
    id?: string;
    inactive?: boolean;
    path?: string;
    perform?: boolean;
    title?: string;
    titleEn?: string;
    update?: boolean;
    view?: boolean;
};

type Props = {
    onEdit?: VoidFunction;
    onInquiry?: VoidFunction;
    onDelete?: VoidFunction;
    onResendEmail?: VoidFunction;
    onResendSms?: VoidFunction;
    onDownloadXml?: VoidFunction;
    onDownloadPdf?: VoidFunction;
    onSendPrint?: VoidFunction;
    viewType?: string;
    loading?: boolean;
    selectedAuthMenu?: PropsActionMenu;
    itemKey?: string;
    rootKey?: string;
    onEditAddress?: VoidFunction;
    onRedeemCode?: VoidFunction;
};

// ปุ่ม Resend Email
// ปุ่ม Resend  SMS
// ปุ่ม Send to print
// ปุ่ม Download XML
// ปุ่ม Download PDF

export default function ActionButtonSearch({ onEdit, onInquiry, onDelete, viewType, onResendEmail, onResendSms, onDownloadXml, onDownloadPdf, onSendPrint, loading, selectedAuthMenu, itemKey, rootKey, onEditAddress, onRedeemCode }: Props) {
    // console.log("🚀 ~ file: action-button-search.tsx:45 ~ ActionButtonSearch ~ selectedAuthMenu:", selectedAuthMenu)

    const isDetail = () => viewType === 'inquiry';

    const quickEdit = useBoolean();
    const quickInquiry = useBoolean();
    const quickDelete = useBoolean();
    const quickResendEmail = useBoolean();
    const quickResendSms = useBoolean();
    const quickSendPrint = useBoolean();
    const quickDownloadXml = useBoolean();
    const quickDownloadPdf = useBoolean();
    const quickEditAddress = useBoolean();
    const quickDiscountCode = useBoolean();

    const theme = useTheme();

    const handleEdit = () => {
        // console.log('test', itemKey);
        onEdit?.();
        quickEdit.onTrue();
    }

    const handleDelete = () => {
        onDelete?.();
        quickDelete.onTrue();
    }

    const handleInquiry = () => {
        onInquiry?.();
        quickInquiry.onTrue();
    }

    const handleResendEmail = () => {
        onResendEmail?.();
        quickResendEmail.onTrue();
    }

    const handleResendSms = () => {
        onResendSms?.();
        quickResendSms.onTrue();
    }

    const handleSendPrint = () => {
        onSendPrint?.();
        quickSendPrint.onTrue();
    }

    const handleDownloadXml = () => {
        onDownloadXml?.();
        quickDownloadXml.onTrue();
    }

    const handleDownloadPdf = () => {
        onDownloadPdf?.();
        quickDownloadPdf.onTrue();
    }

    const hendleEditAddress = () => {
        onEditAddress?.();
        quickEditAddress.onTrue();
    }

    const hendleRedeemCode = () => {
        onRedeemCode?.();
        quickDiscountCode.onTrue();
    }



    return (
        <>
            {
                isDetail() ? (
                    <Tooltip title="เรียกดูข้อมูล" placement="top" arrow>
                        <IconButton color={quickInquiry.value ? 'inherit' : 'default'} onClick={handleInquiry} sx={{ color: theme.palette.grey[500] }}>
                            <Iconify icon="mingcute:document-2-line" />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        {
                            (selectedAuthMenu ? (selectedAuthMenu?.view && onInquiry) : (onInquiry)) && (
                                <Tooltip title="เรียกดูข้อมูล" placement="top" arrow>
                                    <IconButton color={quickInquiry.value ? 'inherit' : 'default'} onClick={handleInquiry} sx={{ color: theme.palette.grey[500] }}>
                                        {
                                            loading && rootKey === itemKey && <CircularProgress color="inherit" size={24} />
                                        }
                                        {
                                            (!loading || rootKey !== itemKey) && <Iconify icon="mingcute:document-2-line" />
                                        }
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            (selectedAuthMenu ? (selectedAuthMenu?.update && onEdit) : (onEdit)) && (
                                <Tooltip title="แก้ไขข้อมูล" placement="top" arrow>
                                    <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={handleEdit} sx={{ color: theme.palette.primary.main }}>
                                        {
                                            loading && rootKey === itemKey && <CircularProgress color="inherit" size={24} />
                                        }
                                        {
                                            (!loading || rootKey !== itemKey) && <Iconify icon="mingcute:edit-4-line" />
                                        }
                                    </IconButton >
                                </Tooltip >
                            )
                        }
                        {
                            (selectedAuthMenu ? (selectedAuthMenu?.update && onDelete) : (onDelete)) && (
                                <Tooltip title="ลบข้อมูล" placement="top" arrow>
                                    <IconButton color={quickDelete.value ? 'inherit' : 'default'} onClick={handleDelete} sx={{ color: 'error.main' }}>
                                        {
                                            loading && rootKey === itemKey && <CircularProgress color="inherit" size={24} />
                                        }
                                        {
                                            (!loading || rootKey !== itemKey) && <Iconify icon="mingcute:delete-2-line" />
                                        }
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            (selectedAuthMenu ? (selectedAuthMenu?.update && onResendEmail) : (onResendEmail)) && (
                                <Tooltip title="Resend Email" placement="top" arrow>
                                    <IconButton color={quickResendEmail.value ? 'inherit' : 'default'} onClick={handleResendEmail} sx={{ color: theme.palette.grey[500] }}>
                                        <Iconify icon="mingcute:mail-send-line" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            onResendSms && (
                                <Tooltip title="Resend  SMS" placement="top" arrow>
                                    <IconButton color={quickResendSms.value ? 'inherit' : 'default'} onClick={handleResendSms} sx={{ color: theme.palette.grey[500] }}>
                                        <Iconify icon="fa-solid:sms" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            onDownloadXml && (
                                <Tooltip title="Download XML" placement="top" arrow>
                                    <IconButton color={quickDownloadXml.value ? 'inherit' : 'default'} onClick={handleDownloadXml} sx={{ color: theme.palette.grey[500] }}>
                                        <Iconify icon="mdi:file-xml-box" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            onDownloadPdf && (
                                <Tooltip title="Download PDF" placement="top" arrow>
                                    <IconButton color={quickDownloadPdf.value ? 'inherit' : 'default'} onClick={handleDownloadPdf} sx={{ color: theme.palette.grey[500] }}>
                                        {
                                            loading && <CircularProgress color="inherit" size={24} />
                                        }
                                        {
                                            !loading && <Iconify icon="carbon:generate-pdf" />
                                        }
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            onSendPrint && (
                                <Tooltip title="Send to print" placement="top" arrow>
                                    <IconButton color={quickSendPrint.value ? 'inherit' : 'default'} onClick={handleSendPrint} sx={{ color: theme.palette.grey[500] }}>
                                        <Iconify icon="mingcute:print-fill" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            (selectedAuthMenu ? (selectedAuthMenu?.update && onEditAddress) : (onEditAddress)) && (
                                <Tooltip title="Edit Address" placement="top" arrow>
                                    <IconButton color={quickEditAddress.value ? 'inherit' : 'default'} onClick={hendleEditAddress} sx={{ color: theme.palette.grey[500] }}>
                                        <Iconify icon="mingcute:truck-line" />
                                    </IconButton>
                                </Tooltip>
                            )
                        }
                        {
                            onRedeemCode && (
                                <Tooltip title="Redeem Code" placement="top" arrow>
                                    <IconButton color={quickDiscountCode.value ? 'inherit' : 'default'} onClick={hendleRedeemCode} sx={{ color: theme.palette.primary.main }}>
                                        {
                                            loading && rootKey === itemKey && <CircularProgress color="inherit" size={24} />
                                        }
                                        {
                                            (!loading || rootKey !== itemKey) && <Iconify icon="mingcute:refresh-2-line" />
                                        }
                                    </IconButton >
                                </Tooltip >
                            )
                        }
                    </>
                )
            }

        </>
    )
};
