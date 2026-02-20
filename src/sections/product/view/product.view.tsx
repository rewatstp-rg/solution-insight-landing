import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRef, useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Box,
    Grid,
    Stack,
    Button,
    Divider,
    Skeleton,
    Container,
    Typography
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { ERROR_MESSAGE } from 'src/utils/constants';
import { compressImage } from 'src/utils/compress-image';
import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';
import { base64ToBlob, fileToBase64, checkImageOrientationFromUrl } from 'src/utils/getPathImageByfile64';
import { enqueueSnackbarErrorComponent, enqueueSnackbarSuccessComponent } from 'src/utils/enqueueSnackbarComponent';

import { useSaveProductMutation } from 'src/api/product.api';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setLoadingState, setDialogMessage, selectErrorMessage, setIsLoadingDailog, closeDialogMessage } from 'src/slices/error-message.slices';

import Iconify from 'src/components/iconify';
import CardCustom from 'src/components/card/card-custom';
import { useSettingsContext } from 'src/components/settings';
import FormProvider, { Field } from 'src/components/hook-form';
import UploadBoxNative from 'src/components/upload/upload-box-native';
import WatermarkedImageMutipleV3 from 'src/components/water-marked-Image/water-marked-image-mutiple-v3';

import { ProductModel, ProductImageModel } from 'src/types/product.type';

type FileUploadModel = {
    preview?: string
} & File | null;

type Props = {
    code: string;
    type: string;
};

const DEFAULT_IMAGE = '/assets/frame-mockup/400x600.svg';

