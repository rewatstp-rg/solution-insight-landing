/* eslint-disable perfectionist/sort-imports */
import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';
import { ActionButtonSearch } from 'src/components/table';

import { Config } from 'src/types/master-config';

type Props = {
    selected?: boolean;
    onEditRow?: VoidFunction;
    row: Config;
    onInquiryRow?: VoidFunction;
    onDeleteRow?: VoidFunction;
    type?: string;
};

const ListboxFormTableRow = memo(({
    row,
    selected,
    onEditRow,
    onInquiryRow,
    onDeleteRow,
    type
}: Props) => {

    const isDetail = () => type === 'inquiry';

    const { value1, name, description, status, sequence } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{name || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{value1 || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{description || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{sequence}</TableCell>
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
            {
                isDetail() ? null :
                    <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                        <ActionButtonSearch
                            onEdit={onEditRow}
                            onInquiry={onInquiryRow}
                            onDelete={onDeleteRow}
                        />
                    </TableCell>
            }
        </TableRow>
    );
})

export default ListboxFormTableRow;
