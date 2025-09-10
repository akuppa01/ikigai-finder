'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Users, BarChart3, Download, MessageCircle, Clock } from 'lucide-react';

interface PremiumFeaturesProps {
  className?: string;
}

export default function PremiumFeatures({ className = '' }: PremiumFeaturesProps) {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Detailed insights into your career progression and skill development",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Unlimited PDF Exports",
      description: "Download unlimited reports in high-quality PDF format",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "1-on-1 Career Coaching",
      description: "Personalized coaching sessions with certified career advisors",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Priority AI Processing",
      description: "Get your reports generated 5x faster with priority processing",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Access",
      description: "Join our exclusive community of Ikigai seekers and career changers",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Unlimited Boards",
      description: "Create unlimited Ikigai boards for different life phases",
      color: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Unlock Your Full Potential
        </h3>
        <p className="text-gray-600">
          Get premium features to accelerate your Ikigai journey
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3`}>
              {feature.icon}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <h3 className="text-xl font-bold text-gray-900">Ikigai Pro</h3>
            <Badge className="bg-yellow-100 text-yellow-800">Most Popular</Badge>
          </div>
          
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">$19</span>
            <span className="text-gray-600">/month</span>
          </div>

          <p className="text-gray-600 mb-6">
            Everything you need to discover and live your Ikigai
          </p>

          <div className="space-y-2 mb-6">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-500" />
                <span>{feature.title}</span>
              </div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3">
            Start Free Trial
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            7-day free trial • Cancel anytime
          </p>
        </div>
      </Card>
    </div>
  );
}
