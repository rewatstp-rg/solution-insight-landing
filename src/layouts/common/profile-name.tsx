/* eslint-disable perfectionist/sort-imports */
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

import { getStorage } from "src/hooks/use-local-storage";
import { STORAGE_KEYS, ENV_NAME_ADMIN } from "src/utils/constants";

const ENV = import.meta.env.VITE_HOST_NAME;

export default function ProfileName() {

    const key = ENV === ENV_NAME_ADMIN ? STORAGE_KEYS.USER_INFO : STORAGE_KEYS.CUSTOMER_INFO;
    const userProfile: any = getStorage(key);

    return (
        <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle2" noWrap>
                {userProfile?.fullName} (Admin User)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {`ลงชื่อเมื่อ ${dayjs(userProfile?.createdAt).format('HH:mm DD/MM/YYYY')}`}
            </Typography>
        </Box>
    )
}