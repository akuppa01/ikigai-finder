'use client';

import { useEffect, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ColumnKey, Entry } from '@/lib/types';
import { useBoardStore } from '@/hooks/useBoardStore';
import Column from './Column';
import EntryCard from './EntryCard';

const columnConfig = {
  love: {
    title: 'LOVE',
    description: 'What you love',
    color: '#4F46E5',
  },
  good_at: {
    title: 'GOOD AT',
    description: "What you're good at",
    color: '#10B981',
  },
  paid_for: {
    title: 'EARN',
    description: 'What you can be paid for',
    color: '#F59E0B',
  },
  world_needs: {
    title: 'NEEDS',
    description: 'What the world needs',
    color: '#FB7185',
  },
};

export default function Board() {
  const {
    columns,
    selectedEntryId,
    editingEntryId,
    setSelectedEntry,
    setEditingEntry,
    copyEntry,
    moveEntry,
  } = useBoardStore();

  // Memoize navigation functions to prevent re-creation on every render
  const allEntries = useMemo(() => Object.values(columns).flat(), [columns]);

  const navigateToNext = useCallback(() => {
    if (!editingEntryId) return;

    const currentIndex = allEntries.findIndex(e => e.id === editingEntryId);

    if (currentIndex < allEntries.length - 1) {
      const nextEntry = allEntries[currentIndex + 1];
      setEditingEntry(nextEntry.id);
    }
  }, [editingEntryId, allEntries, setEditingEntry]);

  const navigateToPrevious = useCallback(() => {
    if (!editingEntryId) return;

    const currentIndex = allEntries.findIndex(e => e.id === editingEntryId);

    if (currentIndex > 0) {
      const prevEntry = allEntries[currentIndex - 1];
      setEditingEntry(prevEntry.id);
    }
  }, [editingEntryId, allEntries, setEditingEntry]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Slightly increased for better mobile touch handling
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context }) => {
        return (
          context.droppableContainers.get(event.target.id)?.rect.current
            .translate ?? null
        );
      },
    })
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingEntryId) return; // Don't handle keys when editing

      if (e.key === 'Delete' && selectedEntryId) {
        e.preventDefault();
        // Delete logic handled by EntryCard
      } else if (e.key === 'Escape') {
        setSelectedEntry(null);
        setEditingEntry(null);
      } else if (e.key === 'Enter' && selectedEntryId) {
        e.preventDefault();
        setEditingEntry(selectedEntryId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntryId, editingEntryId, setSelectedEntry, setEditingEntry]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setSelectedEntry(active.id as string);
  };

  // Optimized: Throttle drag over handler to reduce re-renders
  // The visual feedback is already handled by Column's isOver state from useDroppable
  // No need to do expensive lookups on every drag event
  const handleDragOver = (event: DragOverEvent) => {
    // Minimal processing - visual feedback handled by dnd-kit's isOver state
    // This prevents expensive column lookups on every mouse move during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setSelectedEntry(null);
      return;
    }

    const activeId = active.id as string;

    // Find source entry
    let sourceEntry: Entry | null = null;
    for (const columnKey in columns) {
      const column = columns[columnKey as ColumnKey];
      const entry = column.find(e => e.id === activeId);
      if (entry) {
        sourceEntry = entry;
        break;
      }
    }

    if (!sourceEntry) return;

    // Handle dropping on a column
    if (over.data.current?.type === 'column') {
      const targetColumn = over.data.current.columnKey as ColumnKey;
      const targetPosition = columns[targetColumn].length;

      if (sourceEntry.column === targetColumn) {
        // Moving within same column - just reorder
        moveEntry(activeId, targetColumn, targetPosition);
      } else {
        // Copying to different column
        copyEntry(activeId, targetColumn, targetPosition);
      }
    }

    setSelectedEntry(null);
  };

  // Memoize active entry lookup to prevent recalculation on every render
  const activeEntry = useMemo(() => {
    if (!selectedEntryId) return null;

    for (const columnKey in columns) {
      const column = columns[columnKey as ColumnKey];
      const entry = column.find(e => e.id === selectedEntryId);
      if (entry) return entry;
    }
    return null;
  }, [selectedEntryId, columns]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full lg:h-full">
        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 h-full">
          {(Object.keys(columnConfig) as ColumnKey[]).map(columnKey => {
            const config = columnConfig[columnKey];
            const columnEntries = columns[columnKey];

            return (
              <SortableContext
                key={columnKey}
                items={columnEntries.map(entry => entry.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  columnKey={columnKey}
                  entries={columnEntries}
                  title={config.title}
                  color={config.color}
                  description={config.description}
                  onNavigateNext={navigateToNext}
                  onNavigatePrevious={navigateToPrevious}
                />
              </SortableContext>
            );
          })}
        </div>

        {/* Mobile Stack */}
        <div className="lg:hidden space-y-4 sm:space-y-6 pb-8">
          {(Object.keys(columnConfig) as ColumnKey[]).map(columnKey => {
            const config = columnConfig[columnKey];
            const columnEntries = columns[columnKey];

            return (
              <SortableContext
                key={columnKey}
                items={columnEntries.map(entry => entry.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  columnKey={columnKey}
                  entries={columnEntries}
                  title={config.title}
                  color={config.color}
                  description={config.description}
                  onNavigateNext={navigateToNext}
                  onNavigatePrevious={navigateToPrevious}
                />
              </SortableContext>
            );
          })}
        </div>
      </div>

      {/* Drag Overlay - Optimized with will-change for GPU acceleration */}
      <DragOverlay>
        {activeEntry ? (
          <div className="opacity-90" style={{ willChange: 'transform' }}>
            <EntryCard
              entry={activeEntry}
              isSelected={true}
              isEditing={false}
              onSelect={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
              onCancelEdit={() => {}}
              columnColor={columnConfig[activeEntry.column].color}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
