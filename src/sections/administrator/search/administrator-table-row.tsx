/* eslint-disable perfectionist/sort-imports */
import { memo } from 'react';

import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
// import { getPathImageByfile64 } from 'src/utils/getPathImageByfile64';

import Label from 'src/components/label';
import { ActionButtonSearch } from 'src/components/table';

import { AdminUserModel } from 'src/types/administrator.type';

type Props = {
    selected?: boolean;
    onEditRow?: VoidFunction;
    row: AdminUserModel;
    onInquiryRow?: VoidFunction;
    onDeleteRow?: VoidFunction;
};

const AdministratorTableRow = memo(({
    row,
    selected,
    onEditRow,
    onInquiryRow,
    onDeleteRow,
}: Props) => {

    const { firstName, lastName, email, tel, lastUpdateDtm, lastUpdateBy, imageProfileFileUrl, status } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <ActionButtonSearch
                    onEdit={onEditRow}
                    onInquiry={onInquiryRow}
                    onDelete={onDeleteRow}
                />
            </TableCell>
            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt='admin-image'
                    src={imageProfileFileUrl || ''}
                    sx={{ mr: 2 }}
                />
                <ListItemText
                    primary={`คุณ : ${firstName} ${lastName}`}
                    secondary={`อีเมล : ${email}`}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                        component: 'span',
                        color: 'text.disabled',
                    }}
                />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{tel || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{lastUpdateDtm ? fDate(lastUpdateDtm, 'DD/MM/YYYY') : '-'}</TableCell>
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
                    {status === 'ACTIVE' && 'เปิดใช้งาน'}
                    {status === 'INACTIVE' && 'ปิดใช้งาน'}
                    {status === 'NEW_USER' && 'ผู้ใช้งานใหม่'}
                </Label>
            </TableCell>
        </TableRow>
    );
})

export default AdministratorTableRow;