import { useState, useCallback } from "react";

import { Grid, Table, Button, TableBody, Container, TableContainer } from "@mui/material";

import { useRouter } from "src/routes/hooks";
import { paths, ROOT_ADMIN } from 'src/routes/paths';
import { useLocationChange } from "src/routes/hooks/use-search-params";

import { PAGE_SIZE_DEFAULT } from "src/utils/constants";
import { setParamSearch } from "src/utils/set-param-search";

import { useSearchProductMutation } from "src/api/product.api";

import Iconify from "src/components/iconify";
import Scrollbar from 'src/components/scrollbar';
import CardCustom from "src/components/card/card-custom";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { TableNoData, TableSkeleton, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { ProductModel } from "src/types/product.type";

import { getStringObj } from "../defaultValue";
import ProductSearchCriteria from "../product-search-criteria";
import ProductSearchTableRow from "../product-search-table-row";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'action', label: 'ดำเนินการ', width: 180, align: 'center' },
    { id: 'productName', label: 'Product', width: 500 },
    { id: 'lastUpdateBy', label: 'Original', width: 180, align: 'center' },
    { id: 'lastUpdateDtm', label: 'Thumbnail', width: 180, align: 'center' }
];

// ----------------------------------------------------------------------

const ProductSearchView = () => {

    const router = useRouter();
    const settings = useSettingsContext();

    const [searchProductTemplate, { data: searchProductTemplateData, isLoading: isLoadingSearch }] = useSearchProductMutation();

    const notFound = (!searchProductTemplateData?.data?.content?.length || searchProductTemplateData?.data?.content?.length === 0) && !isLoadingSearch;

    // Pageging
    const [order, setOrder] = useState<any>('asc');
    const [orderBy, setOrderBy] = useState<any>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(PAGE_SIZE_DEFAULT);
    const [dense, setDense] = useState(false);
    // Pageging

    const searchProductTemplateApi = useCallback(async () => {
        const body = getStringObj();
        setRowsPerPage(Number(body.pageSize));
        try {
            await searchProductTemplate({ ...body }).unwrap();
        } catch (error) {
            console.error(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addProduct = () => {
        router.push(`${ROOT_ADMIN}/module/product/add`);
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
        router.push(`${ROOT_ADMIN}/module/product${params}`);
    }
    // Pageging

    useLocationChange(() => {
        searchProductTemplateApi();
    });

    const downloadImageByUrl = async (
        url: string,
        fileName = 'image.jpg'
    ) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to download image');
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    };

    const onDownloadOriginalFile = (row: ProductModel) => {
        if (row?.downloadImageUrl) {
            downloadImageByUrl(row?.downloadImageUrl, `${row?.productName}.jpg`);
        }
    };

    const onDownloadThumbnailFile = (row: ProductModel) => {
        if (row?.downloadImageThumbnailUrl) {
            downloadImageByUrl(row?.downloadImageThumbnailUrl, `ThumbnailUrl-${row?.productName}.jpg`);
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Product"
                links={[
                    { name: 'Dashboard Overview', href: paths.dashboard.general.overview },
                    { name: 'Product' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />
            <Grid container spacing={3}>
                <CardCustom
                    title='Search Product'
                    action={
                        <Button
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            sx={{ minWidth: 100 }}
                            color="inherit"
                            size='medium'
                            variant="contained"
                            type="button"
                            onClick={() => addProduct()}
                        >
                            Create Product
                        </Button>
                    }>
                    <Grid item xs={12} md={12}>
                        <ProductSearchCriteria
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
                                    rowCount={searchProductTemplateData?.data?.numberOfElements}
                                    onSort={(e: string) => onSort(e)}
                                />
                                <TableBody>
                                    {searchProductTemplateData?.data?.content?.map((row) => (
                                        <ProductSearchTableRow
                                            key={row.id}
                                            row={row}
                                            onDownloadOriginalFile={() => onDownloadOriginalFile(row)}
                                            onDownloadThumbnailFile={() => onDownloadThumbnailFile(row)}
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
                        count={searchProductTemplateData?.data?.totalElements || 0}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={onChangePage}
                        totalPages={searchProductTemplateData?.data?.totalPages}
                        onRowsPerPageChange={onChangeRowsPerPage}
                        dense={dense}
                        onChangeDense={onChangeDense}
                    />
                </CardCustom>
            </Grid>
        </Container>
    )
};

export default ProductSearchView;