'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportCardProps {
  title: string;
  rank?: number;
  description: string;
  details?: {
    salary?: string;
    growth?: string;
    duration?: string;
    universities?: string[];
  };
  nextSteps?: string[];
  color?: 'sage' | 'moss' | 'earth' | 'gold';
  className?: string;
}

export default function ReportCard({
  title,
  rank,
  description,
  details,
  nextSteps,
  color = 'sage',
  className = '',
}: ReportCardProps) {
  const colorClasses = {
    sage: 'from-sage-50 to-sage-100 border-sage-200',
    moss: 'from-moss-50 to-moss-100 border-moss-200',
    earth: 'from-earth-50 to-earth-100 border-earth-200',
    gold: 'from-gold-50 to-gold-100 border-gold-200',
  };

  const textColorClasses = {
    sage: 'text-sage-800',
    moss: 'text-moss-800',
    earth: 'text-earth-800',
    gold: 'text-gold-800',
  };

  const accentColorClasses = {
    sage: 'bg-sage-500 text-white',
    moss: 'bg-moss-500 text-white',
    earth: 'bg-earth-500 text-white',
    gold: 'bg-gold-500 text-white',
  };

  return (
    <Card
      className={`p-6 bg-gradient-to-br ${colorClasses[color]} border ${className}`}
    >
      {/* Header with title and rank */}
      <div className="flex items-start justify-between mb-4">
        <h3
          className={`text-xl font-bold ${textColorClasses[color]} font-serif flex-1`}
        >
          {title}
        </h3>
        {rank && (
          <Badge
            className={`${accentColorClasses[color]} text-sm font-semibold`}
          >
            #{rank}
          </Badge>
        )}
      </div>

      {/* Personalized description */}
      <p className="text-earth-700 leading-relaxed mb-6 font-sans">
        {description}
      </p>

      {/* Details section */}
      {details && (
        <div className="mb-6 p-4 bg-white/60 rounded-lg border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {details.salary && (
              <div>
                <span className="font-medium text-earth-600">Salary:</span>
                <span className="ml-2 text-earth-700">{details.salary}</span>
              </div>
            )}
            {details.growth && (
              <div>
                <span className="font-medium text-earth-600">Growth:</span>
                <span className="ml-2 text-earth-700">{details.growth}</span>
              </div>
            )}
            {details.duration && (
              <div>
                <span className="font-medium text-earth-600">Duration:</span>
                <span className="ml-2 text-earth-700">{details.duration}</span>
              </div>
            )}
            {details.universities && details.universities.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium text-earth-600">Top Schools:</span>
                <span className="ml-2 text-earth-700">
                  {details.universities.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div>
          <h4 className="font-semibold text-earth-700 mb-3 font-sans">
            Next Steps:
          </h4>
          <ul className="space-y-2">
            {nextSteps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-earth-600"
              >
                <span
                  className={`w-5 h-5 rounded-full ${accentColorClasses[color]} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}
                >
                  {index + 1}
                </span>
                <span className="font-sans">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
