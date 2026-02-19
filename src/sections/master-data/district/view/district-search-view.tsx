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
import {
    selectMasterData,
    setDistrictDetail,
    setListDistrictOption,
    setDistrictDetailDialogMode
} from 'src/slices/master-data.slices';
import {
    useListProvinceMutation,
    useSearchDistrictMutation,
    useGetConfigByGroupMutation,
    useGetByDistrictCodeMutation
} from 'src/api/master-data.api';

import Scrollbar from 'src/components/scrollbar';
import CardCustom from 'src/components/card/card-custom';
import AlertDialog from 'src/components/dialog/alert-dialog';
import { useSettingsContext } from 'src/components/settings';
import ButtonAdd from 'src/components/button-forom/button-add';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { AlertDialogModel } from 'src/types/alert-dialog.type';
import {
    Config,
    MasterDistrictModel,
    MasterDistrictSearchRequest,
} from 'src/types/master-config';

import { getStringObj } from '../defaultValue';
import DistricteTableRow from '../district-table-row';
import DistricteFormDialog from '../district-form-dialog';
import DistricteSearchCriteria from '../district-search-criteria';

// ----------------------------------------------------------------------

const menuId = 'MN019';

const DistricteSearchView = () => {

    const { t } = useTranslate();

    const TABLE_HEAD = [
        { id: 'districtCode', label: t('masterData.district.districtCode'), width: 180, align: 'center' },
        { id: 'districtNameTh', label: t('masterData.district.districtNameTh'), width: 180 },
        { id: 'districtNameEng', label: t('masterData.district.districtNameEn'), width: 180 },
        { id: 'lastUpdateDtm', label: t('lastUpdateDtm'), width: 180 },
        { id: 'lastUpdateBy', label: t('lastUpdateBy'), width: 180 },
        { id: 'status', label: t('masterData.district.status'), width: 150 },
        { id: 'action', label: t('action'), width: 180, align: 'center' },
    ];

    const router = useRouter();
    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getProvinceOption] = useListProvinceMutation();
    const [getConfigOption] = useGetConfigByGroupMutation();
    const [searchDistrict, { isLoading: isLoadingSearchDistricte }] = useSearchDistrictMutation();
    const [getByCode, { isLoading: isLoadingGetByCode }] = useGetByDistrictCodeMutation();

    const { searchDistrictResult } = useAppSelector(selectMasterData);
    const selectedAuthMenu = useAppSelector(state => selectAuthMenuById(state, menuId));

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const notFound = (!searchDistrictResult?.data?.content?.length) && !isLoadingSearchDistricte;


    const searchDistrictApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchDistrict({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Form action
    const onSubmit = (valueForm: MasterDistrictSearchRequest) => {
        const params = getQueryParam({
            pageNo: 1,
            pageSize: PAGE_SIZE_DEFAULT,
            ...valueForm,
        });
        setRowsPerPage(PAGE_SIZE_DEFAULT);
        setParamToRouter(params);
    }

    const onReset = () => {
        router.push(`${ROOT_ADMIN}/master-data/district`);
        searchDistrictApi();
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
        router.push(`${ROOT_ADMIN}/master-data/district${params}`);
        searchDistrictApi();
    }
    // Pageging

    const onAddDistricte = () => {
        quickEdit.onTrue();
        dispatch(setDistrictDetailDialogMode(DIALOG_MODE_KEY.ADD));
        dispatch(setDistrictDetail({}));
    }

    // Row action
    const onInquiryRow = async (row: MasterDistrictModel) => {
        quickEdit.onTrue();
        dispatch(setDistrictDetailDialogMode(DIALOG_MODE_KEY.INQUIRY));
        await getByCode({ districtCode: row.districtCode }).unwrap();
    }

    const onEditRow = async (row: MasterDistrictModel) => {
        quickEdit.onTrue();
        dispatch(setDistrictDetailDialogMode(DIALOG_MODE_KEY.MODIFY));
        await getByCode({ districtCode: row.districtCode }).unwrap();
    }
    // Row action

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.delete,
        })
    }

    const getListDistricteStatusOption = async () => {
        const body: Config = {
            listboxGroup: 'PROVINCE_STATUS',
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const saveSuccess = () => {
        quickEdit.onFalse();
        searchDistrictApi();
    }

    const loadContent = async () => {
        await getListDistricteStatusOption();
        await getProvinceOption();
        searchDistrictApi();
    }

    useEffect(() => {
        dispatch(setListDistrictOption([]));
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchDistrictApi])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <CustomBreadcrumbs
                heading={t('masterData.district.title')}
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.root },
                    { name: t('search'), href: paths.masterData.provinces },
                    { name: t('masterData.district.search') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Grid container spacing={3}>
                <CardCustom title={t('masterData.district.search')} action={
                    selectedAuthMenu?.add &&
                    <ButtonAdd
                        onClick={() => onAddDistricte()}
                        addLabel={t('masterData.district.add')}
                    />
                }>
                    <Grid item xs={12} md={12}>
                        <DistricteSearchCriteria
                            isLoading={isLoadingSearchDistricte}
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
                                    rowCount={searchDistrictResult?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchDistrictResult?.data?.content?.map((row) => (
                                        <DistricteTableRow
                                            selectedAuthMenu={selectedAuthMenu}
                                            key={row.id}
                                            row={row}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearchDistricte && !isLoadingGetByCode) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearchDistricte || isLoadingGetByCode) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchDistrictResult?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        totalPages={searchDistrictResult?.data?.totalPages}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
            <DistricteFormDialog onSuccess={saveSuccess} open={quickEdit.value} onClose={quickEdit.onFalse} />
        </Container>
    )
}

export default DistricteSearchView;