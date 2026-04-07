'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import NinjaStar from '@/components/NinjaStar';
import { supabase } from '@/lib/supabase';
import { useBoardStore } from '@/hooks/useBoardStore';
import { useQuizStore } from '@/hooks/useQuizStore';

const philosophyItems = [
  {
    kanji: '愛',
    english: 'PASSION',
    label: 'What you love',
    description:
      'The pursuits that ignite your soul. The work you would do even without reward.',
    color: 'crimson',
  },
  {
    kanji: '才',
    english: 'VOCATION',
    label: "What you're good at",
    description:
      'Your innate gifts and cultivated skills. The craft you have honed through dedication.',
    color: 'navy',
  },
  {
    kanji: '富',
    english: 'PROFESSION',
    label: 'What you can be paid for',
    description:
      'Where your abilities meet the market. The exchange that sustains your practice.',
    color: 'bronze',
  },
  {
    kanji: '世',
    english: 'MISSION',
    label: 'What the world needs',
    description:
      'The contribution only you can make. The reason your work matters beyond yourself.',
    color: 'forest',
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  crimson: {
    border: 'border-crimson-200',
    text: 'text-crimson-700',
    bg: 'bg-crimson-50',
  },
  navy: {
    border: 'border-[#1E4D72]/20',
    text: 'text-[#1E4D72]',
    bg: 'bg-[#1E4D72]/5',
  },
  bronze: {
    border: 'border-bronze-300',
    text: 'text-bronze-700',
    bg: 'bg-bronze-50',
  },
  forest: {
    border: 'border-[#2D6A4F]/20',
    text: 'text-[#2D6A4F]',
    bg: 'bg-[#2D6A4F]/5',
  },
};

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const router = useRouter();
  const { resetBoard } = useBoardStore();
  const { resetQuiz } = useQuizStore();

  const handleStartFresh = () => {
    resetBoard();
    resetQuiz();
    router.push('/board');
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAuthMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/board` },
      });
      if (error) throw error;
      setAuthMessage('Check your email for the magic link!');
    } catch (error) {
      console.error('Auth error:', error);
      setAuthMessage('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* ─── HEADER ─────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-ink-200/40">
        <div className="flex items-center gap-3">
          <NinjaStar size={28} animated={false} />
          <span className="font-serif text-base font-light tracking-[0.25em] text-ink-800 uppercase">
            Ikigai
          </span>
        </div>
        <Button
          onClick={() => setShowAuth(true)}
          variant="ghost"
          size="sm"
          className="text-ink-600 hover:text-ink-900 hover:bg-ink-100 text-xs tracking-widest uppercase font-sans"
        >
          Sign In
        </Button>
      </header>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">

        {/* Background: giant kanji at near-zero opacity */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span className="font-serif text-[30vw] text-ink-900 opacity-[0.025] leading-none">
            生き甲斐
          </span>
        </div>

        {/* Floating quotes — very subtle */}
        <div aria-hidden className="pointer-events-none select-none absolute inset-0 overflow-hidden">
          <span className="absolute top-[15%] left-[8%] font-serif text-sm text-ink-400 opacity-30 rotate-[-6deg]">
            「己を知れ」
          </span>
          <span className="absolute top-[20%] right-[10%] font-serif text-sm text-ink-400 opacity-30 rotate-[4deg]">
            「一期一会」
          </span>
          <span className="absolute bottom-[20%] left-[12%] font-serif text-sm text-ink-400 opacity-30 rotate-[-3deg]">
            「初心忘るべからず」
          </span>
          <span className="absolute bottom-[15%] right-[8%] font-serif text-sm text-ink-400 opacity-30 rotate-[5deg]">
            「七転び八起き」
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="tracking-[0.4em] text-crimson-600 text-xs uppercase font-sans mb-8">
              The Japanese Art of Purpose
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4"
          >
            <NinjaStar size={80} className="mx-auto mb-8 sm:mb-10" animated={true} />
            <h1 className="font-serif font-light text-ink-900 leading-none tracking-[0.12em] text-7xl sm:text-8xl md:text-[108px]">
              IKIGAI
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="w-12 h-px bg-crimson-600 mx-auto" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-lg sm:text-xl text-ink-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Discover the intersection of what you love, what you&apos;re good at,
            what you can be paid for, and what the world needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={handleStartFresh}
              className="bg-crimson-600 hover:bg-crimson-700 text-white px-10 sm:px-14 py-5 sm:py-6 text-sm tracking-[0.2em] uppercase font-sans rounded-none transition-colors duration-200"
            >
              Begin Your Journey
            </Button>
            <p className="text-[11px] tracking-[0.25em] text-ink-400 uppercase">
              No account required · 5–10 minutes
            </p>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F0E8] to-transparent pointer-events-none" />
      </section>

      {/* ─── FOUR ELEMENTS ──────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-t border-ink-200/40">
        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 sm:mb-20"
          >
            <p className="tracking-[0.35em] text-crimson-600 text-xs uppercase font-sans mb-4">
              The Four Pillars
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-ink-900 mb-4">
              At the heart of Ikigai
            </h2>
            <div className="w-12 h-px bg-crimson-600 mx-auto mb-4" />
            <p className="text-ink-500 text-base max-w-xl mx-auto leading-relaxed">
              Four essential questions whose answers, when they converge,
              reveal your reason for being.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink-200/30">
            {philosophyItems.map((item, index) => {
              const colors = colorMap[item.color];
              return (
                <motion.div
                  key={item.english}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#F5F0E8] p-8 sm:p-10 hover:bg-parchment-100 transition-colors duration-300 group"
                >
                  <div className={`font-serif text-5xl mb-5 ${colors.text} opacity-80`}>
                    {item.kanji}
                  </div>
                  <h3 className="font-serif text-xl font-light text-ink-900 mb-1 tracking-wider">
                    {item.english}
                  </h3>
                  <p className="text-xs text-ink-400 tracking-wide mb-5 uppercase">
                    {item.label}
                  </p>
                  <div className="w-8 h-px bg-ink-300 mb-5 group-hover:w-16 transition-all duration-300" />
                  <p className="text-ink-600 text-sm leading-relaxed font-sans">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 bg-parchment-100 border-t border-ink-200/40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="tracking-[0.35em] text-crimson-600 text-xs uppercase font-sans mb-4">
              The Process
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-ink-900 mb-4">
              Three steps to clarity
            </h2>
            <div className="w-12 h-px bg-crimson-600 mx-auto" />
          </motion.div>

          <div className="space-y-0">
            {[
              {
                number: '01',
                title: 'Build Your Ikigai Board',
                description:
                  'Fill four columns with what you love, your skills, potential income sources, and your contribution to the world. Take your time — this is reflection, not a test.',
              },
              {
                number: '02',
                title: 'Answer Eight Questions',
                description:
                  'Eight carefully chosen questions help us understand your work style, ambitions, and life stage. Your answers refine our understanding of your unique path.',
              },
              {
                number: '03',
                title: 'Receive Your Report',
                description:
                  'A personalized career report that reveals your Ikigai — with specific paths, learning roadmaps, and next steps tailored to who you are.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex gap-8 sm:gap-12 items-start py-10 sm:py-12 border-b border-ink-200/40 last:border-0"
              >
                <div className="font-serif text-4xl sm:text-5xl font-light text-crimson-600/40 leading-none flex-shrink-0 w-16 text-right">
                  {step.number}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-serif text-xl font-light text-ink-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-ink-500 leading-relaxed text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUOTE ─────────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28 border-t border-ink-200/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-serif text-3xl sm:text-4xl font-light text-ink-800 leading-relaxed mb-6">
            &ldquo;The two most important days in your life are the day you are born and the day you find out why.&rdquo;
          </p>
          <div className="w-8 h-px bg-crimson-600 mx-auto mb-4" />
          <p className="text-xs tracking-[0.3em] text-ink-400 uppercase">Mark Twain</p>
        </motion.div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────── */}
      <section className="px-6 py-20 sm:py-28 bg-ink-900 border-t border-ink-200/40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="tracking-[0.35em] text-crimson-400 text-xs uppercase font-sans mb-6">
            Begin Today
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-parchment-200 mb-4">
            Ready to discover your reason for being?
          </h2>
          <p className="text-ink-400 mb-10 leading-relaxed">
            Join thousands who have found their path through the ancient wisdom of Ikigai.
          </p>
          <Button
            onClick={handleStartFresh}
            className="bg-crimson-600 hover:bg-crimson-700 text-white px-12 py-6 text-sm tracking-[0.2em] uppercase font-sans rounded-none transition-colors duration-200"
          >
            Start Now — It&apos;s Free
          </Button>
        </motion.div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────── */}
      <footer className="px-6 py-8 border-t border-ink-200/40 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <NinjaStar size={20} animated={false} />
            <span className="font-serif text-xs font-light tracking-[0.2em] text-ink-500 uppercase">
              Ikigai
            </span>
          </div>
          <p className="text-xs text-ink-400 tracking-wide">
            生き甲斐 · Your reason for being
          </p>
        </div>
      </footer>

      {/* ─── AUTH MODAL ─────────────────────────────────── */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md bg-parchment-50 border border-ink-200 rounded-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-light text-ink-900">
              Sign In
            </DialogTitle>
            <DialogDescription className="text-ink-500 text-sm">
              Enter your email to receive a magic link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMagicLink} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs tracking-widest uppercase text-ink-600">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="rounded-none border-ink-300 focus:ring-crimson-500 bg-white"
              />
            </div>
            {authMessage && (
              <p className={`text-sm ${authMessage.includes('Check your email') ? 'text-green-700' : 'text-crimson-600'}`}>
                {authMessage}
              </p>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAuth(false)}
                className="flex-1 rounded-none border-ink-300 text-ink-600 hover:bg-ink-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-none bg-crimson-600 hover:bg-crimson-700 text-white"
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
