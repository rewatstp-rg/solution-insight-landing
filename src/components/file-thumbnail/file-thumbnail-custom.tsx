import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Theme, SxProps } from '@mui/material/styles';

import { FileModel } from 'src/types/file.model';

import DownloadButton from './download-button';
import { fileThumb, fileFormat } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: FileModel;
  tooltip?: boolean;
  onDownload?:(e : any) => VoidFunction;
  sx?: SxProps<Theme>;
};

export default function FileThumbnailCustom({
  file,
  tooltip,
  onDownload,
  sx,
}: FileIconProps) {

  const { fileName = '', fileUrl = '' } = file;

  const format = fileFormat(fileName || fileUrl);

  if (tooltip) {
    return (
      <Tooltip title={fileName}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          <Box
            component="img"
            src={fileThumb(format)}
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              ...sx,
            }}
          />
          {onDownload && <DownloadButton onDownload={() => onDownload(file)} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
      {onDownload && <DownloadButton onDownload={() => onDownload(file)} />}
    </>
  );
}

