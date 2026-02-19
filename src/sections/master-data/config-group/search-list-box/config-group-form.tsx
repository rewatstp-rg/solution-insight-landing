import { useEffect } from 'react';

import { Box, Grid,  Tooltip, useTheme, IconButton, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { ROOT_ADMIN } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DAILOG_KEY } from 'src/utils/constants';

import { useAppDispatch } from 'src/store/hooks';
import { useGetBoxGroupMasterMutation } from 'src/api/master-data.api';
import { setConfigGroupDetail, setConfigGroupDetailDialogMode } from 'src/slices/master-data.slices';

import Iconify from 'src/components/iconify';
import CardCustom from 'src/components/card/card-custom';

import { ConfigGroup } from 'src/types/master-config';

import ConfigGroupFormDialog from './config-group-form-dialog';

type PropsType = {
    type: string;
    listboxGroup: string;
    configGroupDetail: ConfigGroup | undefined;
};

const ConfigGroupForm = ({ type, listboxGroup, configGroupDetail }: PropsType) => {

    const isDetail = () => type === 'inquiry';
    const isAdd = () => type === 'add';

    const theme = useTheme();
    const router = useRouter();
    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();

    const [getConfigGroupDetail] = useGetBoxGroupMasterMutation();

    const handleEdit = async () => {
        quickEdit.onTrue();
        if (isAdd()) {
            dispatch(setConfigGroupDetail(undefined));
            dispatch(setConfigGroupDetailDialogMode(DAILOG_KEY.add));
        } else {
            dispatch(setConfigGroupDetail(configGroupDetail));
            dispatch(setConfigGroupDetailDialogMode(DAILOG_KEY.modify));
        }
    }

    const saveSuccess = (data: any) => {
        quickEdit.onFalse();
        if (isAdd()) {
            router.push(`${ROOT_ADMIN}/master-data/config-group/modify/${data.listboxGroup}`);
        }
    }

    const loadContent = async () => {
        await getConfigGroupDetail({ listboxGroup }).unwrap();
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <CardCustom title='ข้อมูล Config Group' action={
                isDetail() ? null :
                    <Tooltip title="แก้ไขข้อมูล" placement="top" arrow>
                        <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={handleEdit} sx={{ color: theme.palette.primary.main }}>
                            <Iconify icon="mingcute:edit-4-line" />
                        </IconButton >
                    </Tooltip >
            }>
                <Grid item xs={12} md={12} >
                    <Box
                        rowGap={3}
                        columnGap={3}
                        display="grid"
                        sx={{ mb: 3 }}
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                Config Group type
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold' }}>
                                {configGroupDetail?.listboxGroup || '-'}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                รายละเอียด
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'line-seedsans-bold' }}>
                                {configGroupDetail?.listboxGroupDesc || '-'}
                            </Typography>
                        </Box>

                    </Box>
                </Grid>
            </CardCustom>
            <ConfigGroupFormDialog onSuccess={(e) => saveSuccess(e)} open={quickEdit.value} onClose={quickEdit.onFalse} />
        </>
    )
}

export default ConfigGroupForm;