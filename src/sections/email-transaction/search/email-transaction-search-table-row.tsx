import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import { ActionButtonSearch } from 'src/components/table';

import { EmailMktTransactionType } from 'src/types/email-mkt-transaction.model';

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
    onInquiryRow?: VoidFunction;
    onDeleteRow?: VoidFunction;
    row: EmailMktTransactionType;
    selectedAuthMenu?: PropsActionMenu;
};

const EmailTransactionTableRow = memo(({
    row,
    selected,
    onEditRow,
    onInquiryRow,
    onDeleteRow,
    selectedAuthMenu
}: Props) => {

    const { transactionNo, emailTemplateName, sendEmailDateTime, status, statusDesc, lastUpdateDtm, lastUpdateBy, emailSubject } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <ActionButtonSearch
                    selectedAuthMenu={selectedAuthMenu}
                    onEdit={onEditRow}
                    onInquiry={onInquiryRow}
                    onDelete={onDeleteRow}
                />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }} >{transactionNo || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='left'>{emailTemplateName || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} >{emailSubject || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{sendEmailDateTime ? fDate(sendEmailDateTime, 'DD/MM/YYYY') : '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{lastUpdateDtm ? fDate(lastUpdateDtm, 'DD/MM/YYYY') : '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{lastUpdateBy}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='center'>
                <Label
                    sx={{ width: 100 }}
                    variant="soft"
                    color={
                        (status === 'ACTIVE' && 'success') ||
                        (status === 'INACTIVE' && 'warning') ||
                        (status === 'PENDING' && 'success') ||
                        (status === 'SENDING' && 'success') ||
                        (status === 'SENDED' && 'success') ||
                        (status === 'DRAFT' && 'default') ||
                        'error'
                    }
                >
                    {statusDesc}
                </Label>
            </TableCell>
        </TableRow>
    );
})

export default EmailTransactionTableRow;