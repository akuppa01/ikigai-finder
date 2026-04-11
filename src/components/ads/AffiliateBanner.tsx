'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, Users, Clock } from 'lucide-react';

interface AffiliateBannerProps {
  title: string;
  description: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
  students: number;
  duration: string;
  affiliateUrl: string;
  category: 'course' | 'book' | 'tool' | 'coaching';
  className?: string;
}

export default function AffiliateBanner({
  title,
  description,
  image,
  price,
  originalPrice,
  rating,
  students,
  duration,
  affiliateUrl,
  category,
  className = ''
}: AffiliateBannerProps) {
  const getCategoryIcon = () => {
    switch (category) {
      case 'course':
        return '🎓';
      case 'book':
        return '📚';
      case 'tool':
        return '🛠️';
      case 'coaching':
        return '👨‍💼';
      default:
        return '💡';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'course':
        return 'from-blue-500 to-purple-500';
      case 'book':
        return 'from-green-500 to-teal-500';
      case 'tool':
        return 'from-orange-500 to-red-500';
      case 'coaching':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className={`p-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <div className={`w-24 h-24 rounded-lg bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center text-3xl`}>
            {getCategoryIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-700">{rating}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{students.toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">{price}</span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
              )}
            </div>
            <Button
              asChild
              className={`bg-gradient-to-r ${getCategoryColor()} hover:opacity-90 text-white font-semibold`}
            >
              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                View Details
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
