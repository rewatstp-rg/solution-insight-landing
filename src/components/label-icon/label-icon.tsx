import { ReactNode } from "react";

import { useTheme } from '@mui/material/styles';
import { Box, Typography } from "@mui/material";

export function LabelIcon({
    label, value, icon,
}: {
    label: string,
    value: string,
    icon?: ReactNode
}) {

    const theme = useTheme();
    
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold' }}>
                    {value || '-'}
                </Typography>
            </Box>
            {icon && icon}
        </Box>
    )
}