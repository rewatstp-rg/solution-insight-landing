import { StackProps } from '@mui/material/Stack';
import { Theme, SxProps } from '@mui/material/styles';
import { ListItemButtonProps } from '@mui/material/ListItemButton';

// ----------------------------------------------------------------------

export type SlotProps = {
  gap?: number;
  rootItem?: SxProps<Theme>;
  subItem?: SxProps<Theme>;
  subHeader?: SxProps<Theme>;
  currentRole?: string;
};

export type NavItemStateProps = {
  depth?: number;
  open?: boolean;
  active?: boolean;
  hasChild?: boolean;
  currentRole?: string;
  externalLink?: boolean;
};

export type NavItemBaseProps = {
  title: string;
  titleEn?: string;
  path: string;
  icon?: React.ReactElement;
  info?: React.ReactElement;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: any;
};

export type NavItemProps = ListItemButtonProps &
  NavItemStateProps &
  NavItemBaseProps & {
    slotProps?: SlotProps;
  };

export type NavListProps = {
  data: NavItemBaseProps;
  depth: number;
  slotProps?: SlotProps;
};

export type NavSubListProps = {
  data: NavItemBaseProps[];
  depth: number;
  slotProps?: SlotProps;
};

export type NavGroupProps = {
  subHeader?: string;
  subHeaderEn?: string;
  items: NavItemBaseProps[];
  slotProps?: SlotProps;
};

export type NavProps = StackProps & {
  data: {
    subHeaderEn?: string;
    subHeader: string;
    items: NavItemBaseProps[];
  }[];
  slotProps?: SlotProps;
};
