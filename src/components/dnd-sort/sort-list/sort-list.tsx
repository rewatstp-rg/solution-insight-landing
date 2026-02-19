import React from "react";
import type { ReactNode } from "react";
// import type { Active } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
    useSensor,
    DndContext,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from "@dnd-kit/core";

import "./sort-list.css";
import { DragHandle, SortableItem } from "../index";

interface Props {
    items: any[];
    onChange(items: any[]): void;
    renderItem(item: any, index: number): ReactNode;
}

export function SortableList({
    items,
    onChange,
    renderItem
}: Props) {

    // const [active, setActive] = useState<Active | null>(null);

    // const activeItem = useMemo(
    //     () => items.find((item) => item.id === active?.id),
    //     [active, items]
    // );

    // const activeIndex = useMemo(
    //     () => items.findIndex((item) => item.id === active?.id),
    //     [active, items]
    // );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    return (
        <>
            {items && items.length > 0 ? <DndContext
                sensors={sensors}
                onDragStart={() => {
                    // setActive(Drag.active);
                }}
                onDragEnd={(Drag) => {
                    if (Drag.over && Drag.active.id !== Drag.over?.id) {
                        const activeIndexDrag = items.findIndex(({ id }) => id === Drag.active.id);
                        const overIndex = items.findIndex(({ id }) => id === Drag?.over?.id);
                        onChange(arrayMove(items, activeIndexDrag, overIndex));
                    }
                       

                    // setActive(null);
                }}
                onDragCancel={() => {
                    // setActive(null);
                }}
            >
                <SortableContext items={items}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>{renderItem(item, index)}</React.Fragment>
                    ))}
                </SortableContext>
                {/* <SortOverlay>
                {activeItem ? renderItem(activeItem, activeIndex) : null}
            </SortOverlay> */}
            </DndContext> : null}
        </>

    );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
