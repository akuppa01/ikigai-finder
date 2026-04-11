'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  reflection?: string;
}

const likertOptions = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

const multipleLabels: Record<string, string> = {
  lead: 'Lead — I take initiative and guide others',
  collaborate: 'Collaborate — I work best alongside a team',
  independent: 'Independent — I prefer working alone',
  student: 'Student — currently in education',
  professional: 'Professional — currently working',
  low: 'Low — minimal time or money available',
  medium: 'Medium — willing to invest moderately',
  high: 'High — committed to serious investment',
};

export default function QuestionCard({
  question,
  type,
  options,
  value,
  onChange,
  reflection,
}: QuestionCardProps) {
  return (
    <div className="w-full">
      {/* Question */}
      <h2 className="font-serif text-xl sm:text-2xl font-light text-ink-900 leading-snug mb-2 max-w-xl">
        {question}
      </h2>

      {/* Reflection prompt */}
      {reflection && (
        <p className="text-xs text-ink-400 italic mb-8 leading-relaxed max-w-lg">
          {reflection}
        </p>
      )}

      {/* Answer options */}
      <div className="max-w-md">
        {type === 'likert' && (
          <RadioGroup
            value={value?.toString() || ''}
            onValueChange={v => onChange(parseInt(v))}
            className="space-y-0"
          >
            {likertOptions.map(option => (
              <label
                key={option.value}
                htmlFor={`opt-${option.value}`}
                className={`flex items-center gap-4 py-3 px-4 cursor-pointer border-b border-ink-100 hover:bg-parchment-100 transition-colors duration-150 group ${
                  value?.toString() === option.value.toString()
                    ? 'bg-crimson-50 border-b-crimson-200'
                    : ''
                }`}
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`opt-${option.value}`}
                  className="border-ink-300 text-crimson-600 data-[state=checked]:border-crimson-600"
                />
                <span className={`text-sm font-sans flex-1 transition-colors duration-150 ${
                  value?.toString() === option.value.toString()
                    ? 'text-crimson-800 font-medium'
                    : 'text-ink-600 group-hover:text-ink-900'
                }`}>
                  {option.label}
                </span>
                <span className={`text-[10px] w-4 text-right tabular-nums ${
                  value?.toString() === option.value.toString()
                    ? 'text-crimson-500'
                    : 'text-ink-300'
                }`}>
                  {option.value}
                </span>
              </label>
            ))}
          </RadioGroup>
        )}

        {type === 'multiple' && (
          <RadioGroup
            value={value?.toString() || ''}
            onValueChange={v => onChange(v)}
            className="space-y-0"
          >
            {options?.map((option, i) => (
              <label
                key={i}
                htmlFor={`opt-${option}`}
                className={`flex items-center gap-4 py-3 px-4 cursor-pointer border-b border-ink-100 hover:bg-parchment-100 transition-colors duration-150 group ${
                  value === option ? 'bg-crimson-50 border-b-crimson-200' : ''
                }`}
              >
                <RadioGroupItem
                  value={option}
                  id={`opt-${option}`}
                  className="border-ink-300 text-crimson-600 data-[state=checked]:border-crimson-600"
                />
                <span className={`text-sm font-sans flex-1 transition-colors duration-150 ${
                  value === option
                    ? 'text-crimson-800 font-medium'
                    : 'text-ink-600 group-hover:text-ink-900'
                }`}>
                  {multipleLabels[option] || option}
                </span>
              </label>
            ))}
          </RadioGroup>
        )}

        {type === 'dropdown' && (
          <div>
            <Label className="text-[10px] tracking-[0.25em] uppercase text-ink-400 mb-2 block">
              Select your age range
            </Label>
            <select
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              className="w-full p-3 border border-ink-300 bg-white text-ink-700 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-crimson-500 focus:border-crimson-500 rounded-none"
            >
              <option value="">Choose...</option>
              {options?.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
