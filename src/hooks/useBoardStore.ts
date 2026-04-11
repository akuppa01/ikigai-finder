'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { BoardState, Entry, ColumnKey } from '@/lib/types';

interface BoardStore extends BoardState {
  // Actions
  addEntry: (column: ColumnKey, text?: string) => void;
  updateEntry: (id: string, text: string) => void;
  deleteEntry: (id: string) => void;
  moveEntry: (
    id: string,
    targetColumn: ColumnKey,
    targetPosition: number
  ) => void;
  copyEntry: (
    id: string,
    targetColumn: ColumnKey,
    targetPosition: number
  ) => void;
  setSelectedEntry: (id: string | null) => void;
  setEditingEntry: (id: string | null) => void;
  setBoardId: (id: string | null) => void;
  resetBoard: () => void;
  loadBoard: (entries: Entry[]) => void;
}

const createBlankEntry = (column: ColumnKey, position: number): Entry => ({
  id: uuidv4(),
  text: '',
  position,
  column,
});

const initialColumns: Record<ColumnKey, Entry[]> = {
  love: Array.from({ length: 5 }, (_, i) => createBlankEntry('love', i)),
  good_at: Array.from({ length: 5 }, (_, i) => createBlankEntry('good_at', i)),
  paid_for: Array.from({ length: 5 }, (_, i) =>
    createBlankEntry('paid_for', i)
  ),
  world_needs: Array.from({ length: 5 }, (_, i) =>
    createBlankEntry('world_needs', i)
  ),
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      columns: initialColumns,
      selectedEntryId: null,
      editingEntryId: null,
      boardId: null,

      addEntry: (column: ColumnKey, text = '') => {
        const state = get();
        const newPosition = state.columns[column].length;

        if (newPosition >= 25) return; // Cap at 25 entries per column

        const newEntry = createBlankEntry(column, newPosition);
        newEntry.text = text;

        set(state => ({
          columns: {
            ...state.columns,
            [column]: [...state.columns[column], newEntry],
          },
        }));
      },

      updateEntry: (id: string, text: string) => {
        set(state => {
          const newColumns = { ...state.columns };

          for (const columnKey in newColumns) {
            const column = newColumns[columnKey as ColumnKey];
            const entryIndex = column.findIndex(entry => entry.id === id);

            if (entryIndex !== -1) {
              newColumns[columnKey as ColumnKey] = column.map(entry =>
                entry.id === id ? { ...entry, text } : entry
              );
              break;
            }
          }

          return { columns: newColumns };
        });
      },

      deleteEntry: (id: string) => {
        set(state => {
          const newColumns = { ...state.columns };

          for (const columnKey in newColumns) {
            const column = newColumns[columnKey as ColumnKey];
            const entryIndex = column.findIndex(entry => entry.id === id);

            if (entryIndex !== -1) {
              newColumns[columnKey as ColumnKey] = column
                .filter(entry => entry.id !== id)
                .map((entry, index) => ({ ...entry, position: index }));
              break;
            }
          }

          return {
            columns: newColumns,
            selectedEntryId:
              state.selectedEntryId === id ? null : state.selectedEntryId,
            editingEntryId:
              state.editingEntryId === id ? null : state.editingEntryId,
          };
        });
      },

      moveEntry: (
        id: string,
        targetColumn: ColumnKey,
        targetPosition: number
      ) => {
        set(state => {
          const newColumns = { ...state.columns };
          let sourceColumn: ColumnKey | null = null;
          let entry: Entry | null = null;

          // Find and remove from source
          for (const columnKey in newColumns) {
            const column = newColumns[columnKey as ColumnKey];
            const entryIndex = column.findIndex(e => e.id === id);

            if (entryIndex !== -1) {
              sourceColumn = columnKey as ColumnKey;
              entry = column[entryIndex];
              newColumns[columnKey as ColumnKey] = column
                .filter(e => e.id !== id)
                .map((e, index) => ({ ...e, position: index }));
              break;
            }
          }

          if (!entry || !sourceColumn) return state;

          // Insert at target
          const targetEntries = [...newColumns[targetColumn]];
          targetEntries.splice(targetPosition, 0, {
            ...entry,
            column: targetColumn,
            position: targetPosition,
          });

          // Update positions
          newColumns[targetColumn] = targetEntries.map((e, index) => ({
            ...e,
            position: index,
          }));

          return { columns: newColumns };
        });
      },

      copyEntry: (
        id: string,
        targetColumn: ColumnKey,
        targetPosition: number
      ) => {
        set(state => {
          let sourceEntry: Entry | null = null;

          // Find source entry
          for (const columnKey in state.columns) {
            const column = state.columns[columnKey as ColumnKey];
            const entry = column.find(e => e.id === id);
            if (entry) {
              sourceEntry = entry;
              break;
            }
          }

          if (!sourceEntry) return state;

          const newEntry: Entry = {
            id: uuidv4(),
            text: sourceEntry.text,
            column: targetColumn,
            position: targetPosition,
          };

          const newColumns = { ...state.columns };
          const targetEntries = [...newColumns[targetColumn]];
          targetEntries.splice(targetPosition, 0, newEntry);

          // Update positions
          newColumns[targetColumn] = targetEntries.map((e, index) => ({
            ...e,
            position: index,
          }));

          return { columns: newColumns };
        });
      },

      setSelectedEntry: (id: string | null) => {
        set({ selectedEntryId: id });
      },

      setEditingEntry: (id: string | null) => {
        set({ editingEntryId: id });
      },

      setBoardId: (id: string | null) => {
        set({ boardId: id });
      },

      resetBoard: () => {
        set({
          columns: initialColumns,
          selectedEntryId: null,
          editingEntryId: null,
          boardId: null,
        });
      },

      loadBoard: (entries: Entry[]) => {
        const newColumns: Record<ColumnKey, Entry[]> = {
          love: [],
          good_at: [],
          paid_for: [],
          world_needs: [],
        };

        entries.forEach(entry => {
          newColumns[entry.column].push(entry);
        });

        // Sort by position
        Object.keys(newColumns).forEach(key => {
          newColumns[key as ColumnKey].sort((a, b) => a.position - b.position);
        });

        set({ columns: newColumns });
      },
    }),
    {
      name: 'ikigai-board-storage',
      partialize: state => ({
        columns: state.columns,
        boardId: state.boardId,
      }),
    }
  )
);
