'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Entry, ColumnKey } from '@/lib/types';
import { useBoardStore } from '@/hooks/useBoardStore';
import EntryCard from './EntryCard';
import { cn } from '@/lib/utils';

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

export default function Column({
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

  const {
    selectedEntryId,
    editingEntryId,
    addEntry,
    updateEntry,
    deleteEntry,
    setSelectedEntry,
    setEditingEntry,
  } = useBoardStore();

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
    <motion.div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full min-h-[500px] bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 transition-all duration-300 shadow-lg',
        isOver && 'border-blue-400 bg-blue-50/40 shadow-2xl scale-[1.02]',
        'hover:shadow-xl hover:border-gray-300 hover:scale-[1.01]'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold" style={{ color }}>
              {config.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 font-medium">{config.description}</p>
          </div>
          <div className="text-sm font-semibold text-white px-3 py-1 rounded-full shadow-md" style={{ backgroundColor: color }}>
            {entries.length}/25
          </div>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
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
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
            <p className="text-sm">Drop items here or add new ones</p>
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleAddEntry}
          disabled={isAtLimit}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-200',
            isAtLimit
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600'
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isAtLimit ? 'Limit reached (25)' : 'Add item'}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
