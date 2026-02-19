import { TableRow, TableCell } from "@mui/material";

type Props = {
    selected?: boolean;
    row: any;
    columns: any;
};

const TransactionTempTableRow = ({
    row,
    columns,
    selected
}: Props) => (
    <TableRow hover selected={selected}>
        {columns && columns?.map((column: any) => (
            <TableCell
                key={column.key}
                align='left'
                sx={{ whiteSpace: 'nowrap' }}
            >
                {row[column.key]}
            </TableCell>
        ))}
    </TableRow>
)



export default TransactionTempTableRow;