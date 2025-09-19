'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/ui/page-transition';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import NinjaStar from '@/components/NinjaStar';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import { supabase } from '@/lib/supabase';
import { useBoardStore } from '@/hooks/useBoardStore';
import { useQuizStore } from '@/hooks/useQuizStore';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const router = useRouter();
  const { resetBoard } = useBoardStore();
  const { resetQuiz } = useQuizStore();

  const handleStartFresh = () => {
    // Clear all stored data
    resetBoard();
    resetQuiz();

    // Navigate to board
    router.push('/board');
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMessage('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAuthMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/board`,
        },
      });

      if (error) {
        throw error;
      }

      setAuthMessage('Check your email for the magic link!');
    } catch (error) {
      console.error('Auth error:', error);
      setAuthMessage('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-moss-50 to-earth-50 relative overflow-hidden">
        <BackgroundBlobs />

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <NinjaStar size={32} className="sm:w-10 sm:h-10" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">IKIGAI</span>
            </div>

            <Button
              onClick={() => setShowAuth(true)}
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-sage-300 text-sage-700 hover:bg-sage-50 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-sage-800 mb-4 sm:mb-6 tracking-tight font-serif">
              IKIGAI
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-earth-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-sans px-2">
              Discover your purpose through the intersection of what you love,
              what you&apos;re good at, what you can be paid for, and what the
              world needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center mb-8 sm:mb-12"
          >
            <NinjaStar size={120} className="sm:w-48 sm:h-48 md:w-52 md:h-52" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 sm:space-y-6"
          >
            <Button
              onClick={handleStartFresh}
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-sage-500 to-moss-500 hover:from-sage-600 hover:to-moss-600 text-white font-sans w-full sm:w-auto"
            >
              Start Your Ikigai Journey
            </Button>

            <p className="text-xs sm:text-sm text-earth-600">
              No account required • Takes 5-10 minutes
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-sage-800 mb-3 sm:mb-4 font-serif">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-earth-700 max-w-2xl mx-auto font-sans px-2">
              A simple three-step process to discover your ideal career path
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Build Your Board',
                description:
                  'Fill in four columns with your passions, skills, potential income sources, and what the world needs.',
                color: 'from-sage-500 to-sage-600',
              },
              {
                step: '02',
                title: 'Take the Quiz',
                description:
                  'Answer 8 questions about your preferences, work style, and goals to refine your profile.',
                color: 'from-moss-500 to-moss-600',
              },
              {
                step: '03',
                title: 'Get Your Report',
                description:
                  'Receive personalized career recommendations, educational paths, and actionable next steps.',
                color: 'from-earth-500 to-earth-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 sm:p-8 text-center bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-sage-200 rounded-xl">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-4 sm:mb-6`}
                  >
                    {feature.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-sage-800 mb-3 sm:mb-4 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-earth-700 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-12 bg-white/90 backdrop-blur-sm border-sage-200 rounded-xl">
              <h2 className="text-2xl sm:text-4xl font-bold text-sage-800 mb-4 sm:mb-6 font-serif">
                Ready to Find Your Purpose?
              </h2>
              <p className="text-lg sm:text-xl text-earth-700 mb-6 sm:mb-8 font-sans">
                Join thousands who have discovered their ideal career path
                through Ikigai.
              </p>
              <Button
                onClick={handleStartFresh}
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-sans w-full sm:w-auto"
              >
                Start Now - It&apos;s Free
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter your email to receive a magic link for easy sign-in.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            {authMessage && (
              <p
                className={`text-sm ${authMessage.includes('Check your email') ? 'text-green-600' : 'text-red-600'}`}
              >
                {authMessage}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAuth(false)}
                className="flex-1 max-w-[140px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 max-w-[140px]"
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </PageTransition>
  );
}
