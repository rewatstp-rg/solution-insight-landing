/* eslint-disable perfectionist/sort-imports */
import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

import { ActionButtonSearch } from 'src/components/table';

import { ConfigGroup } from 'src/types/master-config';

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
    row: ConfigGroup;
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

    const { listboxGroup, listboxGroupDesc, lastUpdateDtm, lastUpdateBy } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{listboxGroup || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{listboxGroupDesc || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastUpdateDtm ? fDate(lastUpdateDtm, 'DD/MM/YYYY'): '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastUpdateBy}</TableCell>
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