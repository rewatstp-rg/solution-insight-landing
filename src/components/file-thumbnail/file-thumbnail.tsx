import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Theme, SxProps } from '@mui/material/styles';

import DownloadButton from './download-button';
import { fileData, fileThumb, fileFormat } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
};

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  sx,
  imgSx,
}: FileIconProps) {
  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);
  // imageView
  // console.log("🚀 ~ file: file-thumbnail.tsx:88 ~ imageView:", imageView)

  // console.log("🚀 ~ file: file-thumbnail.tsx:31 ~ preview:", preview)
  // console.log("🚀 ~ file: file-thumbnail.tsx:31 ~ format:", format)

  const renderContent =
    (format === 'image' || format === 'JPG') && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          top: '1rem',
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: '200px',
            height: '200px',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
