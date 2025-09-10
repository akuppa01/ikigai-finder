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
  const centerX = size / 2;
  const centerY = size / 2;
  const bladeLength = size * 0.4;
  const bladeWidth = size * 0.15;

  const colors = {
    love: '#4F46E5', // Indigo Blue
    good_at: '#10B981', // Green Teal
    paid_for: '#F59E0B', // Amber Gold
    world_needs: '#FB7185', // Coral Pink
  };

  const blades = [
    { color: colors.love, rotation: 0 },
    { color: colors.good_at, rotation: 90 },
    { color: colors.paid_for, rotation: 180 },
    { color: colors.world_needs, rotation: 270 },
  ];

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={animated ? { scale: 0, rotate: 0 } : {}}
      animate={animated ? { scale: 1, rotate: 360 } : {}}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </radialGradient>
      </defs>

      {blades.map((blade, index) => (
        <motion.g
          key={index}
          transform={`rotate(${blade.rotation} ${centerX} ${centerY})`}
          initial={animated ? { scale: 0 } : {}}
          animate={animated ? { scale: 1 } : {}}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <path
            d={`M ${centerX} ${centerY - bladeLength / 2} 
                L ${centerX + bladeWidth / 2} ${centerY - bladeLength / 4}
                L ${centerX + bladeWidth / 2} ${centerY + bladeLength / 4}
                L ${centerX} ${centerY + bladeLength / 2}
                L ${centerX - bladeWidth / 2} ${centerY + bladeLength / 4}
                L ${centerX - bladeWidth / 2} ${centerY - bladeLength / 4}
                Z`}
            fill={blade.color}
            filter="url(#glow)"
            opacity={0.9}
          />
        </motion.g>
      ))}

      {/* Center circle */}
      <motion.circle
        cx={centerX}
        cy={centerY}
        r={size * 0.08}
        fill="url(#centerGradient)"
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
    </motion.svg>
  );
}
