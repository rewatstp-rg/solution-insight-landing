import { useMemo } from "react";

import { Box, Stack, Dialog, DialogTitle, DialogContent } from "@mui/material";


type Props = {
    open: boolean;
    onSubmit: (url: string) => void
}
export default function DialogSelectWaterMarked({ open, onSubmit }: Props) {


    const listWatermark = useMemo(() => [
        {
            id: 1,
            name: 'Watermark 1',
            url: '/assets/watermark/watermark_tilt6_black_3024x4032.png'
        },
        {
            id: 2,
            name: 'Watermark 2',
            url: '/assets/watermark/watermark_tilt6_blue_3024x4032.png'
        }
    ], []);

    const onSubmitUrl = (url: string) => {
        onSubmit(url);
    }

    return (
        <Dialog
            open={open}
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">
                Select Watermark
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} pb={4}>
                    <Stack spacing={1} direction="row" flexWrap="wrap" gap={3}>
                        {listWatermark.map((watermark) => (
                            <Box
                                onClick={() => onSubmitUrl(watermark.url)}
                                key={watermark.id}
                                component="img"
                                src={watermark.url}
                                alt="preview"
                                sx={{
                                    width: 300,
                                    height: 'auto',
                                    borderRadius: 2,
                                    display: 'block',
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}