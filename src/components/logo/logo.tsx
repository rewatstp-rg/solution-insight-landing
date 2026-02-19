import { forwardRef } from 'react';

import Link from '@mui/material/Link';
// import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { useSettingsContext } from '../settings';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    // const theme = useTheme();
    const settings = useSettingsContext();
    const isMini = settings.themeLayout === 'mini';

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={isMini ? {
          width: 65,
          height: 'auto',
          display: 'inline-flex',
          ...sx,
        } : {
          width: 150,
          height: 'auto',
          margin: '24px auto auto !important',
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <img src="/assets/logo/Solution-Insight.png" alt="logo" />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {window.location.pathname !== '/login' ? logo : null}
      </Link>
    );
  }
);

export default Logo;
