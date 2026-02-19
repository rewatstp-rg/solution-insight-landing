import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { fDate } from 'src/utils/format-time';

import Label from 'src/components/label';
import { ActionButtonSearch } from 'src/components/table';

import { EmailMktTemplateType } from 'src/types/email-mkt-template.type';

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
    row: EmailMktTemplateType;
    selectedAuthMenu?: PropsActionMenu;
};

const EmailTemplateTableRow = memo(({
    row,
    selected,
    onEditRow,
    selectedAuthMenu
}: Props) => {

    const { emailTemplateName, status, statusDesc, lastUpdateDtm, lastUpdateBy } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <ActionButtonSearch
                    selectedAuthMenu={selectedAuthMenu}
                    onEdit={onEditRow}
                />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='left'>{emailTemplateName || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{lastUpdateDtm ? fDate(lastUpdateDtm, 'DD/MM/YYYY') : '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{lastUpdateBy}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='center'>
                <Label
                    variant="soft"
                    color={
                        (status === 'ACTIVE' && 'success') ||
                        (status === 'BOOK' && 'warning') ||
                        'default'
                    }
                >
                    {statusDesc}
                </Label>
            </TableCell>
        </TableRow>
    );
})

export default EmailTemplateTableRow;