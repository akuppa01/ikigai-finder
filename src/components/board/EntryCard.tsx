'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
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
      data: { type: 'entry', entry },
      disabled: isEditing,
    });

    const dragStyle: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      ...(isDragging && { willChange: 'transform' }),
      borderLeftColor: columnColor,
      borderLeftWidth: '2px',
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
        setTimeout(() => onNavigateNext?.(), 100);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancelEdit();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) onNavigatePrevious?.();
        else onNavigateNext?.();
      }
    };

    const handleClick = (e: React.MouseEvent) => {
      if (
        (e.target as HTMLElement).closest('[data-drag-handle]') ||
        (e.target as HTMLElement).closest('[data-delete-button]')
      ) return;
      if (!isEditing) onEdit();
    };

    return (
      <div
        ref={setNodeRef}
        style={dragStyle}
        className={cn(
          'group relative bg-white border border-ink-200 transition-[border-color,opacity,box-shadow] duration-150',
          isSelected && 'ring-1 ring-offset-1',
          isDragging && 'opacity-60 shadow-lg',
          !isEditing && 'hover:border-ink-400 cursor-pointer'
        )}
        onClick={handleClick}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing z-10 p-0.5"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3 text-ink-300" />
        </div>

        {/* Delete button */}
        <button
          data-delete-button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          className="absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-0.5 hover:bg-crimson-50 z-10"
          title="Delete"
        >
          <X className="h-3 w-3 text-ink-300 hover:text-crimson-500" />
        </button>

        {/* Content */}
        <div className="px-7 py-2.5 min-h-[42px] flex items-center">
          {isEditing ? (
            <textarea
              ref={inputRef}
              value={localText}
              onChange={e => setLocalText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => onUpdate(localText)}
              className="w-full resize-none border-none outline-none text-xs bg-transparent text-ink-800 font-sans leading-relaxed"
              placeholder="Type here..."
              rows={2}
            />
          ) : (
            <p className="w-full text-xs text-ink-700 font-sans leading-relaxed whitespace-pre-wrap">
              {entry.text || (
                <span className="text-ink-300 italic">Click to edit...</span>
              )}
            </p>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.entry.id === nextProps.entry.id &&
    prevProps.entry.text === nextProps.entry.text &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.columnColor === nextProps.columnColor
);

export default EntryCard;
