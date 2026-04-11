'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import Board from '@/components/board/Board';
import { useBoardStore } from '@/hooks/useBoardStore';
import NinjaStar from '@/components/NinjaStar';

export default function BoardPage() {
  const { columns, resetBoard } = useBoardStore();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmBoard = async () => {
    setIsConfirming(true);

    const allEntries = Object.values(columns)
      .flat()
      .filter(entry => entry.text.trim());

    if (allEntries.length === 0) {
      alert('Please add some items to your board before continuing.');
      setIsConfirming(false);
      return;
    }

    try {
      const response = await fetch('/api/normalize-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: allEntries }),
      });

      if (!response.ok) throw new Error('Failed to normalize board');
      await response.json();
      window.location.href = '/quiz';
    } catch (error) {
      console.error('Error confirming board:', error);
      alert('Failed to process board. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResetBoard = () => {
    if (confirm('Reset the board? This will clear all your entries.')) {
      resetBoard();
    }
  };

  const totalEntries = Object.values(columns)
    .flat()
    .filter(entry => entry.text.trim()).length;

  const progress = Math.min((totalEntries / 20) * 100, 100);

  if (isConfirming) {
    return <LoadingScreen message="Processing your board..." />;
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* Header */}
      <header className="border-b border-ink-200/40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-ink-500 hover:text-ink-900 hover:bg-ink-100 text-xs tracking-widest uppercase font-sans rounded-none"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </Button>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <NinjaStar size={20} animated={false} />
              <span className="font-serif text-sm font-light tracking-[0.2em] text-ink-600 uppercase">
                Ikigai Board
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={handleResetBoard}
              size="sm"
              className="gap-2 text-ink-400 hover:text-ink-700 text-xs tracking-widest uppercase rounded-none"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Reset</span>
            </Button>

            <Button
              onClick={handleConfirmBoard}
              disabled={isConfirming || totalEntries === 0}
              size="sm"
              className="gap-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs tracking-[0.2em] uppercase rounded-none disabled:opacity-40 px-5 sm:px-8 py-2 font-sans transition-colors duration-200"
            >
              Continue
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Page intro */}
      <div className="px-4 sm:px-8 pt-10 pb-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="tracking-[0.3em] text-crimson-600 text-[10px] uppercase font-sans mb-3">
            Step 01 of 03
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-light text-ink-900 mb-3">
            Build Your Ikigai Board
          </h1>
          <div className="w-8 h-px bg-crimson-600 mb-4" />
          <p className="text-ink-500 text-sm leading-relaxed">
            Fill each column with your honest answers. You can drag entries across columns —
            an item can belong to multiple areas of your life.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mt-6 flex items-center gap-4 max-w-sm">
          <div className="flex-1 h-px bg-ink-200 relative">
            <motion.div
              className="absolute left-0 top-0 h-full bg-crimson-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-ink-400 tabular-nums whitespace-nowrap">
            {totalEntries} items
          </span>
        </div>

        {/* Column legend */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: 'LOVE', color: '#B91C1C', note: 'What you love' },
            { label: 'GOOD AT', color: '#1E4D72', note: "What you're good at" },
            { label: 'EARN', color: '#B8860B', note: 'What pays you' },
            { label: 'NEEDS', color: '#2D6A4F', note: 'What the world needs' },
          ].map(col => (
            <div key={col.label} className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: col.color }}
              />
              <span className="text-[10px] tracking-widest uppercase text-ink-500">
                {col.label}
              </span>
              <span className="text-[10px] text-ink-400 hidden sm:inline">
                · {col.note}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="px-4 sm:px-8 pb-12 max-w-7xl mx-auto">
        <div className="h-auto min-h-[420px] sm:h-[600px]">
          <Board />
        </div>
      </div>

      {/* Bottom CTA on mobile */}
      <div className="sm:hidden px-4 pb-8">
        <Button
          onClick={handleConfirmBoard}
          disabled={isConfirming || totalEntries === 0}
          className="w-full gap-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs tracking-[0.2em] uppercase rounded-none disabled:opacity-40 py-4 font-sans"
        >
          Continue to Questions
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
