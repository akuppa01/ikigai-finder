'use client';

import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: string;
  type: 'likert' | 'multiple' | 'dropdown';
  options?: string[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  isActive: boolean;
  isBlurred: boolean;
  questionNumber: number;
  totalQuestions: number;
}

const likertOptions = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function QuestionCard({
  question,
  type,
  options,
  value,
  onChange,
  isActive,
  isBlurred,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const handleLikertChange = (value: string) => {
    onChange(parseInt(value));
  };

  const handleMultipleChange = (value: string) => {
    onChange(value);
  };

  return (
    <Card className="p-8 transition-all duration-300 ring-2 ring-blue-500 shadow-lg">
      <div className="space-y-6">
        {/* Question Header */}
        <div className="text-center">
          <div className="text-sm text-gray-500 mb-2">
            Question {questionNumber} of {totalQuestions}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="max-w-md mx-auto">
          {type === 'likert' && (
            <RadioGroup
              value={value?.toString() || ''}
              onValueChange={handleLikertChange}
              className="space-y-3"
            >
              {likertOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`q${questionNumber}-${option.value}`}
                  />
                  <Label
                    htmlFor={`q${questionNumber}-${option.value}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {type === 'multiple' && (
            <RadioGroup
              value={value?.toString() || ''}
              onValueChange={handleMultipleChange}
              className="space-y-3"
            >
              {options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option}
                    id={`q${questionNumber}-${index}`}
                  />
                  <Label
                    htmlFor={`q${questionNumber}-${index}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {type === 'dropdown' && (
            <select
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select age range</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </Card>
  );
}
