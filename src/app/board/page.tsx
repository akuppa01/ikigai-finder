'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/ui/page-transition';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Board from '@/components/board/Board';
import { useBoardStore } from '@/hooks/useBoardStore';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export default function BoardPage() {
  const { columns, resetBoard } = useBoardStore();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmBoard = async () => {
    setIsConfirming(true);

    // Get all entries with text
    const allEntries = Object.values(columns)
      .flat()
      .filter(entry => entry.text.trim());

    if (allEntries.length === 0) {
      alert('Please add some items to your board before confirming.');
      setIsConfirming(false);
      return;
    }

    try {
      // Call normalize board API
      const response = await fetch('/api/normalize-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: allEntries,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to normalize board');
      }

      await response.json();

      // Redirect to quiz
      window.location.href = '/quiz';
    } catch (error) {
      console.error('Error confirming board:', error);
      alert('Failed to process board. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResetBoard = () => {
    if (
      confirm(
        'Are you sure you want to reset the board? This will clear all your entries.'
      )
    ) {
      resetBoard();
    }
  };

  const totalEntries = Object.values(columns)
    .flat()
    .filter(entry => entry.text.trim()).length;

  if (isConfirming) {
    return <LoadingScreen message="Processing your board..." />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        <BackgroundBlobs />

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleResetBoard}
                className="gap-2 text-sm sm:text-base flex-1 sm:flex-none"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>

              <Button
                onClick={handleConfirmBoard}
                disabled={isConfirming || totalEntries === 0}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base flex-1 sm:flex-none"
              >
                <CheckCircle className="h-4 w-4" />
                {isConfirming ? 'Processing...' : 'Confirm Board'}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Build Your Ikigai
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Fill in each column with what matters to you. Drag items between
                columns to copy them.
              </p>
              <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>What you love</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>What you&apos;re good at</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>What you can be paid for</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span>What the world needs</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{totalEntries} items added</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((totalEntries / 20) * 100, 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-[500px] sm:h-[600px] min-h-[400px] sm:min-h-[500px]">
            <Board />
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}
