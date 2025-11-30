'use client';

import { useState, useRef, useEffect, memo } from 'react';
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

const EntryCard = memo(
  function EntryCard({
    entry,
    isSelected,
    isEditing,
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
      disabled: isEditing,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Optimize for drag operations - use GPU acceleration
    ...(isDragging && { willChange: 'transform' }),
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

    const handleTouchStart = (e: React.TouchEvent) => {
      if (isEditing) {
        e.stopPropagation();
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group relative bg-white rounded-xl shadow-md border-2 border-gray-200/60 transition-[box-shadow,border-color,opacity] duration-200',
          isSelected && 'ring-2 ring-blue-500 ring-offset-2 shadow-lg',
          isDragging && 'opacity-70 shadow-2xl',
          'hover:shadow-lg hover:border-gray-300'
        )}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
      >
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          className="absolute left-2 sm:left-3 top-2 sm:top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-10 p-1 hover:bg-gray-100 rounded-md border border-transparent hover:border-gray-200"
          onClick={e => e.stopPropagation()}
          title="Drag to move between columns"
        >
          <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
        </div>

        <button
          data-delete-button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 sm:right-3 top-2 sm:top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded-full z-10 border border-transparent hover:border-red-200"
          title="Delete item"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
        </button>

        <div className="p-2 sm:p-3 pr-8 sm:pr-10 pl-8 sm:pl-10 min-h-[50px] sm:min-h-[60px] flex items-center">
          {isEditing ? (
            <textarea
              ref={inputRef}
              value={localText}
              onChange={e => setLocalText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full resize-none border-none outline-none text-xs sm:text-sm bg-transparent font-medium"
              placeholder="Enter your text..."
              rows={2}
            />
          ) : (
            <div className="w-full text-xs sm:text-sm text-gray-700 whitespace-pre-wrap font-medium">
              {entry.text || (
                <span className="text-gray-400 italic">Click to edit...</span>
              )}
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
          style={{ backgroundColor: columnColor }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.entry.id === nextProps.entry.id &&
      prevProps.entry.text === nextProps.entry.text &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isEditing === nextProps.isEditing &&
      prevProps.columnColor === nextProps.columnColor
    );
  }
);

export default EntryCard;
