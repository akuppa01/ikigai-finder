'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import { Major } from '@/lib/openai';

interface MajorCardProps {
  major: Major;
  index: number;
}

export default function MajorCard({ major, index }: MajorCardProps) {
  const gradientColors = [
    'from-emerald-500 to-teal-500',
    'from-green-500 to-emerald-500',
    'from-cyan-500 to-teal-500',
    'from-lime-500 to-green-500',
    'from-teal-500 to-cyan-500',
    'from-green-600 to-emerald-600',
  ];

  const bgGradients = [
    'from-emerald-50 to-teal-50',
    'from-green-50 to-emerald-50',
    'from-cyan-50 to-teal-50',
    'from-lime-50 to-green-50',
    'from-teal-50 to-cyan-50',
    'from-green-50 to-emerald-50',
  ];

  const colorIndex = index % gradientColors.length;
  const gradientColor = gradientColors[colorIndex];
  const bgGradient = bgGradients[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card
        className={`p-5 bg-gradient-to-br ${bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden`}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        ></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 bg-gradient-to-r ${gradientColor} rounded-lg shadow-lg`}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 leading-tight">
                {major.title}
              </h4>
            </div>
            <Badge
              className={`bg-gradient-to-r ${gradientColor} text-white text-sm font-bold px-3 py-1 shadow-lg`}
            >
              #{index + 1}
            </Badge>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {major.why || major.description}
          </p>

          {/* Additional info if available */}
          {(major.universities || major.duration || major.prerequisites) && (
            <div className="space-y-2">
              {major.universities && (
                <div
                  className={`text-xs text-gray-600 bg-gradient-to-r ${gradientColor} bg-opacity-10 px-3 py-1 rounded-full`}
                >
                  <span className="font-semibold">Universities:</span>{' '}
                  {major.universities.join(', ')}
                </div>
              )}
              {major.duration && (
                <div
                  className={`text-xs text-gray-600 bg-gradient-to-r ${gradientColor} bg-opacity-10 px-3 py-1 rounded-full`}
                >
                  <span className="font-semibold">Duration:</span>{' '}
                  {major.duration}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
