import { useState, useEffect, useCallback } from 'react';

import { Container } from '@mui/system';
import { Grid, Table, TableBody, TableContainer } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { paths, ROOT_ADMIN } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import getQueryParam from 'src/utils/getQueryParam';
import { setParamSearch } from 'src/utils/set-param-search';
import { PAGE_ADD, DAILOG_KEY, PAGE_SIZE_DEFAULT } from 'src/utils/constants';

import { useTranslate } from 'src/locales';
import { selectAuthMenuById } from 'src/slices/menu.slices';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { useSearchConfigGroupMutation, useListAllListboxGroupMutation } from 'src/api/master-data.api';
import {
    selectMasterData,
    setConfigGroupDetail,
    setSearchConfigGroupResult
} from 'src/slices/master-data.slices';

import Scrollbar from 'src/components/scrollbar';
import CardCustom from 'src/components/card/card-custom';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { useSettingsContext } from 'src/components/settings';
import ButtonAdd from 'src/components/button-forom/button-add';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { BasePaginateResponse } from 'src/types/base-paginate';
import { AlertDialogModel } from 'src/types/alert-dialog.type';
import {
    ConfigGroup,
    ConfigGroupSearchRequest
} from 'src/types/master-config';

import { getStringObj } from '../defaultValue';
import ConfigGroupTableRow from '../config-group-table-row';
import ConfigGroupFormDialog from '../config-group-form-dialog';
import ConfigGroupSearchCriteria from '../config-group-search-criteria';

// ----------------------------------------------------------------------

const menuId = 'MN021';

const ConfigGroupSearchView = () => {

    const { t } = useTranslate();

    const TABLE_HEAD = [
        { id: 'listboxGroup', label: t('masterData.configGroup.title'), width: 180 },
        { id: 'listboxGroupDesc', label: t('masterData.configGroup.configGroupType'), width: 200 },
        { id: 'lastUpdateDtm', label: t('lastUpdateDtm'), width: 180 },
        { id: 'lastUpdateBy', label: t('lastUpdateBy'), width: 180 },
        { id: 'action', label: t('action'), width: 180, align: 'center' },
    ];

    const router = useRouter();
    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getConfigOption] = useListAllListboxGroupMutation();
    const [searchConfigGroup, { isLoading: isLoadingSearch }] = useSearchConfigGroupMutation();

    const { searchConfigGroupResult } = useAppSelector(selectMasterData);
    const selectedAuthMenu = useAppSelector(state => selectAuthMenuById(state, menuId));

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});
    const [searchResult, setSearchResult] = useState<BasePaginateResponse<ConfigGroup>>({} as BasePaginateResponse<ConfigGroup>);

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const notFound = (!searchResult?.data?.content.length) && !isLoadingSearch;

    const searchConfigGroupApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        dispatch(setSearchConfigGroupResult(undefined));
        try {
            await searchConfigGroup({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form action
    const onSubmit = (valueForm: ConfigGroupSearchRequest) => {
        const params = getQueryParam({
            pageNo: 1,
            pageSize: PAGE_SIZE_DEFAULT,
            ...valueForm,
        });
        setRowsPerPage(PAGE_SIZE_DEFAULT);
        setParamToRouter(params);
    }

    const onReset = () => {
        router.push(`${ROOT_ADMIN}/master-data/config-group`);
        searchConfigGroupApi();
        setOrder('');
        setOrderBy('');
    }
    // Form action

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
        router.push(`${ROOT_ADMIN}/master-data/config-group${params}`);
        searchConfigGroupApi();
    }
    // Pageging

    // Row action
    const onInquiryRow = async (row: ConfigGroup) => {
        // await getByCode({ listboxGroup: row.listboxGroup }).unwrap();
        router.push(`${ROOT_ADMIN}/master-data/config-group/inquiry/${row.listboxGroup}`);
    }

    const onEditRow = async (row: ConfigGroup) => {
        // await getByCode({ listboxGroup: row.listboxGroup }).unwrap();
        router.push(`${ROOT_ADMIN}/master-data/config-group/modify/${row.listboxGroup}`);
    }

    const onAddConfigGroup = () => {
        dispatch(setConfigGroupDetail({}));
        router.push(`${ROOT_ADMIN}/master-data/config-group/${PAGE_ADD}`);
    }
    // Row action

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.delete,
        })
    }

    const saveSuccess = () => {
        quickEdit.onFalse();
        // searchConfigGroupApi();
    }

    const loadContent = async () => {
        await getConfigOption().unwrap();
        searchConfigGroupApi();
    }

    useEffect(() => {
        setSearchResult({} as BasePaginateResponse<ConfigGroup>);
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (searchConfigGroupResult) {
            setSearchResult(searchConfigGroupResult);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchConfigGroupResult])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <CustomBreadcrumbs
                heading={t('masterData.configGroup.title')}
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.root },
                    { name: t('search'), href: paths.masterData.provinces },
                    { name: t('masterData.configGroup.search') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Grid container spacing={3}>
                <CardCustom title={t('masterData.configGroup.search')}
                    action={
                        selectedAuthMenu?.add &&
                        <ButtonAdd
                            onClick={() => onAddConfigGroup()}
                            addLabel={t('masterData.configGroup.add')}
                        />
                    }
                >
                    <Grid item xs={12} md={12}>
                        <ConfigGroupSearchCriteria
                            isLoading={false}
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
                                    rowCount={searchResult?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchResult?.data?.content?.map((row) => (
                                        <ConfigGroupTableRow
                                            selectedAuthMenu={selectedAuthMenu}
                                            key={row.listboxGroup}
                                            row={row}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!searchResult) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (!searchResult) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchResult?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        totalPages={searchResult?.data?.totalPages}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
                <ConfigGroupFormDialog onSuccess={saveSuccess} open={quickEdit.value} onClose={quickEdit.onFalse} />
            </Grid>
        </Container>
    )
}

export default ConfigGroupSearchView;
