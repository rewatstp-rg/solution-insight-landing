import { useState, useCallback } from "react";

import { Grid, Table, Button, TableBody, Container, TableContainer } from "@mui/material";

import { useRouter } from "src/routes/hooks";
import { paths, ROOT_ADMIN } from 'src/routes/paths';
import { useLocationChange } from "src/routes/hooks/use-search-params";

import { PAGE_SIZE_DEFAULT } from "src/utils/constants";
import { setParamSearch } from "src/utils/set-param-search";

import { useSearchEmailTemplateMutation } from "src/api/email-marketing.api";

import Iconify from "src/components/iconify";
import Scrollbar from 'src/components/scrollbar';
import CardCustom from "src/components/card/card-custom";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { EmailMktTemplateType } from "src/types/email-mkt-template.type";

import { getStringObj } from "../defaultValue";
import DiscountSearchCriteria from "../email-template-criteria";
import EmailTemplateTableRow from "../email-template-search-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'action', label: 'ดำเนินการ', width: 180, align: 'center' },
    { id: 'emailTemplateName', label: 'ชื่อ Email template' },
    { id: 'lastUpdateBy', label: 'แก้ไขโดย', width: 180, align: 'center' },
    { id: 'lastUpdateDtm', label: 'แก้ไขล่าสุด', width: 180, align: 'center' },
    { id: 'status', label: 'สถานะ', width: 100, align: 'center' }
];

// ----------------------------------------------------------------------

const EmailTemplateSearchView = () => {

    const router = useRouter();
    // const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [searchEmailTemplate, { data: searchEmailTemplateData, isLoading: isLoadingSearch }] = useSearchEmailTemplateMutation();

    const notFound = (!searchEmailTemplateData?.data?.content?.length || searchEmailTemplateData?.data?.content?.length === 0) && !isLoadingSearch;

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const searchEmailTemplateApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchEmailTemplate({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addEmailTemplate = () => {
        router.push(`${ROOT_ADMIN}/email/editor/add`);
    }

    const onEditRow = async (row: EmailMktTemplateType) => {
        if (row?.emailTemplateCode) {
            router.push(`${ROOT_ADMIN}/email/editor/edit/${row?.emailTemplateCode}`);
        }
    }

    const onSubmit = (valueForm: any) => {
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
        // const param = setParamSearch({
        //     pageNo: 1,
        //     pageSize: PAGE_SIZE_DEFAULT
        // }, setPage, setRowsPerPage, "PER_PAGE");
        setParamToRouter('');
        // await searchDiscount({ eventCode: '99999' }).unwrap();
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
        router.push(`${ROOT_ADMIN}/email/template${params}`);
    }
    // Pageging

    useLocationChange(() => {
        searchEmailTemplateApi();
    })

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Email Template"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Email Template' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Grid container spacing={3}>
                <CardCustom
                    title='ค้นหา Email template'
                    action={
                        <Button
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            sx={{ minWidth: 100 }}
                            color="inherit"
                            size='medium'
                            variant="contained"
                            type="button"
                            onClick={() => addEmailTemplate()}
                        >
                            Create Email Template
                        </Button>
                    }>
                    <Grid item xs={12} md={12}>
                        <DiscountSearchCriteria
                            isLoading={false}
                            onSubmit={(e) => onSubmit(e)}
                            onReset={() => onReset()}
                        />
                    </Grid>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1260 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={searchEmailTemplateData?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchEmailTemplateData?.data?.content?.map((row) => (
                                        <EmailTemplateTableRow
                                            key={row.id}
                                            row={row}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearch) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearch) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchEmailTemplateData?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        totalPages={searchEmailTemplateData?.data?.totalPages}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
        </Container>
    )
};

export default EmailTemplateSearchView;