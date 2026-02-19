import { Controller, useFormContext } from 'react-hook-form';

import { Box, Typography } from '@mui/material';

import { Editor } from '../editor';
import type { EditorProps } from '../editor';

// ----------------------------------------------------------------------

type Props = EditorProps & {
  name: string;
  viewType?: string;
  label?: string;
  isImageBlock?: boolean;
};

export function RHFEditor({ name, label, viewType, helperText, isImageBlock, ...other }: Props) {

  const {
    control,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const renderContent = (message: string) => (
    <Box
      dangerouslySetInnerHTML={{ __html: message }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        viewType === 'inquiry' ?
          <Box>
            {
              label && <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {label}
              </Typography>
            }
            {renderContent(field.value)}
          </Box> :
          <>
            {
              label && <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {label}
              </Typography>
            }
            <Editor
              {...field}
              isImageBlock={isImageBlock}
              error={!!error}
              helperText={error?.message ?? helperText}
              resetValue={isSubmitSuccessful}
              {...other}
            />
          </>

      )}
    />
  );
}
