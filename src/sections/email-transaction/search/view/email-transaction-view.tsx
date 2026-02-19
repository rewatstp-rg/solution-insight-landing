import { useState, useEffect, useCallback } from "react";

import { Grid, Table, Button, TableBody, Container, TableContainer } from "@mui/material";

import { useRouter } from "src/routes/hooks";
import { paths, ROOT_ADMIN } from "src/routes/paths";
import { useLocationChange } from "src/routes/hooks/use-search-params";

import { useBoolean } from "src/hooks/use-boolean";

import { setParamSearch } from "src/utils/set-param-search";
import { checkServiceResponse, PropsCheckServiceResponse } from "src/utils/check-service-response";
import { DAILOG_KEY, DAILOG_MESSAGE, PAGE_SIZE_DEFAULT, MASTER_CONFIG_GROUP } from "src/utils/constants";
import { enqueueSnackbarErrorComponent, enqueueSnackbarSuccessComponent } from "src/utils/enqueueSnackbarComponent";

import { useAppDispatch } from "src/store/hooks";
import { useGetConfigByGroupMutation } from "src/api/master-data.api";
import { setEmailTransactionInfo } from "src/slices/email-marketing.slices";
import { setLoadingState, setDialogMessage, closeDialogMessage } from "src/slices/error-message.slices";
import {
    useListEmailTemplateMutation,
    useDeleteEmailTransactionMutation,
    useSearchEmailTransactionMutation
} from "src/api/email-marketing.api";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import CardCustom from "src/components/card/card-custom";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from "src/components/table";

import { Config } from "src/types/master-config";
import { EmailMktTransactionType, EmailMktTransactionSearchType } from "src/types/email-mkt-transaction.model";

import ImportDialog from "../import-dialog";
import { getStringObj } from "../defaultValue";
import EmailTransactionSearchCriteria from "../email-transaction-criteria";
import EmailTransactionTableRow from "../email-transaction-search-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'action', label: 'ดำเนินการ', width: 180, align: 'center' },
    { id: 'transactionNo', label: 'Transaction No.', width: 180, align: 'center' },
    { id: 'emailTemplateName', label: 'Email Template', width: 180 },
    { id: 'emailSubject', label: 'Subject email', width: 180 },
    { id: 'sendEmailDateTime', label: 'วันที่ส่ง', align: 'center', width: 300 },
    { id: 'lastUpdateDtm', label: 'วันที่แก้ไขล่าสุด', width: 180, align: 'center' },
    { id: 'lastUpdateBy', label: 'แก้ไขโดย', width: 180, align: 'center' },
    { id: 'status', label: 'สถานะ', width: 150, align: 'center' }
];

// ----------------------------------------------------------------------

