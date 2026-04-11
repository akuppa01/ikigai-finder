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

const columnConfig: Record<ColumnKey, { title: string; description: string; color: string; kanji: string; japanese: string }> = {
  love: {
    title: 'LOVE',
    description: 'What you love',
    color: '#B91C1C',
    kanji: '愛',
    japanese: 'Ai',
  },
  good_at: {
    title: 'GOOD AT',
    description: "What you're good at",
    color: '#1E4D72',
    kanji: '才',
    japanese: 'Sai',
  },
  paid_for: {
    title: 'EARN',
    description: 'What you can be paid for',
    color: '#B8860B',
    kanji: '富',
    japanese: 'Tomi',
  },
  world_needs: {
    title: 'NEEDS',
    description: 'What the world needs',
    color: '#2D6A4F',
    kanji: '世',
    japanese: 'Yo',
  },
};

const Column = memo(function Column({
  columnKey,
  entries,
  onNavigateNext,
  onNavigatePrevious,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
    data: { type: 'column', columnKey },
  });

  const selectedEntryId = useBoardStore(state => state.selectedEntryId);
  const editingEntryId = useBoardStore(state => state.editingEntryId);
  const addEntry = useBoardStore(state => state.addEntry);
  const updateEntry = useBoardStore(state => state.updateEntry);
  const deleteEntry = useBoardStore(state => state.deleteEntry);
  const setSelectedEntry = useBoardStore(state => state.setSelectedEntry);
  const setEditingEntry = useBoardStore(state => state.setEditingEntry);

  const config = columnConfig[columnKey];
  const isAtLimit = entries.length >= 25;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-auto min-h-[300px] sm:min-h-[420px] lg:h-full lg:min-h-[500px] bg-white border border-ink-200 transition-[border-color,background-color] duration-200',
        isOver && 'border-crimson-400 bg-crimson-50/30'
      )}
      style={{
        borderTopColor: config.color,
        borderTopWidth: '3px',
      }}
    >
      {/* Column header */}
      <div className="px-4 py-4 border-b border-ink-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span
                className="font-serif text-base opacity-70"
                style={{ color: config.color }}
              >
                {config.kanji}
              </span>
              <span
                className="text-[9px] tracking-[0.25em] uppercase font-sans font-medium"
                style={{ color: config.color }}
              >
                {config.title}
              </span>
            </div>
            <p className="text-[11px] text-ink-400 font-sans">{config.description}</p>
          </div>
          <span className="text-[10px] text-ink-300 font-sans tabular-nums ml-2 mt-0.5">
            {entries.length}/25
          </span>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {entries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isSelected={selectedEntryId === entry.id}
            isEditing={editingEntryId === entry.id}
            onSelect={() => setSelectedEntry(entry.id)}
            onEdit={() => setEditingEntry(entry.id)}
            onDelete={() => deleteEntry(entry.id)}
            onUpdate={text => { updateEntry(entry.id, text); setEditingEntry(null); }}
            onCancelEdit={() => setEditingEntry(null)}
            columnColor={config.color}
            onNavigateNext={onNavigateNext}
            onNavigatePrevious={onNavigatePrevious}
          />
        ))}

        {entries.length === 0 && (
          <div
            className="flex items-center justify-center h-20 border border-dashed rounded-none text-ink-300"
            style={{ borderColor: `${config.color}40` }}
          >
            <p className="text-[11px] tracking-wide text-center px-3">
              Add an item below
            </p>
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="p-3 border-t border-ink-100">
        <button
          onClick={() => { if (!isAtLimit) addEntry(columnKey); }}
          disabled={isAtLimit}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 px-3 text-[11px] tracking-widest uppercase font-sans transition-colors duration-150',
            isAtLimit
              ? 'text-ink-200 cursor-not-allowed'
              : 'text-ink-400 hover:text-ink-700 border border-dashed border-ink-200 hover:border-ink-400'
          )}
        >
          <Plus className="h-3 w-3" />
          {isAtLimit ? 'Limit reached' : 'Add item'}
        </button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.columnKey !== nextProps.columnKey) return false;
  if (prevProps.color !== nextProps.color) return false;
  if (prevProps.entries.length !== nextProps.entries.length) return false;
  for (let i = 0; i < prevProps.entries.length; i++) {
    if (
      prevProps.entries[i].id !== nextProps.entries[i].id ||
      prevProps.entries[i].text !== nextProps.entries[i].text
    ) return false;
  }
  return true;
});

export default Column;
