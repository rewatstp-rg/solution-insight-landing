import { useRef, useState, useEffect, useCallback } from "react";

import { Box, Grid, Stack, Button, Divider, Backdrop, Typography, CircularProgress } from "@mui/material";

import { base64ToBlob, fileToBase64, checkImageOrientationFromUrl } from "src/utils/getPathImageByfile64";
import { enqueueSnackbarErrorComponent, enqueueSnackbarSuccessComponent } from "src/utils/enqueueSnackbarComponent";

import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { useUploadImageFrameMutation } from "src/api/common.api";
import { setLoadingState, selectErrorMessage, setIsLoadingDailog, closeDialogMessage } from "src/slices/error-message.slices";

import Iconify from "src/components/iconify";
import AlertDialog from "src/components/dialog/alert-dialog";
import UploadBoxNative from "src/components/upload/upload-box-native";
import WatermarkedImageMutipleV3 from "src/components/water-marked-Image/water-marked-image-mutiple-v3";

import SearchImageFile from "../search-image-file";

const DEFAULT_IMAGE = '/assets/frame-mockup/400x600.svg';

export default function UploadCommonImageFrameView() {

    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { alertDialogModel, isLoadingDailog, loadingState } = useAppSelector(selectErrorMessage);

    const [uploadImageFrame] = useUploadImageFrameMutation();

    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [imageUrlSelected, setImageUrlSelected] = useState<string>('');
    const [imageOrientation, setImageOrientation] = useState<string>('');
    const [isWatermark, setIsWatermark] = useState(false);

    const renderWatermarkedImage = async (file?: File, fileItem?: File, url?: string) => {
        const base64Data = file ? await fileToBase64(file) : url;
        if (base64Data) {
            if (file) {
                setIsWatermark(true);
            }
            checkImageOrientationFromUrl(base64Data)
                .then(async orientation => {
                    setImageOrientation(orientation.orientation);
                    setImageUrlSelected(base64Data);
                    dispatch(setLoadingState(false));
                }).catch(err => {
                    console.error('โหลดรูปไม่ได้:', err);
                    dispatch(setLoadingState(false));
                })
        }
        if (!fileItem) return;
        setFileUpload(fileItem);
    };

    const handleChange = async (event: File) => {
        const file = event;
        try {
            if (file) {

                dispatch(setLoadingState(true));

                const fileItem = file;
                // ตรวจสอบขนาดไฟล์ไม่เกิน 5MB
                const maxSizeInBytes = 5 * 1024 * 1024;
                if (fileItem.size > maxSizeInBytes) {
                    dispatch(setLoadingState(false));
                    enqueueSnackbarErrorComponent("ขนาดไฟล์ไม่เกิน 5MB");
                    return;
                }
                renderWatermarkedImage(file, fileItem);
            }
        } catch (err) {
            console.log("🚀 ~ file: search-by-face.tsx:35 ~ handleFileChange ~ err:", err);
            enqueueSnackbarErrorComponent(err.message);
        }
    };

    const handleDownload = useCallback((): File | null => {
        const originalCanvas = canvasRef.current;
        if (!originalCanvas) return null;

        const maxExportWidth = Number(originalCanvas.width);
        const scale = maxExportWidth / originalCanvas.width;
        const exportWidth = originalCanvas.width * scale;
        const exportHeight = originalCanvas.height * scale;

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = exportWidth;
        exportCanvas.height = exportHeight;

        const exportCtx = exportCanvas.getContext('2d');
        if (!exportCtx) return null;

        exportCtx.drawImage(originalCanvas, 0, 0, exportWidth, exportHeight);

        const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.93);
        const base64 = dataUrl.split(',')[1];
        const fileName = new Date().getTime().toString();

        const blob = base64ToBlob(base64, 'image/jpeg');
        return new File([blob], `frame_${fileName}.jpg`, { type: 'image/jpeg' });
    }, []);

    const onSubmit = async () => {
        if (fileUpload && fileUpload.type.startsWith("image/")) {
            const fileToSave = handleDownload();
            console.log("🚀 ~ onSubmit ~ fileToSave:", fileToSave);
            if (fileToSave) {
                dispatch(setLoadingState(true));
                setIsUploadSuccess(false);
                const payload = {
                    uploadType: "RUN_CRAFT_2025",
                    fileName: fileToSave.name
                };
                const formData = new FormData();
                formData.append('file', fileToSave);
                formData.append('data', JSON.stringify(payload));
                await uploadImageFrame(formData).unwrap().then(res => {
                    if (res?.id) {
                        dispatch(setLoadingState(false));
                        setIsUploadSuccess(true);
                        enqueueSnackbarSuccessComponent();
                    } else {
                        enqueueSnackbarErrorComponent("อัพโหลดรูปภาพไม่สําเร็จ");
                    }
                }).catch(_err => {
                    dispatch(setLoadingState(false));
                });
            } else {
                enqueueSnackbarErrorComponent("อัพโหลดรูปภาพไม่สําเร็จ");
            }
        } else {
            enqueueSnackbarErrorComponent("กรุณาเลือกรูปภาพ");
        }
    }

    const onReset = () => {
        setFileUpload(null);
        setImageUrlSelected('');
        setImageOrientation('');
        setIsUploadSuccess(false);
        dispatch(setLoadingState(false));
    }

    const onCloseDialogAlert = () => {
        dispatch(setIsLoadingDailog(false));
        dispatch(closeDialogMessage());
    }

    useEffect(() => {
        renderWatermarkedImage(undefined, undefined, DEFAULT_IMAGE);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Stack
                sx={{
                    width: 1,
                    mx: 'auto',
                    justifyContent: 'flex-start',
                    px: { xs: 2, md: 2 },
                    pt: { xs: 0, md: 10 },
                    pb: { xs: 15, md: 0 },
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            maxWidth: imageOrientation === 'landscape' ? '700px' : '400px',
                            margin: 'auto'
                        }}>

                            <WatermarkedImageMutipleV3
                                previewUrl=""
                                isWatermarked={isWatermark}
                                imageOrientation={imageOrientation}
                                imageUrl={imageUrlSelected ?? DEFAULT_IMAGE}
                                // watermarkHorizontalUrl='/assets/watermark/Checkfoto-Watermark-horizontal.png'
                                // watermarkVerticalUrl='/assets/watermark/Checkfoto-Watermark-vertical.png'
                                canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                            />

                            <Divider sx={{ borderStyle: 'dashed', mt: 1, mb: 1 }} />
                            <UploadBoxNative
                                onChange={(file) => handleChange(file)}
                                placeholder={
                                    <Stack spacing={0.5} alignItems="center">
                                        <Iconify icon="line-md:upload-loop" width={40} />
                                        <Typography variant="body2">เลือกรูปภาพ</Typography>
                                    </Stack>
                                }
                                sx={{ mb: 3, py: 2.5, flexGrow: 1, height: 'auto', width: 1 }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button variant="outlined" onClick={onReset}>คืนค่า</Button>
                            <Button variant="contained" onClick={onSubmit}>อัพโหลด</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" sx={{ mb: 3 }}>รูปภาพที่อัพโหลด (15 รูปล่าสุด)</Typography>
                        <SearchImageFile isUploadSuccess={isUploadSuccess} />
                    </Grid>
                </Grid>
            </Stack>
            <AlertDialog model={alertDialogModel} onCancel={onCloseDialogAlert} loading={isLoadingDailog} />
            {(loadingState) && (
                <Backdrop open sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            )}
        </Box>
    );
}