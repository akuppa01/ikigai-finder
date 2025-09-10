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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 hover:shadow-md transition-all duration-300 hover:scale-105">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-900">
                {major.title}
              </h4>
            </div>
            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
              #{index + 1}
            </Badge>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">{major.why}</p>
        </div>
      </Card>
    </motion.div>
  );
}