export default function Product({ code, type }: Props) {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const isAdd = () => type === 'add';
    const isUpdate = () => type === 'edit';

    const [callSaveProduct] = useSaveProductMutation();

    const { loadingState } = useAppSelector(selectErrorMessage);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [fileUpload, setFileUpload] = useState<FileUploadModel>(null);

    const [imageUrlSelected, setImageUrlSelected] = useState<string>('');
    const [imageOrientation, setImageOrientation] = useState<string>('');
    const [isWatermark, setIsWatermark] = useState(false);

    const formSchema = Yup.object().shape({
        id: Yup.number().default(0),
        productUid: Yup.string().default(''),
        productName: Yup.string().required(ERROR_MESSAGE.REQUIRED),
        productDesc: Yup.string(),
        status: Yup.string()
    });

    const defaultValues = {
        id: 0,
        productUid: '',
        productName: '',
        productDesc: '',
        status: ''
    };

    const methods = useForm({
        resolver: yupResolver(formSchema),
        defaultValues
    });

    const { handleSubmit, reset } = methods;

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
        return new File([blob], `thumbnail_${fileName}.jpg`, { type: 'image/jpeg' });
    }, []);

    const onSubmit = handleSubmit(async (dataForm) => {
        try {

            const formData = new FormData();
            const productImageModel: ProductImageModel[] = [];

            if (fileUpload && fileUpload.type.startsWith("image/")) {
                const thumbnailFile = handleDownload();
                const originalFile = fileUpload;

                if (thumbnailFile) {

                    const compressedThumbnailFile = await compressImage(thumbnailFile, {
                        quality: 0.5,
                        type: 'image/webp',
                    });

                    const compressedOriginalFile = await compressImage(originalFile, {
                        quality: 0.6,
                        type: 'image/webp',
                    });

                    formData.append(compressedThumbnailFile.name, compressedThumbnailFile);
                    formData.append(compressedOriginalFile.name, compressedOriginalFile);


                    productImageModel.push({
                        imageName: compressedOriginalFile.name,
                        imageType: 'NORMAL'
                    });

                    productImageModel.push({
                        imageName: compressedThumbnailFile.name,
                        imageType: 'THUMBNAIL'
                    });
                }
            }

            const productSaveModel: ProductModel = {
                ...dataForm,
                listImage: productImageModel
            };

            formData.append('data', JSON.stringify(productSaveModel));

            dispatch(setDialogMessage({
                title: '',
                message: "คุณต้องการบันทึกข้อมูลใช่หรือไม่",
                open: true,
                showSave: true,
                showCancel: true,
                labelOk: 'ตกลง',
                labelCancel: 'ยกเลิก',
                type: 'alert',
                onOk: async () => {

                    dispatch(setIsLoadingDailog(true));

                    let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                    dataResponse = await callSaveProduct(formData).unwrap();

                    if (checkServiceResponse(dataResponse)) {
                        dispatch(setIsLoadingDailog(false));
                        dispatch(closeDialogMessage());
                        enqueueSnackbarSuccessComponent();
                        router.push('/admin/module/product');
                    } else {
                        enqueueSnackbarErrorComponent();
                    }
                },
            }));

        } catch (error) {
            dispatch(setIsLoadingDailog(false));
            dispatch(closeDialogMessage());
            enqueueSnackbarErrorComponent(error.message);
        }



    });

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
        const preview = URL.createObjectURL(fileItem);
        setFileUpload(Object.assign(fileItem, { preview }));
        setFileUpload(fileItem);
    };

    const handleChange = async (event: File) => {
        const file = event;
        try {
            if (file) {

                const fileItem = file;
                // ตรวจสอบขนาดไฟล์ไม่เกิน 5MB
                const maxSizeInBytes = 5 * 1024 * 1024;
                if (fileItem.size > maxSizeInBytes) {
                    dispatch(setLoadingState(false));
                    enqueueSnackbarErrorComponent("ขนาดไฟล์ไม่เกิน 5MB");
                    return;
                }

                dispatch(setLoadingState(true));

                setFileUpload(null);
                setImageUrlSelected('');
                setImageOrientation('');
                setIsWatermark(false);

                renderWatermarkedImage(file, fileItem);

            }
        } catch (err) {
            console.log("🚀 ~ file: search-by-face.tsx:35 ~ handleFileChange ~ err:", err);
            enqueueSnackbarErrorComponent(err.message);
        }
    };

    const onReset = () => {
        reset();
        setFileUpload(null);
        setImageUrlSelected('');
        setImageOrientation('');
        setIsWatermark(false);
    }

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: { xs: 3, md: 5 },
                    }}
                >
                    รายละเอียดสินค้า :{isUpdate() ? code : ' เพิ่ม'}
                </Typography>
                <CardCustom title={isAdd() ? 'เพิ่มสินค้า' : 'แก้ไขสินค้า'} >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Field.Text name="productName" label="ชื่อสินค้า" required />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Field.Text name="productDesc" label="รายละเอียดสินค้า" rows={3} multiline />
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ borderStyle: 'dashed', mt: 1, mb: 1 }} />
                        </Grid>
                        <Grid item xs={12} md={12}>
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
                        </Grid>

                        {
                            fileUpload?.preview && imageUrlSelected && !loadingState && (
                                <Grid
                                    item
                                    xs={12}
                                    md={12}>
                                    <WatermarkedImageMutipleV3
                                        previewUrl={fileUpload?.preview ?? DEFAULT_IMAGE}
                                        isWatermarked={isWatermark}
                                        imageOrientation={imageOrientation}
                                        imageUrl={imageUrlSelected ?? DEFAULT_IMAGE}
                                        canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
                                    />
                                </Grid>
                            )
                        }

                        {
                            loadingState && !fileUpload && !imageUrlSelected && (
                                <Grid
                                    item
                                    xs={12}
                                    md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 6, lg: 10 } }}>
                                        <Skeleton variant="rectangular" width="400px" height="700px" sx={{ borderRadius: '16px' }} animation="wave" />
                                        <Skeleton variant="rectangular" width="400px" height="700px" sx={{ borderRadius: '16px' }} animation="wave" />
                                    </Box>
                                </Grid>
                            )

                        }

                        <Grid item xs={12} md={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button variant="outlined" onClick={onReset}>คืนค่า</Button>
                                <Button variant="contained" onClick={onSubmit}>อัพโหลด</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardCustom>
            </Container>
        </FormProvider>
    );
}