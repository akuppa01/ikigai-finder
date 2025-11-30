'use client';

import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { Entry, ColumnKey } from '@/lib/types';
import { useBoardStore } from '@/hooks/useBoardStore';
import EntryCard from './EntryCard';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface ColumnProps {
  columnKey: ColumnKey;
  entries: Entry[];
  title: string;
  color: string;
  description: string;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
}

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

const Column = memo(function Column({
  columnKey,
  entries,
  color,
  onNavigateNext,
  onNavigatePrevious,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
    data: {
      type: 'column',
      columnKey,
    },
  });

  // Only subscribe to the specific values we need from the store
  // This prevents re-renders when unrelated store values change
  const selectedEntryId = useBoardStore(state => state.selectedEntryId);
  const editingEntryId = useBoardStore(state => state.editingEntryId);
  const addEntry = useBoardStore(state => state.addEntry);
  const updateEntry = useBoardStore(state => state.updateEntry);
  const deleteEntry = useBoardStore(state => state.deleteEntry);
  const setSelectedEntry = useBoardStore(state => state.setSelectedEntry);
  const setEditingEntry = useBoardStore(state => state.setEditingEntry);

  const config = columnConfig[columnKey];
  const isAtLimit = entries.length >= 25;

  const handleAddEntry = () => {
    if (!isAtLimit) {
      addEntry(columnKey);
    }
  };

  const handleSelect = (entryId: string) => {
    setSelectedEntry(entryId);
  };

  const handleEdit = (entryId: string) => {
    setEditingEntry(entryId);
  };

  const handleUpdate = (entryId: string, text: string) => {
    updateEntry(entryId, text);
    setEditingEntry(null);
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Removed backdrop-blur-sm (GPU-intensive) and replaced with solid background
        // Removed scale transforms on hover (trigger layout recalculations)
        // Changed transition-all to specific properties only
        'flex flex-col h-auto min-h-[300px] sm:min-h-[400px] lg:h-full lg:min-h-[500px] bg-white/98 rounded-xl sm:rounded-2xl border-2 border-gray-200/60 transition-[box-shadow,border-color] duration-200 shadow-lg',
        isOver && 'border-blue-400 bg-blue-50/40 shadow-xl',
        'hover:shadow-lg hover:border-gray-300'
      )}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold truncate" style={{ color }}>
              {config.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium truncate">{config.description}</p>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white px-2 sm:px-3 py-1 rounded-full shadow-md ml-2" style={{ backgroundColor: color }}>
            {entries.length}/25
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 p-2 sm:p-3 space-y-2 overflow-y-auto">
        {entries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isSelected={selectedEntryId === entry.id}
            isEditing={editingEntryId === entry.id}
            onSelect={() => handleSelect(entry.id)}
            onEdit={() => handleEdit(entry.id)}
            onDelete={() => handleDelete(entry.id)}
            onUpdate={text => handleUpdate(entry.id, text)}
            onCancelEdit={handleCancelEdit}
            columnColor={color}
            onNavigateNext={onNavigateNext}
            onNavigatePrevious={onNavigatePrevious}
          />
        ))}

        {/* Drop zone when empty */}
        {entries.length === 0 && (
          <div className="flex items-center justify-center h-24 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl text-gray-500">
            <p className="text-xs sm:text-sm text-center px-2">Drop items here or add new ones</p>
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <button
          onClick={handleAddEntry}
          disabled={isAtLimit}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-[border-color,background-color] duration-200',
            isAtLimit
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600'
          )}
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">
            {isAtLimit ? 'Limit reached (25)' : 'Add item'}
          </span>
        </button>
      </div>
    </div>
  );
});

export default Column;
