import type { Editor, EditorOptions, NodeViewProps } from '@tiptap/react';

import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type EditorProps = Partial<EditorOptions> & {
  value?: string;
  error?: boolean;
  fullItem?: boolean;
  resetValue?: boolean;
  sx?: SxProps<Theme>;
  placeholder?: string;
  helperText?: React.ReactNode;
  onChange?: (value: string) => void;
  slotProps?: {
    wrap: SxProps<Theme>;
  };
  isImageBlock?: boolean;
};

export type EditorToolbarProps = {
  fullScreen: boolean;
  editor: Editor | null;
  onToggleFullScreen: () => void;
  fullItem?: EditorProps['fullItem'];
  isImageBlock?: boolean;
};

export type EditorToolbarItemProps = {
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  valueColor?: any;
  editor?: any;
};

export type EditorCodeHighlightBlockProps = {
  node: {
    attrs: NodeViewProps['node']['attrs'] & {
      language?: string;
    };
  };
} & NodeViewProps;
