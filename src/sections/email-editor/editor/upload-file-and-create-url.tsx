
import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { Box, Stack, Button, Typography, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';
import { fData } from 'src/utils/format-number';

import { useAppDispatch } from 'src/store/hooks';
import { setLoadingState } from 'src/slices/error-message.slices';

import Iconify from 'src/components/iconify';
import { UploadBox } from 'src/components/upload';
import { ButtonSubmitForm } from 'src/components/button-forom';
import { LabelIcon } from 'src/components/label-icon/label-icon';

// ----------------------------------------------------------------------

const ENV_URL = `${import.meta.env.VITE_ENV_URL}`;

// ----------------------------------------------------------------------

export default function UploadFileAndCreateUrl() {

    const collapse = useBoolean();

    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState<string>('');
    const [fileItem, setFileItem] = useState<File | null>(null);

    const handleDropMultiFile = useCallback((acceptedFiles: File[]) => {

        if (acceptedFiles && acceptedFiles?.length > 0) {
            const newFiles = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0]),
            });
            if (newFiles.size > 3145728) {
                enqueueSnackbar(`ขนาดไฟล์ต้องไม่เกิน ${fData(3145728)}`, {
                    variant: 'warning',
                });
            } else {
                setFileItem(newFiles);
                setFileName(newFiles.name);
            }
        }
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fileItem, fileItem]
    );

    const handleRemoveFile = useCallback(() => {
        setFileItem(null);
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [fileItem, fileItem]
    );

    const copyUrl = (valueToCopy: string) => {
        navigator.clipboard.writeText(valueToCopy);
    }

    const onResetForm = () => {
        setFileItem(null);
        setFileName('');
        setFileUrl('');
    }

    const handleUploadFile = async () => {
        if (fileItem && fileName) {
            dispatch(setLoadingState(true));
            const url = endpoints.commonController.uploadImageEmail;
            const formData = new FormData();

            const model = {
                "imageFileName": fileName,
                "imageFileUrl": ""
            }

            formData.append('file', fileItem);
            formData.append('data', JSON.stringify(model));

            fetch(`${ENV_URL}${url}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }).then(response => {
                // Make sure the response was valid
                if (response.status >= 200 && response.status < 300) {
                    return response
                }
                const error: any = new Error(response.statusText)
                error.response = response
                dispatch(setLoadingState(false));
                throw error;
            }).then(response => (response.json())).then(data => {
                setFileUrl(data.data.imageFileUrl);
                dispatch(setLoadingState(false));
                // onResetForm();
            })
        }
    }

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent='space-between' sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" >
                    อัปโหลดรูปภาพเพิ่มรับ URL
                </Typography>
                <IconButton
                    color={collapse.value ? 'inherit' : 'default'}
                    onClick={collapse.onToggle}
                    sx={{
                        ...(collapse.value && {
                            bgcolor: 'action.hover',
                        }),
                    }}
                >

                    {collapse.value && <Iconify icon="eva:arrow-ios-downward-fill" />}
                    {!collapse.value && <Iconify icon="eva:arrow-ios-upward-fill" />}
                </IconButton>
            </Box>
            {
                collapse.value && (
                    <>
                        <UploadBox
                            placeholder={
                                <Stack spacing={0.5} alignItems="center">
                                    <Iconify icon="eva:cloud-upload-fill" width={40} />
                                    <Typography variant="body2">{fileName ? `ชื่อไฟล์ : ${fileName}` : 'เลือกไฟล์'}</Typography>
                                </Stack>
                            }
                            sx={{ flexGrow: 1, height: 'auto', py: 2.5, mb: 3, width: '100%' }}
                            onRemove={handleRemoveFile}
                            onDrop={handleDropMultiFile}
                        />
                        {
                            fileItem && (
                                <ButtonSubmitForm
                                    isSubmit={false}
                                    isUoload
                                    cancelLabel='ยกเลิก'
                                    uploadLabel='อัปโหลด'
                                    onUpload={() => handleUploadFile()}
                                    onCancel={() => onResetForm()}
                                />
                            )
                        }

                        {
                            fileUrl && (
                                <LabelIcon
                                    label="Event register URL (Test)"
                                    value={fileUrl}
                                    icon={
                                        <Button color="primary" onClick={() => copyUrl(fileUrl)} sx={{ mr: -0.5 }}>
                                            คัดลอก
                                        </Button>
                                    }
                                />
                            )
                        }

                    </>
                )
            }
        </>
    )
}