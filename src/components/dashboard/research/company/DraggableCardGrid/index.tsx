import React, { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import styles from './styles.module.css';

interface DraggableCardGridProps {
    children: React.ReactNode[];
    onOrderChange?: (newOrder: string[]) => void;
    cardIds: string[];
}

export default function DraggableCardGrid({ 
    children,
    onOrderChange,
    cardIds
}: DraggableCardGridProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<string[]>(cardIds);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);

            const newOrder = arrayMove(items, oldIndex, newIndex);
            setItems(newOrder);
            onOrderChange?.(newOrder);
        }

        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={items}
                strategy={rectSortingStrategy}
            >
                <div className={styles.grid}>
                    {children}
                </div>
            </SortableContext>
        </DndContext>
    );
} 