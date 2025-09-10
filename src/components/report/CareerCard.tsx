'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target } from 'lucide-react';
import { CareerPath } from '@/lib/openai';

interface CareerCardProps {
  career: CareerPath;
  index: number;
}

export default function CareerCard({ career, index }: CareerCardProps) {
  const gradientColors = [
    'from-blue-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-cyan-500 to-blue-500',
  ];

  const bgGradients = [
    'from-blue-50 to-purple-50',
    'from-emerald-50 to-teal-50',
    'from-orange-50 to-red-50',
    'from-pink-50 to-rose-50',
    'from-indigo-50 to-blue-50',
    'from-cyan-50 to-blue-50',
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
        className={`p-6 bg-gradient-to-br ${bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden`}
      >
        {/* Animated background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        ></div>

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex-1 leading-tight">
              {career.title}
            </h3>
            <Badge
              className={`ml-3 bg-gradient-to-r ${gradientColor} text-white text-sm font-bold px-3 py-1 shadow-lg`}
            >
              #{index + 1}
            </Badge>
          </div>

          {/* Why it fits */}
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            {career.why || career.description}
          </p>

          {/* Timeline */}
          {career.timeline && (
            <div
              className={`flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r ${gradientColor} bg-opacity-10 px-4 py-2 rounded-full`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Timeline:</span>
              <span>{career.timeline}</span>
            </div>
          )}

          {/* Salary and Growth */}
          {(career.salary || career.growth) && (
            <div
              className={`flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r ${gradientColor} bg-opacity-10 px-4 py-2 rounded-full`}
            >
              <span className="font-semibold">Details:</span>
              {career.salary && <span>💰 {career.salary}</span>}
              {career.growth && <span>📈 {career.growth}</span>}
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <Target className="h-4 w-4" />
              <span>Next Steps:</span>
            </div>
            <ul className="space-y-2 ml-2">
              {career.steps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="text-sm text-gray-700 flex items-start gap-3 font-medium"
                >
                  <div
                    className={`w-2 h-2 bg-gradient-to-r ${gradientColor} rounded-full mt-2 flex-shrink-0`}
                  ></div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
