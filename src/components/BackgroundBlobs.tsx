'use client';

import { useEffect, useState } from 'react';

/**
 * Optimized BackgroundBlobs - Static version to prevent GPU overload
 * Removed infinite animations and heavy blur effects that were causing
 * Chrome rendering issues and GPU overheating
 */
export default function BackgroundBlobs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use static gradients instead of animated blurs to prevent GPU overload
  // This provides visual interest without continuous repainting
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Static gradient overlays - no animations, no blur filters */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300/10 rounded-full" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300/10 rounded-full" />
      <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-300/8 rounded-full" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-red-300/10 rounded-full" />
    </div>
  );
}
