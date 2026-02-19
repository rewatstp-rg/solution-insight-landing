/* eslint-disable perfectionist/sort-imports */
import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import ISOToDate from 'src/utils/ISOToDate';

import Label from 'src/components/label';
import { ActionButtonSearch } from 'src/components/table';

import { MasterSubDistrictModel } from 'src/types/master-config';


type PropsActionMenu = {
    add?: boolean;
    icon?: string;
    id?: string;
    inactive?: boolean;
    path?: string;
    perform?: boolean;
    title?: string;
    titleEn?: string;
    update?: boolean;
    view?: boolean;
};

type Props = {
    selected?: boolean;
    onEditRow?: VoidFunction;
    row: MasterSubDistrictModel;
    onInquiryRow?: VoidFunction;
    onDeleteRow?: VoidFunction;
    selectedAuthMenu?: PropsActionMenu;
};

const SubDistrictTableRow = memo(({
    row,
    selected,
    onEditRow,
    onInquiryRow,
    onDeleteRow,
    selectedAuthMenu
}: Props) => {

    const { subDistrictCode, subDistrictNameTh, subDistrictNameEng, zipcode: postcode, status, lastUpdateDtm, lastUpdateBy } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='center'>{subDistrictCode || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{subDistrictNameTh || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{subDistrictNameEng || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{postcode || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastUpdateDtm ? ISOToDate(new Date(lastUpdateDtm), 'dateRequestTime') : '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastUpdateBy}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Label
                    variant="soft"
                    color={
                        (status === 'ACTIVE' && 'success') ||
                        (status === 'INACTIVE' && 'warning') ||
                        'default'
                    }
                >
                    {
                        (status === 'ACTIVE' && 'เปิดใช้งาน') ||
                        (status === 'INACTIVE' && 'ปิดใช้งาน')
                    }
                </Label>
            </TableCell>
            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <ActionButtonSearch
                    selectedAuthMenu={selectedAuthMenu}
                    onEdit={onEditRow}
                    onInquiry={onInquiryRow}
                    onDelete={onDeleteRow}
                />
            </TableCell>
        </TableRow>
    );
})

export default SubDistrictTableRow;