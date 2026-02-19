import { useState, useEffect } from "react";

import {
    Box,
    Grid,
    Card,
    Select,
    Button,
    MenuItem,
    CardMedia,
    Pagination,
    Typography,
    CardActions
} from "@mui/material";

import { urlToBase64, removeDataPrefix, downloadImageFromBase64New } from "src/utils/getPathImageByfile64";

import { useSearchImageFrameByTypeMutation } from "src/api/common.api";

import Iconify from "src/components/iconify";

import { FileResponse } from "src/types/file";

export default function ViewCommonImageFrameView() {

    const [searchImageFrameByType] = useSearchImageFrameByTypeMutation();

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [listImage, setListImage] = useState<FileResponse[]>([]);

    const onDownload = async (row) => {
        await urlToBase64(row.filePath).then((base64) => downloadImageFromBase64New({ name: row.fileName, file: removeDataPrefix(base64) }));
    }

    const loadContent = () => {
        searchImageFrameByType({ uploadType: 'RUN_CRAFT_2025', pageNo: page, pageSize: perPage }).unwrap().then((response) => {
            const { data } = response;
            if (data) {
                setListImage(data?.content || []);
                setTotalPages(data?.totalPages || 1);
            }
        });
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, perPage]);

    return (
        <Box p={4} marginTop={4} sx={{ maxWidth: "1600px", margin: "0 auto" }}>
            {/* ตัวเลือกจำนวนภาพต่อหน้า */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                    แสดงต่อหน้า:
                </Typography>
                <Select
                    size="small"
                    value={perPage}
                    onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                    }}
                >
                    {[8, 16, 20].map((num) => (
                        <MenuItem key={num} value={num}>
                            {num}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {/* แสดงรูปภาพ */}
            <Grid container spacing={2}>
                {listImage.map((img, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                image={img.filePath}
                                alt={`Image ${index}`}
                            />
                            <CardActions sx={{ justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Iconify icon="solar:download-bold" />}
                                    onClick={() => onDownload(img)}
                                >
                                    ดาวน์โหลด
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                />
            </Box>
        </Box>
    );
};