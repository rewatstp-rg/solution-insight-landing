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
    setSubDistrictDetail,
    setListDistrictOption,
    setSubDistrictDetailDialogMode
} from 'src/slices/master-data.slices';
import {
    useListProvinceMutation,
    useGetConfigByGroupMutation,
    useSearchSubDistrictMutation,
    useGetBySubDistrictCodeMutation
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
    MasterSubDistrictModel,
    MasterDistrictSearchRequest,
} from 'src/types/master-config';

import { getStringObj } from '../defaultValue';
import SubDistrictTableRow from '../sub-district-table-row';
import SubDistrictFormDialog from '../sub-district-form-dialog';
import SubDistrictSearchCriteria from '../sub-district-search-criteria';

// ---------------------------------------------------------------------

const menuId = 'MN020';

const SubDistrictSearchView = () => {

    const { t } = useTranslate();

    const TABLE_HEAD = [
        { id: 'subDistrictCode', label: t('masterData.subDistrict.subDistrictCode'), width: 180, align: 'center' },
        { id: 'subDistrictNameTh', label: t('masterData.subDistrict.subDistrictNameTh'), width: 180 },
        { id: 'subDistrictNameEng', label: t('masterData.subDistrict.subDistrictNameEn'), width: 180 },
        { id: 'postcode', label: t('masterData.subDistrict.zipCode'), width: 180 },
        { id: 'lastUpdateDtm', label: t('lastUpdateDtm'), width: 180 },
        { id: 'lastUpdateBy', label: t('lastUpdateBy'), width: 180 },
        { id: 'status', label: t('masterData.subDistrict.status'), width: 150 },
        { id: 'action', label: t('action'), width: 180, align: 'center' },
    ];

    const router = useRouter();
    const quickEdit = useBoolean();
    const dispatch = useAppDispatch();
    const settings = useSettingsContext();

    const [getProvinceOption] = useListProvinceMutation();
    const [getConfigOption] = useGetConfigByGroupMutation();
    const [searchSubDistrict, { isLoading: isLoadingSearchSubDistrict }] = useSearchSubDistrictMutation();
    const [getByCode, { isLoading: isLoadingGetByCode }] = useGetBySubDistrictCodeMutation();

    const { searchSubDistrictResult } = useAppSelector(selectMasterData);
    const selectedAuthMenu = useAppSelector(state => selectAuthMenuById(state, menuId));

    const [dialogMessage, setDialogMessage] = useState<AlertDialogModel>({});

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const notFound = (!searchSubDistrictResult?.data?.content?.length) && !isLoadingSearchSubDistrict;

    const searchSubDistrictApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchSubDistrict({ ...body }).unwrap();
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
        router.push(`${ROOT_ADMIN}/master-data/sub-district`);
        searchSubDistrictApi();
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
        router.push(`${ROOT_ADMIN}/master-data/sub-district${params}`);
        searchSubDistrictApi();
    }
    // Pageging

    const onAddSubDistrict = () => {
        quickEdit.onTrue();
        dispatch(setSubDistrictDetailDialogMode(DIALOG_MODE_KEY.ADD));
        dispatch(setSubDistrictDetail({}));
    }

    // Row action
    const onInquiryRow = async (row: MasterSubDistrictModel) => {
        quickEdit.onTrue();
        dispatch(setSubDistrictDetailDialogMode(DIALOG_MODE_KEY.INQUIRY));
        await getByCode({ subDistrictCode: row.subDistrictCode }).unwrap();
    }

    const onEditRow = async (row: MasterSubDistrictModel) => {
        quickEdit.onTrue();
        dispatch(setSubDistrictDetailDialogMode(DIALOG_MODE_KEY.MODIFY));
        await getByCode({ subDistrictCode: row.subDistrictCode }).unwrap();
    }
    // Row action

    const onCloseDialogAlert = () => {
        setDialogMessage({
            open: false,
            type: DAILOG_KEY.delete,
        })
    }

    const getListSubDistrictStatusOption = async () => {
        const body: Config = {
            listboxGroup: 'PROVINCE_STATUS',
            status: 'ACTIVE'
        }
        await getConfigOption(body);
    }

    const saveSuccess = () => {
        quickEdit.onFalse();
        searchSubDistrictApi();
    }

    const loadContent = async () => {
        await getListSubDistrictStatusOption();
        await getProvinceOption().unwrap();
        searchSubDistrictApi();
    }

    useEffect(() => {
        dispatch(setListDistrictOption([]));
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchSubDistrictApi])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <AlertDialog model={dialogMessage} onCancel={onCloseDialogAlert} />
            <CustomBreadcrumbs
                heading={t('masterData.subDistrict.title')}
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.root },
                    { name: t('search'), href: paths.masterData.provinces },
                    { name: t('masterData.subDistrict.search') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Grid container spacing={3}>
                <CardCustom title={t('masterData.subDistrict.search')} action={
                    selectedAuthMenu?.add &&
                    <ButtonAdd
                        onClick={() => onAddSubDistrict()}
                        addLabel={t('masterData.subDistrict.add')}
                    />
                }>
                    <Grid item xs={12} md={12}>
                        <SubDistrictSearchCriteria
                            isLoading={isLoadingSearchSubDistrict}
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
                                    rowCount={searchSubDistrictResult?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchSubDistrictResult?.data?.content?.map((row) => (
                                        <SubDistrictTableRow
                                            selectedAuthMenu={selectedAuthMenu}
                                            key={row.id}
                                            row={row}
                                            onInquiryRow={() => onInquiryRow(row)}
                                            onEditRow={() => onEditRow(row)}
                                        />
                                    ))}
                                    {
                                        (!isLoadingSearchSubDistrict && !isLoadingGetByCode) && <TableNoData notFound={notFound} />
                                    }
                                    {
                                        (isLoadingSearchSubDistrict || isLoadingGetByCode) && <TableSkeleton />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={searchSubDistrictResult?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        totalPages={searchSubDistrictResult?.data?.totalPages}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
            <SubDistrictFormDialog onSuccess={saveSuccess} open={quickEdit.value} onClose={quickEdit.onFalse} />
        </Container>
    )
}

export default SubDistrictSearchView;
