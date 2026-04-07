'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QuestionCard from '@/components/quiz/QuestionCard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useQuizStore } from '@/hooks/useQuizStore';
import { useBoardStore } from '@/hooks/useBoardStore';
import NinjaStar from '@/components/NinjaStar';

const questions = [
  {
    id: 'q1',
    question: 'I prefer working with people rather than with data or tasks.',
    type: 'likert' as const,
    reflection: 'Consider how you feel after a day of collaboration vs. solo work.',
  },
  {
    id: 'q2',
    question: 'I enjoy solving technical or complex problems.',
    type: 'likert' as const,
    reflection: 'Think about moments when you felt most engaged and energized.',
  },
  {
    id: 'q3',
    question: 'I prefer structured routines over uncertain or open-ended projects.',
    type: 'likert' as const,
    reflection: 'Neither answer is better — both reveal something true about you.',
  },
  {
    id: 'q4',
    question: 'How do you prefer to contribute within a team?',
    type: 'multiple' as const,
    options: ['lead', 'collaborate', 'independent'],
    reflection: 'Your natural role is often where you do your best work.',
  },
  {
    id: 'q5',
    question: 'Which best describes your current life stage?',
    type: 'multiple' as const,
    options: ['student', 'professional'],
    reflection: 'This helps us tailor your recommendations appropriately.',
  },
  {
    id: 'q6',
    question: 'How willing are you to invest time or resources in further training?',
    type: 'multiple' as const,
    options: ['low', 'medium', 'high'],
    reflection: 'Honest answers lead to more realistic and useful guidance.',
  },
  {
    id: 'q7',
    question: 'What is your age range?',
    type: 'dropdown' as const,
    options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    reflection: 'Age shapes opportunity — we will meet you where you are.',
  },
  {
    id: 'q8',
    question: 'I am open to building something of my own — a business, project, or practice.',
    type: 'likert' as const,
    reflection: 'Entrepreneurship is one of many valid paths. Be honest.',
  },
];

