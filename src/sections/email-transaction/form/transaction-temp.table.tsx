import { useParams } from "react-router";
import { useState, useEffect, useCallback } from "react";

import { Table, TableBody, TableContainer } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setLoadingState } from "src/slices/error-message.slices";
import { seleceEmailMarketingModel } from "src/slices/email-marketing.slices";
import { useListEmailTransactionDataMutation } from "src/api/email-marketing.api";

import Scrollbar from "src/components/scrollbar";
import { TableNoData, TableSkeleton, TableHeadCustomTwo, TablePaginationCustom } from "src/components/table";

import TransactionTempTableRow from "./transaction-temp-table-row";

type HeaderCol = {
    id?: string;
    align?: 'left' | 'right' | 'center';
    width?: number;
    labelTh?: string;
    label?: string;
    labelEn?: string;
    key?: string;
}

type Props = {
    headerColumns: HeaderCol[];
}
const TransactionTempTable = ({ headerColumns }: Props) => {

    const params = useParams();
    const { transactionNo } = params;

    const dispatch = useAppDispatch();

    const { transactionFileDetailTempResult } = useAppSelector(seleceEmailMarketingModel);

    // const [createPDFWithImage, { isLoading: isLoadingCreatePDFWithImage }] = useCreatePDFWithImageMutation();
    const [getEmailFileUploadTempData, { isLoading: isLoadingSearchTempData }] = useListEmailTransactionDataMutation();

    const notFound = !transactionFileDetailTempResult?.content.length;

    // Pageging
    const [rowsPerPage, setRowsPerPage] = useState(transactionFileDetailTempResult?.size || 10);
    const [page, setPage] = useState(transactionFileDetailTempResult?.pageable?.pageNumber || 0);
    // Pageging

    const onChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);


    const loadContent = async () => {
        const modelFileUploadTempData = {
            "pageNo": page,
            "pageSize": rowsPerPage,
            "transactionNo": transactionNo
        } as { transactionNo: string, pageNo: number, pageSize: number };

        dispatch(setLoadingState(true));
        await getEmailFileUploadTempData(modelFileUploadTempData).unwrap();
        dispatch(setLoadingState(false));
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage])

    return (
        <>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                <Scrollbar>
                    <Table size='small' sx={{ minWidth: 960 }}>
                        <TableHeadCustomTwo
                            headLabel={headerColumns?.map((col) => ({ ...col, labelTh: col.label, align: 'left' }))}
                            rowCount={transactionFileDetailTempResult?.numberOfElements}
                        />
                        <TableBody>
                            {
                                transactionFileDetailTempResult?.content?.map((row: any) => (
                                    <TransactionTempTableRow
                                        key={row.id}
                                        row={row}
                                        columns={headerColumns}
                                    />
                                ))
                            }
                            {
                                (!isLoadingSearchTempData) && <TableNoData notFound={notFound} />
                            }
                            {
                                (isLoadingSearchTempData) && <TableSkeleton />
                            }
                        </TableBody>
                    </Table>
                </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
                count={transactionFileDetailTempResult?.totalElements || 0}
                totalPages={transactionFileDetailTempResult?.totalPages}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
            />
        </>
    )
};

export default TransactionTempTable;
