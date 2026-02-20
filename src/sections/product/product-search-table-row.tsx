import { memo } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { ActionButtonSearch } from 'src/components/table';

import { ProductModel } from 'src/types/product.type';

type PropsActionMenu = {
    add?: boolean;
    icon?: string;
    id?: string;
    inactive?: boolean;
    path?: string;
    perform?: boolean;
    title?: string;
    titleEn?: string;
    update?: boolean;
    view?: boolean;
};

type Props = {
    selected?: boolean;
    onDownloadOriginalFile?: VoidFunction;
    onDownloadThumbnailFile?: VoidFunction;
    row: ProductModel;
    selectedAuthMenu?: PropsActionMenu;
};

const ProductSearchTableRow = memo(({
    row,
    selected,
    onDownloadOriginalFile,
    selectedAuthMenu,
    onDownloadThumbnailFile
}: Props) => {

    const { productName, downloadImageThumbnailUrl, downloadImageUrl } = row;

    return (
        <TableRow hover selected={selected}>
            <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
                <ActionButtonSearch
                    selectedAuthMenu={selectedAuthMenu}
                    onDownloadXml={onDownloadOriginalFile}
                    onDownloadPdf={onDownloadThumbnailFile}
                />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }} align='left'>{productName || '-'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <img src={downloadImageUrl} alt={productName} width={50} />
            </TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <img src={downloadImageThumbnailUrl} alt={productName} width={50} />
            </TableCell>
        </TableRow>
    );
})

export default ProductSearchTableRow;