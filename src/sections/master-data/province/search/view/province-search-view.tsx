// import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Container } from '@mui/system';
import { Grid, Table, TableBody, TableContainer } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { paths, ROOT_ADMIN } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import getQueryParam from 'src/utils/getQueryParam';
import { setParamSearch } from 'src/utils/set-param-search';
import { DAILOG_KEY, DIALOG_MODE_KEY, PAGE_SIZE_DEFAULT } from 'src/utils/constants';

import { useTranslate } from 'src/locales';
import { selectAuthMenuById } from 'src/slices/menu.slices';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { selectMasterData, setProvinceDetail, setProvinceDetailDialogMode } from 'src/slices/master-data.slices';
import {
    useListProvinceMutation,
    useSearchProvinceMutation,
    useGetConfigByGroupMutation,
    useGetProvinceByCodeMutation
} from 'src/api/master-data.api';

import Scrollbar from 'src/components/scrollbar';
import CardCustom from 'src/components/card/card-custom';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { useSettingsContext } from 'src/components/settings';
import ButtonAdd from 'src/components/button-forom/button-add';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { AlertDialogModel } from 'src/types/alert-dialog.type';
import { Config, MasterProvinceSearchRequest, MasterProvinceSearchResponse } from 'src/types/master-config';

import { getStringObj } from '../defaultValue';
import ProvinceTableRow from '../province-table-row';
import ProvinceFormDialog from '../province-form-dialog';
import ProvinceSearchCriteria from '../province-search-criteria';

// ----------------------------------------------------------------------

const menuId = 'MN018';

const ProvinceSearchView = () => {

    const { t } = useTranslate();

    const TABLE_HEAD = [
        { id: 'provinceCode', label: t('masterData.province.provinceCode'), width: 100, align: 'center' },
        { id: 'provinceNameTh', label: t('masterData.province.provinceNameTh'), width: 180 },
        { id: 'provinceNameEng', label: t('masterData.province.provinceNameEn'), width: 180 },
        { id: 'lastUpdateDtm', label: t('lastUpdateDtm'), width: 180 },
        { id: 'lastUpdateBy', label: t('lastUpdateBy'), width: 180 },
        { id: 'statusDesc', label: t('masterData.province.status'), width: 150 },
        { id: 'action', label: t('action'), width: 180, align: 'center' },
    ];

    const router = useRouter();
    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getProvinceOption] = useListProvinceMutation();
    const [getConfigOption] = useGetConfigByGroupMutation();
    const [getByCode, { isLoading: isLoadingGetByCode }] = useGetProvinceByCodeMutation();
    const [searchProvince, { isLoading: isLoadingSearchProvince }] = useSearchProvinceMutation();

    const { searchProvinceResult } = useAppSelector(selectMasterData);
    const selectedAuthMenu = useAppSelector(state => selectAuthMenuById(state, menuId));

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const notFound = (!searchProvinceResult?.data?.content?.length) && !isLoadingSearchProvince;


    const searchProvinceApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchProvince({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form action
    const onSubmit = (valueForm: MasterProvinceSearchRequest) => {
        const params = getQueryParam({
            pageNo: 1,
            pageSize: PAGE_SIZE_DEFAULT,
            ...valueForm,
        });
        setRowsPerPage(PAGE_SIZE_DEFAULT);
        setParamToRouter(params);
    }

    const onReset = () => {
        router.push(`${ROOT_ADMIN}/master-data/province`);
        searchProvinceApi();
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
        router.push(`${ROOT_ADMIN}/master-data/province${params}`);
        searchProvinceApi();
    }
    // Pageging

    const onAddProvince = () => {
        quickEdit.onTrue();
        dispatch(setProvinceDetailDialogMode(DIALOG_MODE_KEY.ADD));
        dispatch(setProvinceDetail({}));
    }

    // Row action
    const onInquiryRow = async (row: MasterProvinceSearchResponse) => {
        quickEdit.onTrue();
        dispatch(setProvinceDetailDialogMode(DIALOG_MODE_KEY.INQUIRY));
        await getByCode({ provinceCode: row.provinceCode }).unwrap();
    }

    const onEditRow = async (row: MasterProvinceSearchResponse) => {
        quickEdit.onTrue();
        dispatch(setProvinceDetailDialogMode(DIALOG_MODE_KEY.MODIFY));
        await getByCode({ provinceCode: row.provinceCode }).unwrap();
    }
    // Row action

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.delete,
        })
    }

    const getListProvinceStatusOption = async () => {
        const body: Config = {
            listboxGroup: 'PROVINCE_STATUS',
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const saveSuccess = () => {
        quickEdit.onFalse();
        searchProvinceApi();
    }

    const loadContent = async () => {
        await getListProvinceStatusOption();
        await getProvinceOption();
        searchProvinceApi();
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchProvinceApi])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <CustomBreadcrumbs
                heading={t('masterData.province.title')}
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.root },
                    { name: t('search'), href: paths.masterData.provinces },
                    { name: t('masterData.province.search') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Grid container spacing={3}>
                <CardCustom title={t('masterData.province.search')} action={
                    selectedAuthMenu?.add &&
                    <ButtonAdd
                        onClick={() => onAddProvince()}
                        addLabel={t('masterData.province.add')}
                    />
                }>
                    <Grid item xs={12} md={12}>
                        <ProvinceSearchCriteria
                            isLoading={isLoadingSearchProvince}
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
                                    rowCount={searchProvinceResult?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchProvinceResult?.data?.content?.map((row) => (
                                        <ProvinceTableRow
                                            selectedAuthMenu={selectedAuthMenu}
                                            key={row.id}
                                            row={row}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearchProvince && !isLoadingGetByCode) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearchProvince || isLoadingGetByCode) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchProvinceResult?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        onChangeDense={onChangeDense}
                        totalPages={searchProvinceResult?.data?.totalPages}
                    />
                </CardCustom>
            </Grid>
            <ProvinceFormDialog onSuccess={saveSuccess} open={quickEdit.value} onClose={quickEdit.onFalse} />
        </Container>
    )
}

export default ProvinceSearchView;