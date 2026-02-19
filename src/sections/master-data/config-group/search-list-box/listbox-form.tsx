import { useEffect } from 'react';

import { Grid, Table, TableBody, TableContainer } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DAILOG_KEY } from 'src/utils/constants';

import { useAppDispatch } from 'src/store/hooks';
import { useGetConfigByGroupMutation } from 'src/api/master-data.api';
import { setListboxDetail, setListboxDetailDialogMode } from 'src/slices/master-data.slices';

import Scrollbar from 'src/components/scrollbar';
import CardCustom from 'src/components/card/card-custom';
import ButtonAdd from 'src/components/button-forom/button-add';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { Config } from 'src/types/master-config';

import ListboxFormDialog from './listbox-form-dialog';
import ListboxFormTableRow from './listbox-form-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'ชื่อ Option', width: 180 },
    { id: 'value1', label: 'ค่าของ Option', width: 180 },
    { id: 'description', label: 'รายละเอียด', width: 180 },
    { id: 'sequence', label: 'ลำดับ', width: 180 },
    { id: 'status', label: 'สถานะ', width: 150 }
];

const TABLE_HEAD_ACTION = [
    { id: 'action', label: 'ดำเนินการ', width: 180, align: 'center' }
]

type PropsType = {
    listboxGroup: string;
    type: string;
};

const ListboxForm = ({ listboxGroup, type }: PropsType) => {

    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();

    const [getListConfigOption, { isLoading: isLoadingGetConfig, data: dataGetConfig }] = useGetConfigByGroupMutation();

    const notFound = (!dataGetConfig || !dataGetConfig.length);

    const onInquiryRow = (row: Config) => {
        quickEdit.onTrue();
        dispatch(setListboxDetail(row));
        dispatch(setListboxDetailDialogMode(DAILOG_KEY.inquiry));
    }

    const onEditRow = (row: Config) => {
        quickEdit.onTrue();
        dispatch(setListboxDetail(row));
        dispatch(setListboxDetailDialogMode(DAILOG_KEY.modify));
    }

    const saveSuccess = () => {
        quickEdit.onFalse();
        loadContent();
    }
    const loadContent = async () => {
        await getListConfigOption({
            listboxGroup,
            status: 'ACTIVE'
        }).unwrap();
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ListboxFormDialog onSuccess={saveSuccess} open={quickEdit.value} onClose={quickEdit.onFalse} listboxGroup={listboxGroup} />
            <CardCustom title='ข้อมูล List Config Option' action={
                type !== 'inquiry' ? <ButtonAdd
                    onAdd={() => {
                        quickEdit.onTrue();
                        dispatch(setListboxDetail(undefined));
                        dispatch(setListboxDetailDialogMode(DAILOG_KEY.add));
                    }}
                    loading={isLoadingGetConfig}
                    addLabel="เพิ่ม Config Option"
                /> : null
            }>
                <Grid item xs={12} md={12}>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size='medium' sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    headLabel={type === 'inquiry' ? TABLE_HEAD : [...TABLE_HEAD, ...TABLE_HEAD_ACTION]}
                                />
                                <TableBody>
                                    {dataGetConfig?.map((row) => (
                                        <ListboxFormTableRow
                                            key={row.id}
                                            row={row}
                                            type={type}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingGetConfig) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingGetConfig) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                </Grid>
            </CardCustom>
        </>
    )
}

export default ListboxForm;