export default function EmailTransactionSearchView() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const isUploadDialog = useBoolean();
    const settings = useSettingsContext();

    // Pageging
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    // Pageging

    const [getConfigOption] = useGetConfigByGroupMutation();

    const [listEmailTemplate] = useListEmailTemplateMutation();
    const [deleteEmailTransaction] = useDeleteEmailTransactionMutation();
    const [searchEmailTransaction, { data: searchEmailTransactionData, isLoading: isLoadingSearchTransaction }] = useSearchEmailTransactionMutation();

    const notFound = (!searchEmailTransactionData?.data?.content?.length || searchEmailTransactionData?.data?.content?.length === 0) && !isLoadingSearchTransaction;

    const searchEmailTransactionApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchEmailTransaction({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (valueForm: EmailMktTransactionSearchType) => {
        setRowsPerPage(PAGE_SIZE_DEFAULT);
        const param = setParamSearch({
            pageNo: 1,
            pageSize: PAGE_SIZE_DEFAULT,
            ...valueForm,
        }, setPage, setRowsPerPage, "PER_PAGE");
        setParamToRouter(param);
    }

    const onReset = async () => {
        setOrder('');
        setOrderBy('');
        setParamToRouter('');
    }

    // Pageging
    const onSort = useCallback((id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
            const body = getStringObj();
            body.pageNo = 0;
            body.pageSize = PAGE_SIZE_DEFAULT;
            body.sortBy = id;
            body.orderType = isAsc ? 'desc' : 'asc';
            const param = setParamSearch(body, setPage, setRowsPerPage);
            setParamToRouter(param);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderBy, order]);

    const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const body = getStringObj();
        body.pageNo = 1;
        body.pageSize = parseInt(event.target.value, 10);
        const param = setParamSearch(body, setPage, setRowsPerPage, "PER_PAGE");
        setParamToRouter(param);
    }

    const onChangePage = useCallback((_: unknown, newPage: number) => {
        const body = getStringObj();
        body.pageNo = newPage;
        const param = setParamSearch(body, setPage, setRowsPerPage);
        setParamToRouter(param);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeDense = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    }, []);

    const setParamToRouter = (params: string) => {
        router.push(`${ROOT_ADMIN}/email/transaction${params}`);
    }
    // Pageging

    useLocationChange(() => {
        searchEmailTransactionApi();
    })

    const importData = () => {
        isUploadDialog.onTrue();
    }

    const onDeleteRow = (row: EmailMktTransactionType) => {

        dispatch(setDialogMessage({
            title: '',
            message: DAILOG_MESSAGE.delete,
            open: true,
            showSave: true,
            showCancel: true,
            labelOk: 'ตกลง',
            labelCancel: 'ยกเลิก',
            type: DAILOG_KEY.delete,
            onOk: async () => {
                dispatch(setLoadingState(true));
                dispatch(closeDialogMessage());
                let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                dataResponse = await deleteEmailTransaction(row).unwrap();

                if (checkServiceResponse(dataResponse)) {
                    // loadContent();
                    searchEmailTransactionApi();
                    enqueueSnackbarSuccessComponent();
                } else {
                    enqueueSnackbarErrorComponent();
                }
                dispatch(setLoadingState(false));
            },
        }));
    }

    const onInquiryRow = (model: EmailMktTransactionType) => {
        router.push(`${ROOT_ADMIN}/email/transaction/inquiry/${model.transactionNo}`);
    }

    const onEditRow = (model: EmailMktTransactionType) => {
        router.push(`${ROOT_ADMIN}/email/transaction/edit/${model.transactionNo}`);
    }

    const uploadSuccess = () => {
        isUploadDialog.onFalse();
        searchEmailTransactionApi();

    }

    const getListTransactionStatusOption = async () => {
        const body: Config = {
            listboxGroup: MASTER_CONFIG_GROUP.EMAIL_TRANSACTION_STATUS,
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const listOption = async () => {
        await getListTransactionStatusOption();
        await listEmailTemplate();
    }

    const loadContent = async () => {
        await listOption();
        dispatch(setEmailTransactionInfo(undefined));
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Email Transaction"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Transaction' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Grid container spacing={3}>
                <CardCustom
                    title='ค้นหา Email Transaction'
                    action={
                        <Button
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            sx={{ minWidth: 100 }}
                            color="inherit"
                            size='medium'
                            variant="contained"
                            type="button"
                            onClick={() => importData()}
                        >
                            Create Email Transaction
                        </Button>
                    }>
                    <Grid item xs={12} md={12}>
                        <EmailTransactionSearchCriteria
                            isLoading={false}
                            onSubmit={(e) => onSubmit(e)}
                            onReset={() => onReset()}
                        />
                    </Grid>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1360 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={searchEmailTransactionData?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchEmailTransactionData?.data?.content?.map((row) => (
                                        <EmailTransactionTableRow
                                            key={row.id}
                                            row={row}
                                            onEditRow={(row?.status === 'DRAFT' || row?.status === 'PENDING') ? () => onEditRow(row) : undefined}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onDeleteRow={row?.status === 'DRAFT' ? () => onDeleteRow(row) : undefined}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearchTransaction) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearchTransaction) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchEmailTransactionData?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        totalPages={searchEmailTransactionData?.data?.totalPages}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
            <ImportDialog
                onSuccess={() => uploadSuccess()}
                open={isUploadDialog.value}
                onClose={isUploadDialog.onFalse}
            />
        </Container>
    )
}