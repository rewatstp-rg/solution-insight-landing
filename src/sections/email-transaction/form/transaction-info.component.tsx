import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';

import { useAppSelector } from 'src/store/hooks';
import { seleceEmailMarketingModel } from 'src/slices/email-marketing.slices';

import Label from "src/components/label";

const TransactionInfoComponent = () => {

    const theme = useTheme();

    const { emailTransactionInfo } = useAppSelector(seleceEmailMarketingModel);

    return (
        <Box
            rowGap={5}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
            }}
            sx={{ position: 'relative' }}
        >

            <Stack spacing={1} sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'flex-end' }}>
                <Label
                    sx={{ width: 100 }}
                    variant="soft"
                    color={
                        (emailTransactionInfo?.status === 'ACTIVE' && 'success') ||
                        (emailTransactionInfo?.status === 'INACTIVE' && 'warning') ||
                        'default'
                    }
                >
                    {emailTransactionInfo?.statusDesc}
                </Label>

                <Typography variant="h6" sx={{ mt: 1 }}>Transaction No : {emailTransactionInfo?.transactionNo}</Typography>
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Transaction Info
                </Typography>
                <Box component='span' sx={{ mb: 1 }}>
                    <Box component='span' sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold', mr: 1 }}>
                        Email template name :
                    </Box>
                    {emailTransactionInfo?.emailTemplateName}
                </Box>
                <Box component='span' sx={{ mb: 1 }}>
                    <Box component='span' sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold', mr: 1 }}>
                        Email subject :
                    </Box>
                    {emailTransactionInfo?.emailSubject}
                </Box>
                <Box component='span' sx={{ mb: 1 }}>
                    <Box component='span' sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold', mr: 1 }}>
                        รายละเอียดเพิ่มเติม
                    </Box>
                    {emailTransactionInfo?.transactionDesc}
                </Box>
            </Stack>

            {/* <Stack sx={{ typography: 'body2' }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('import.importData.templateDetail')}
                </Typography>
                <Box component='span' sx={{ mb: 1 }}>
                    <Box component='span' sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold', mr: 1 }}>
                        {t('templateName')} :
                    </Box>
                    {importFileDetail?.templateName}
                </Box>
            </Stack> */}
        </Box>
    );
};

export default TransactionInfoComponent;