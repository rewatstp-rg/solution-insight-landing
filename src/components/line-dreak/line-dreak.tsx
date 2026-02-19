import { Box, Divider } from "@mui/material";

const LineBreak = () => (
    <Box
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
        }}
    >
        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
    </Box>
);

export default LineBreak;