export default function QuizPage() {
  const {
    currentQuestion,
    responses,
    isComplete,
    setResponse,
    nextQuestion,
    previousQuestion,
    completeQuiz,
  } = useQuizStore();

  const { columns } = useBoardStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQ.id as keyof typeof responses] !== undefined;
  const progressPct = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
      setShowEmailModal(true);
    } else {
      nextQuestion();
    }
  };

  const handleGenerateReport = async () => {
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    const requiredQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    const missing = requiredQuestions.filter(q => !responses[q as keyof typeof responses]);
    if (missing.length > 0) {
      alert(`Please answer all questions before generating your report.`);
      return;
    }

    setIsGenerating(true);
    try {
      const allEntries = Object.values(columns).flat().filter(e => e.text.trim());

      const boardResponse = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'My Ikigai Board', entries: allEntries }),
      });

      if (!boardResponse.ok) {
        const err = await boardResponse.json();
        throw new Error(err.error || 'Failed to save board');
      }

      const { boardId } = await boardResponse.json();

      const reportResponse = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId,
          entries: allEntries,
          quiz: responses,
          profile: { email: email.trim(), name: name.trim() || undefined },
        }),
      });

      if (!reportResponse.ok) {
        let errorData;
        try { errorData = await reportResponse.json(); } catch { errorData = { error: `HTTP ${reportResponse.status}` }; }
        throw new Error(errorData.error || `HTTP ${reportResponse.status}`);
      }

      const { reportId } = await reportResponse.json();
      window.location.href = `/report/${reportId}`;
    } catch (error) {
      console.error('Error generating report:', error);
      alert(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <LoadingScreen message="Crafting your personalized Ikigai report..." />;
  }

  if (isComplete && !showEmailModal) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
        <header className="border-b border-ink-200/40 px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-ink-500 hover:text-ink-900 text-xs tracking-widest uppercase rounded-none">
              <Home className="h-3 w-3" />
              Home
            </Button>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <NinjaStar size={56} className="mx-auto mb-6" animated={false} />
            <h1 className="font-serif text-2xl font-light text-ink-900 mb-3">
              Reflection Complete
            </h1>
            <div className="w-8 h-px bg-crimson-600 mx-auto mb-4" />
            <p className="text-ink-500 text-sm leading-relaxed mb-8">
              You are ready to receive your personalized Ikigai report.
            </p>
            <Button
              onClick={() => setShowEmailModal(true)}
              className="bg-crimson-600 hover:bg-crimson-700 text-white text-xs tracking-[0.2em] uppercase rounded-none px-10 py-4 font-sans"
            >
              Generate My Report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans flex flex-col">

      {/* Header */}
      <header className="border-b border-ink-200/40 px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/board">
            <Button variant="ghost" size="sm" className="gap-2 text-ink-500 hover:text-ink-900 text-xs tracking-widest uppercase rounded-none">
              <ArrowLeft className="h-3 w-3" />
              Board
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <NinjaStar size={20} animated={false} />
            <span className="text-xs tracking-widest uppercase text-ink-400 font-sans">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-px bg-ink-100">
        <motion.div
          className="h-full bg-crimson-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step dots */}
      <div className="px-4 sm:px-8 pt-8 pb-4 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors duration-300 ${
                i < currentQuestion
                  ? 'bg-crimson-600'
                  : i === currentQuestion
                  ? 'bg-crimson-400'
                  : 'bg-ink-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="px-4 sm:px-8 pb-2 max-w-3xl mx-auto w-full">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="tracking-[0.3em] text-crimson-600 text-[10px] uppercase font-sans">
            Step 02 of 03 · Question {currentQuestion + 1}
          </p>
        </motion.div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-4 sm:px-8 pb-4 max-w-3xl mx-auto w-full">
        <div className="min-h-[320px] sm:min-h-[360px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full"
            >
              <QuestionCard
                question={currentQ.question}
                type={currentQ.type}
                options={currentQ.options}
                value={responses[currentQ.id as keyof typeof responses]}
                onChange={value => setResponse(currentQ.id as keyof typeof responses, value)}
                isActive={true}
                isBlurred={false}
                questionNumber={currentQuestion + 1}
                totalQuestions={questions.length}
                reflection={(currentQ as { reflection?: string }).reflection}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 gap-3">
          <Button
            variant="ghost"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            size="sm"
            className="gap-2 text-ink-500 hover:text-ink-900 text-xs tracking-widest uppercase rounded-none disabled:opacity-30"
          >
            <ArrowLeft className="h-3 w-3" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            size="sm"
            className="gap-2 bg-crimson-600 hover:bg-crimson-700 text-white text-xs tracking-[0.2em] uppercase rounded-none disabled:opacity-40 px-8 py-4 font-sans transition-colors duration-200"
          >
            {isLastQuestion ? 'Complete' : 'Next'}
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Email modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md bg-parchment-50 border border-ink-200 rounded-none shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="font-serif text-xl font-light text-ink-900">
              Receive Your Report
            </DialogTitle>
            <DialogDescription className="text-ink-500 text-sm leading-relaxed">
              Enter your details to generate your personalized Ikigai career report.
              We use your email to deliver and store your results.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] tracking-[0.3em] uppercase text-ink-500">
                Name (optional)
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-none border-ink-300 bg-white focus:ring-crimson-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] tracking-[0.3em] uppercase text-ink-500">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="rounded-none border-ink-300 bg-white focus:ring-crimson-500"
              />
            </div>

            <p className="text-[10px] text-ink-400 leading-relaxed">
              By continuing, you consent to receiving your Ikigai report by email.
              We respect your privacy and will not share your data.
            </p>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                className="flex-1 rounded-none border-ink-300 text-ink-600 hover:bg-ink-50 text-xs tracking-wide uppercase"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || !email.trim()}
                className="flex-1 bg-crimson-600 hover:bg-crimson-700 text-white rounded-none text-xs tracking-[0.15em] uppercase disabled:opacity-40"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" text="" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>

            <Link href="/" className="block">
              <Button
                variant="ghost"
                className="w-full rounded-none text-ink-400 hover:text-ink-700 text-xs tracking-wide uppercase"
              >
                <Home className="w-3 h-3 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
