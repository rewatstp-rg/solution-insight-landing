import { Stack, StackProps, Typography } from "@mui/material";

interface BlockProps extends StackProps {
    label?: string;
    children: React.ReactNode;
  }
  
export  function Block({ label = 'RHFTextField', sx, children }: BlockProps) {
    return (
      <Stack spacing={1} sx={{ width: 1, ...sx }}>
        <Typography
          variant="caption"
          sx={{
            textAlign: 'right',
            fontStyle: 'italic',
            color: 'text.disabled',
          }}
        >
          {label}
        </Typography>
        {children}
      </Stack>
    );
  }