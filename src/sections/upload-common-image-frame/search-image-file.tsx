import { useEffect } from "react";

import { urlToBase64, removeDataPrefix, downloadImageFromBase64New } from "src/utils/getPathImageByfile64";

import { useSearchImageFrameByTypeMutation } from "src/api/common.api";

import Image from "src/components/image";
import { DynamicTable, DynamicTableRow, ActionButtonSearch } from "src/components/table";

import { ColumnDynamic } from "src/types/table.type";

export default function SearchImageFile({
    isUploadSuccess
}: { isUploadSuccess: boolean }) {

    const [searchImageFrameByType, { isLoading, data }] = useSearchImageFrameByTypeMutation();

    const onDownload = async (row) => {
        await urlToBase64(row.filePath).then((base64) => downloadImageFromBase64New({ name: row.fileName, file: removeDataPrefix(base64) }));
    }

    const columns: ColumnDynamic<any>[] = [
        {
            id: 'action',
            label: 'ดำเนินการ',
            align: 'center',
            width: 150,
            render: (row) => (
                <ActionButtonSearch
                    onDownload={() => onDownload(row)}
                />
            ),
        },
        {
            id: 'filePath',
            label: 'รูปภาพ',
            align: 'left',
            flex: 1,
            render: (row) => (
                <Image
                    src={row.filePath}
                    alt={row.fileName}
                    width={50}
                />
            ),
        },
        {
            id: 'fileName',
            label: 'ชื่อรูปภาพ',
            align: 'left',
            flex: 1,
        },
    ];

    const loadContent = () => {
        searchImageFrameByType({ uploadType: 'RUN_CRAFT_2025', pageNo: 0, pageSize: 15 });
    }

    useEffect(() => {
        loadContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUploadSuccess]);

    return (
        <DynamicTable
            overflow="auto"
            maxHeight="calc(100vh - 300px)"
            minHeight="calc(100vh - 300px)"
            columns={columns}
            rows={data?.data.content ?? []}
            isLoading={isLoading}
            // notFound={notFound}
            rowId="fileName"
            renderRow={(row, index) => (
                <DynamicTableRow
                    key={`row-${index}`}
                    row={row}
                    columns={columns}
                />
            )}
        />
    );
}