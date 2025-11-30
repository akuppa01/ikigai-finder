'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/ui/page-transition';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import BackgroundBlobs from '@/components/BackgroundBlobs';

const questions = [
  {
    id: 'q1',
    question: 'I prefer working with people rather than with data/tasks.',
    type: 'likert' as const,
  },
  {
    id: 'q2',
    question: 'I enjoy solving technical problems.',
    type: 'likert' as const,
  },
  {
    id: 'q3',
    question: 'I prefer structured routines to uncertain projects.',
    type: 'likert' as const,
  },
  {
    id: 'q4',
    question: 'Do you prefer leading people or working independently?',
    type: 'multiple' as const,
    options: ['lead', 'collaborate', 'independent'],
  },
  {
    id: 'q5',
    question: 'Are you currently a student or a working professional?',
    type: 'multiple' as const,
    options: ['student', 'professional'],
  },
  {
    id: 'q6',
    question: 'How willing are you to invest time/money in training?',
    type: 'multiple' as const,
    options: ['low', 'medium', 'high'],
  },
  {
    id: 'q7',
    question: "What's your age range?",
    type: 'dropdown' as const,
    options: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  },
  {
    id: 'q8',
    question: 'Are you open to entrepreneurship?',
    type: 'likert' as const,
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
  const canProceed =
    responses[currentQ.id as keyof typeof responses] !== undefined;

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuiz();
      setShowEmailModal(true);
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleGenerateReport = async () => {
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    // Check if all required quiz questions are answered
    const requiredQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    const missingQuestions = requiredQuestions.filter(
      q => !responses[q as keyof typeof responses]
    );

    if (missingQuestions.length > 0) {
      alert(
        `Please answer all quiz questions before generating a report. Missing: ${missingQuestions.join(', ')}`
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Get all entries with text
      const allEntries = Object.values(columns)
        .flat()
        .filter(entry => entry.text.trim());

      // Create board in database
      const boardResponse = await fetch('/api/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'My Ikigai Board',
          entries: allEntries,
        }),
      });

      if (!boardResponse.ok) {
        const errorData = await boardResponse.json();
        console.error('Board save error:', errorData);
        throw new Error(
          `Failed to save board: ${errorData.error || 'Unknown error'}`
        );
      }

      const { boardId } = await boardResponse.json();

      // Debug: Log the data being sent
      console.log('Sending data to generate-report:', {
        boardId,
        entriesCount: allEntries.length,
        quizResponses: responses,
        profile: {
          email: email.trim(),
          name: name.trim() || undefined,
        },
      });

      // Generate report
      const reportResponse = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId,
          entries: allEntries,
          quiz: responses,
          profile: {
            email: email.trim(),
            name: name.trim() || undefined,
          },
        }),
      });

      if (!reportResponse.ok) {
        let errorData;
        try {
          errorData = await reportResponse.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = {
            error: `HTTP ${reportResponse.status}: ${reportResponse.statusText}`,
          };
        }
        console.error('Report generation error:', {
          status: reportResponse.status,
          statusText: reportResponse.statusText,
          errorData,
          url: reportResponse.url,
        });
        const errorMessage =
          errorData.error ||
          `HTTP ${reportResponse.status}: ${reportResponse.statusText}`;
        throw new Error(errorMessage);
      }

      const { reportId } = await reportResponse.json();

      // Redirect to report
      window.location.href = `/report/${reportId}`;
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return <LoadingScreen message="Generating your personalized report..." />;
  }

  if (isComplete && !showEmailModal) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
          <BackgroundBlobs />

          {/* Home Button - Top Left */}
          <div className="relative z-10 p-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen p-6 -mt-20">
            <Card className="p-8 max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h1>
              <p className="text-gray-600 mb-6">
                Ready to generate your personalized Ikigai report?
              </p>
              <Button
                onClick={() => setShowEmailModal(true)}
                className="w-full"
              >
                Generate Report
              </Button>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        <BackgroundBlobs />

        {/* Header */}
        <div className="relative z-10 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <Link href="/board">
                <Button variant="ghost" className="gap-2 text-sm sm:text-base">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Board
                </Button>
              </Link>

              <div className="text-xs sm:text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <QuestionCard
                    question={questions[currentQuestion].question}
                    type={questions[currentQuestion].type}
                    options={questions[currentQuestion].options}
                    value={
                      responses[
                        questions[currentQuestion].id as keyof typeof responses
                      ]
                    }
                    onChange={value =>
                      setResponse(
                        questions[currentQuestion].id as keyof typeof responses,
                        value
                      )
                    }
                    isActive={true}
                    isBlurred={false}
                    questionNumber={currentQuestion + 1}
                    totalQuestions={questions.length}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4 sm:mt-6 gap-3">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="gap-2 border-2 border-gray-300 hover:border-gray-400 font-semibold text-sm sm:text-base flex-1 sm:flex-none"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg text-sm sm:text-base flex-1 sm:flex-none"
              >
                {isLastQuestion ? 'Complete' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Email Modal */}
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Generate Your Report
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Enter your details to receive your personalized Ikigai career
                report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name (optional)
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-11 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-11 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 h-11 border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </Button>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !email.trim()}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 text-white font-semibold shadow-lg"
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

                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full h-10 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
