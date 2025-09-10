'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from 'lucide-react';
import { Entry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  entry: Entry;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (text: string) => void;
  onCancelEdit: () => void;
  columnColor: string;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
}

export default function EntryCard({
  entry,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  columnColor,
  onNavigateNext,
  onNavigatePrevious,
}: EntryCardProps) {
  const [localText, setLocalText] = useState(entry.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: entry.id,
    data: {
      type: 'entry',
      entry,
    },
    disabled: isEditing, // Disable dragging when editing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setLocalText(entry.text);
  }, [entry.text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onUpdate(localText);
      // Navigate to next cell after saving
      setTimeout(() => {
        onNavigateNext?.();
      }, 100);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        onNavigatePrevious?.();
      } else {
        onNavigateNext?.();
      }
    }
  };

  const handleBlur = () => {
    onUpdate(localText);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't edit if clicking on drag handle or delete button
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).closest('[data-drag-handle]') ||
      (e.target as HTMLElement).closest('[data-delete-button]')
    ) {
      return;
    }

    if (!isEditing) {
      onEdit();
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative bg-white rounded-lg shadow-sm border border-gray-200/50 transition-all duration-300',
        isSelected && 'ring-1 ring-blue-400 ring-offset-1',
        isDragging && 'opacity-60 scale-105',
        'hover:shadow-md hover:border-gray-300'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={handleClick}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        data-drag-handle
        className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing z-10 p-1 hover:bg-gray-100 rounded-md border border-transparent hover:border-gray-200"
        onClick={e => e.stopPropagation()}
        title="Drag to move between columns"
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>

      {/* Delete button */}
      <button
        data-delete-button
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-red-100 rounded-full z-10 border border-transparent hover:border-red-200"
        title="Delete item"
      >
        <X className="h-4 w-4 text-red-500" />
      </button>

      {/* Content */}
      <div className="p-2 pr-8 pl-8 min-h-[50px] flex items-center">
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full resize-none border-none outline-none text-xs bg-transparent"
            placeholder="Enter your text..."
            rows={2}
          />
        ) : (
          <div className="w-full text-xs text-gray-600 whitespace-pre-wrap">
            {entry.text || (
              <span className="text-gray-400 italic">Click to edit...</span>
            )}
          </div>
        )}
      </div>

      {/* Column color indicator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
        style={{ backgroundColor: columnColor }}
      />
    </motion.div>
  );
}
