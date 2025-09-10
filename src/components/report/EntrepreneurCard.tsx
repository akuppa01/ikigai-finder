'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, DollarSign, Target } from 'lucide-react';
import { EntrepreneurialIdea } from '@/lib/openai';
import { cn } from '@/lib/utils';

interface EntrepreneurCardProps {
  idea: EntrepreneurialIdea;
  index: number;
}

const capitalColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function EntrepreneurCard({
  idea,
  index,
}: EntrepreneurCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-gray-900">
                {idea.title}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <Badge className={cn('text-xs', capitalColors[idea.capital || 'medium'])}>
                <DollarSign className="h-2 w-2 mr-1" />
                {(idea.capital || idea.investment || 'Medium').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                #{index + 1}
              </Badge>
            </div>
          </div>

          {/* Why it fits */}
          <p className="text-xs text-gray-600 leading-relaxed">{idea.why || idea.description || idea.market}</p>

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Target className="h-3 w-3" />
              <span>Getting Started:</span>
            </div>
            <ul className="space-y-1 ml-4">
              {idea.steps.map((step, stepIndex) => (
                <li
                  key={stepIndex}
                  className="text-xs text-gray-600 flex items-start gap-2"
                >
                  <span className="text-yellow-500 font-bold text-sm">•</span>
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
