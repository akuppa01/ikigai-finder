'use client';

import { motion } from 'framer-motion';

interface NinjaStarProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function NinjaStar({
  size = 200,
  className = '',
  animated = true,
}: NinjaStarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const bl = size * 0.38; // blade length
  const bw = size * 0.13; // blade width

  // Japanese Ikigai palette
  const blades = [
    { color: '#B91C1C', rotation: 0 },    // Crimson — Love
    { color: '#1E4D72', rotation: 90 },   // Navy — Skill
    { color: '#B8860B', rotation: 180 },  // Bronze — Vocation
    { color: '#2D6A4F', rotation: 270 },  // Forest — Mission
  ];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={animated ? { opacity: 0, scale: 0.6 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {blades.map((blade, i) => (
        <motion.g
          key={i}
          transform={`rotate(${blade.rotation} ${cx} ${cy})`}
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ delay: i * 0.12, duration: 0.4 }}
        >
          <path
            d={`M ${cx} ${cy - bl / 2}
                L ${cx + bw / 2} ${cy - bl / 4}
                L ${cx + bw / 2} ${cy + bl / 4}
                L ${cx} ${cy + bl / 2}
                L ${cx - bw / 2} ${cy + bl / 4}
                L ${cx - bw / 2} ${cy - bl / 4}
                Z`}
            fill={blade.color}
            opacity={0.88}
          />
        </motion.g>
      ))}

      {/* Center circle */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={size * 0.07}
        fill="#F5F0E8"
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
    </motion.svg>
  );
}
