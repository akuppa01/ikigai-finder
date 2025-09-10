'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface ActionPlanProps {
  steps: string[];
  className?: string;
}

export default function ActionPlan({ steps, className = '' }: ActionPlanProps) {
  return (
    <Card
      className={`p-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl ${className}`}
    >
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-sage-50 to-moss-50 hover:from-sage-100 hover:to-moss-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-sage-500 to-moss-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">{index + 1}</span>
            </div>
            <p className="text-earth-700 leading-relaxed text-base font-medium font-sans">
              {step}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
