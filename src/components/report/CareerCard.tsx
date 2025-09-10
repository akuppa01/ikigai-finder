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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {career.title}
            </h3>
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 text-xs">
              #{index + 1}
            </Badge>
          </div>

          {/* Why it fits */}
          <p className="text-sm text-gray-600 leading-relaxed">{career.why}</p>

          {/* Timeline */}
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span className="font-medium">Timeline:</span>
            <span>{career.timeline}</span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Target className="h-3 w-3" />
              <span>Next Steps:</span>
            </div>
            <ul className="space-y-1 ml-4">
              {career.steps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-blue-500 font-bold text-sm">•</span>
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
