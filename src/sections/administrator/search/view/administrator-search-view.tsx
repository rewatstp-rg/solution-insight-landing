import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Container } from '@mui/system';
import { Grid, Table, TableBody, TableContainer } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { paths, ROOT_ADMIN } from 'src/routes/paths';

import getQueryParam from 'src/utils/getQueryParam';
import { setParamSearch } from 'src/utils/set-param-search';
import { checkServiceResponse, PropsCheckServiceResponse } from 'src/utils/check-service-response';
import { PAGE_ADD, PAGE_EDIT, DAILOG_KEY, PAGE_INQUIRY, DAILOG_TITLE, DAILOG_MESSAGE, CUSTOMER_STATUS, PAGE_SIZE_DEFAULT, MASTER_CONFIG_GROUP } from 'src/utils/constants';

import { useTranslate } from 'src/locales';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useGetConfigByGroupMutation } from 'src/api/master-data.api';
import { selectAdministrator, setAdministratorDetail } from 'src/slices/administrator.slices';
import { useDeleteAdminUserMutation, useSearchAdministratorMutation } from 'src/api/administrator.api';

import Scrollbar from 'src/components/scrollbar';
import CardCustom from 'src/components/card/card-custom';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { useSettingsContext } from 'src/components/settings';
import ButtonAdd from 'src/components/button-forom/button-add';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { Config } from 'src/types/master-config';
import { AlertDialogModel } from 'src/types/alert-dialog.type';
import { AdminUserModel, AdminUserSearchRequest } from 'src/types/administrator.type';

import { getStringObj } from '../defaultValue';
import AdministratorTableRow from '../administrator-table-row';
import AdministratorSearchCriteria from '../administrator-search-criteria';

// ----------------------------------------------------------------------

const AdministratorSearchView = () => {

    const { t } = useTranslate();

    const TABLE_HEAD = [
        { id: 'action', label: t('action'), width: 180, align: 'center' },
        { id: 'adminCode', label: t('administrater.administraterSearch.adminCode'), width: 300 },
        { id: 'tel', label: t('administrater.administraterSearch.tel'), width: 180, align: 'center' },
        { id: 'lastUpdateDtm', label: t('lastUpdateDtm'), width: 180 },
        { id: 'lastUpdateBy', label: t('lastUpdateBy'), width: 180 },
        { id: 'statusDesc', label: t('administrater.administraterSearch.status'), width: 100 }
    ];

    const router = useRouter();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getConfigOption] = useGetConfigByGroupMutation();
    const [searchAdministrator, { isLoading: isLoadingSearch }] = useSearchAdministratorMutation();
    const [deleteAdministrator, { isLoading: isLoadingDelete }] = useDeleteAdminUserMutation();

    const { searchAdministratorResult } = useAppSelector(selectAdministrator);

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    const notFound = (!searchAdministratorResult?.data?.content?.length) && !isLoadingSearch;

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    // Pageging

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.delete,
        })
    }

    const onAddAdmin = () => {
        dispatch(setAdministratorDetail(undefined));
        router.push(`${ROOT_ADMIN}/administrator/${PAGE_ADD}`);
    }

    const onInquiryRow = (row: AdminUserModel) => {
        router.push(`${ROOT_ADMIN}/administrator/${row.adminCode}/${PAGE_INQUIRY}`);
    }

    const onEditRow = (row: AdminUserModel) => {
        router.push(`${ROOT_ADMIN}/administrator/${row.adminCode}/${PAGE_EDIT}`);
    }

    const onDeleteRow = (row: AdminUserModel) => {
        const data = {
            ...row,
            status: CUSTOMER_STATUS.DELETE
        };

        setDialogMessage({
            title: '',
            message: DAILOG_MESSAGE.delete,
            open: true,
            showSave: true,
            showCancel: true,
            labelOk: 'ตกลง',
            labelCancel: 'ยกเลิก',
            type: DAILOG_KEY.delete,
            onOk: async () => {

                onCloseDialogAlert();

                let dataResponse: PropsCheckServiceResponse = {} as PropsCheckServiceResponse;
                dataResponse = await deleteAdministrator(data).unwrap();

                if (checkServiceResponse(dataResponse)) {
                    loadContent();
                    enqueueSnackbar(DAILOG_MESSAGE.success, {
                        variant: 'success',
                    });
                } else {
                    enqueueSnackbar(DAILOG_TITLE.seriveUnSuccess, {
                        variant: 'error',
                    });
                }
            },
        });
    }

    // Form action
    const onSubmit = (valueForm: AdminUserSearchRequest) => {
        const params = getQueryParam({
            pageNo: 1,
            pageSize: PAGE_SIZE_DEFAULT,
            ...valueForm,
        });
        setRowsPerPage(PAGE_SIZE_DEFAULT);
        setParamToRouter(params);
    }

    const onReset = () => {
        router.push(`${ROOT_ADMIN}/administrator`);
        searchAdministratorApi();
        setOrder('');
        setOrderBy('');
    }
    // Form action

    const getListAdministratorStatusOption = async () => {
        const body: Config = {
            listboxGroup: MASTER_CONFIG_GROUP.ADMIN_STATUS,
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const listOption = async () => {
        await getListAdministratorStatusOption();
    }

    const searchAdministratorApi = useCallback(async () => {
        setLoadingSearch(true);
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchAdministrator({ ...body }).unwrap();
            setTimeout(() => {
                setLoadingSearch(false);
            }, 1500);
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        router.push(`${ROOT_ADMIN}/administrator${params}`);
        searchAdministratorApi();
    }
    // Pageging

    const loadContent = async () => {
        await listOption();
        searchAdministratorApi();
    }

    useEffect(() => {
        loadContent();
        dispatch(setAdministratorDetail(undefined));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchAdministratorApi])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <CustomBreadcrumbs
                heading={t('administrater.administraterSearch.title')}
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: t('administrater.administraterSearch.subTitle') },
                    { name: t('administrater.administraterSearch.search') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Grid container spacing={3}>
                <CardCustom title={t('administrater.administraterSearch.subTitle')} action={
                    <ButtonAdd
                        onClick={() => onAddAdmin()}
                        addLabel={t('administrater.administraterSearch.add')}
                    />
                }>
                    <Grid item xs={12} md={12}>
                        <AdministratorSearchCriteria
                            isLoading={isLoadingSearch || isLoadingDelete}
                            onSubmit={(valueForm) => onSubmit(valueForm)}
                            onReset={onReset}
                        />
                    </Grid>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={searchAdministratorResult?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchAdministratorResult?.data?.content?.map((row) => (
                                        <AdministratorTableRow
                                            key={row.id}
                                            row={row}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onDeleteRow={() => onDeleteRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearch && !isLoadingDelete) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearch || isLoadingDelete || loadingSearch) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchAdministratorResult?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        totalPages={searchAdministratorResult?.data?.totalPages}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
        </Container>
    )
};

export default AdministratorSearchView;