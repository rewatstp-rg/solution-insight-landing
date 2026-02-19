import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useMemo, useContext, createContext } from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import type { UniqueIdentifier, DraggableSyntheticListeners } from "@dnd-kit/core";

import { Box, Tooltip, useTheme, TableRow, IconButton } from "@mui/material";

// import SvgColor from "src/components/svg-color";C:\Project\checkrace\react v.2\admin-checkrace-2024\src\components\dnd-sort\sort-list\sort-list.tsx:14:22
import Iconify from "src/components/iconify";

import "./sort-item.css";

interface Props {
  id: UniqueIdentifier;
  type: string;
  isTable?: boolean;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() { }
});

export function SortableItem({ children, id, type, isTable = false }: PropsWithChildren<Props>) {

  const isDetail = () => type === 'inquiry';

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <SortableItemContext.Provider value={context}>
      {
        isTable ?
          <TableRow hover ref={setNodeRef} style={style}>
            {children}
          </TableRow>
          :
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: isDetail() ? '1fr 1fr 1fr 1fr' : '50px 180px 180px 180px 1fr 1fr',
            }}
            justifyItems='center'
            alignItems='center'
            sx={{ mb: 2, mt: 2 }}
            className="SortableItem" ref={setNodeRef} style={style}
          >
            {children}
          </Box>
      }
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const theme = useTheme();
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  return (
    <Tooltip title="เลื่อน" placement="top" arrow >
      <IconButton {...attributes} {...listeners} ref={ref} sx={{ color: theme.palette.grey[500] }}>
        <Iconify icon="mingcute:move-line" />
      </IconButton>
    </Tooltip>

  );
}
