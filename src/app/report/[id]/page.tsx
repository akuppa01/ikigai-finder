'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Home, Download, Share2, ChevronRight, TrendingUp, DollarSign, GraduationCap, Lightbulb, Target, CheckCircle2 } from 'lucide-react';
import LoadingScreen from '@/components/ui/loading-screen';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NinjaStar from '@/components/NinjaStar';
import CourseRecommendations from '@/components/report/CourseRecommendations';
import { AIReport } from '@/lib/openai';
import { generateAestheticPDF } from '@/lib/pdf-generator';
import { generateStoryForReport } from '@/lib/story-generator';
import { sampleUserProfile } from '@/lib/personalization';

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-6 h-px bg-crimson-600" />
      <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-crimson-600">
        {children}
      </p>
    </div>
  );
}

interface CareerCardProps {
  career: AIReport['careers'][0];
  rank: number;
  index: number;
}

function CareerCard({ career, rank, index }: CareerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div {...fadeUp(index * 0.1)} className="border border-ink-200 bg-white">
      {/* Rank indicator */}
      <div className="flex items-start gap-0">
        <div
          className="w-1 self-stretch bg-crimson-600 flex-shrink-0"
          style={{ opacity: 1 - index * 0.25 }}
        />
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-xs text-crimson-400 font-light">#{rank}</span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-ink-300">Career Path</span>
              </div>
              <h3 className="font-serif text-xl font-light text-ink-900 leading-tight">
                {career.title}
              </h3>
            </div>
            {career.growth && (
              <div className="flex items-center gap-1 text-[10px] text-[#2D6A4F] bg-[#2D6A4F]/8 px-2 py-1 ml-3 flex-shrink-0">
                <TrendingUp className="h-2.5 w-2.5" />
                {career.growth}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-ink-600 text-sm leading-relaxed mb-4 font-sans">
            {career.description}
          </p>

          {/* Why this fits */}
          <div className="bg-parchment-100 p-4 mb-4 border-l-2 border-crimson-200">
            <p className="text-[10px] tracking-[0.2em] uppercase text-crimson-600 mb-1.5">
              Why this fits your Ikigai
            </p>
            <p className="text-ink-600 text-sm leading-relaxed italic font-serif font-light">
              {career.description.split('.')[0] + '.'}
            </p>
          </div>

          {/* Salary + details row */}
          <div className="flex flex-wrap gap-4 mb-4">
            {career.salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 text-bronze-600" />
                <span className="text-xs text-ink-500 font-sans">{career.salary}</span>
              </div>
            )}
          </div>

          {/* Next steps (collapsible) */}
          {career.nextSteps && career.nextSteps.length > 0 && (
            <div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-ink-400 hover:text-ink-700 transition-colors duration-150 mb-3"
              >
                <ChevronRight
                  className={`h-3 w-3 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
                />
                {expanded ? 'Hide steps' : 'Show next steps'}
              </button>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  {career.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-ink-600">
                      <span className="w-4 h-4 rounded-full bg-crimson-600 text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                        {i + 1}
                      </span>
                      <span className="font-sans leading-relaxed">{step}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* Course recommendations */}
          <CourseRecommendations careerTitle={career.title} index={index} />
        </div>
      </div>
    </motion.div>
  );
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) throw new Error('Report not found');
        const data = await response.json();
        setReport(data.report);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (!report) throw new Error('No report data available');
      const storyGenerator = generateStoryForReport(report, {
        name: sampleUserProfile.name,
        email: sampleUserProfile.email,
      });
      const pdf = generateAestheticPDF({
        report,
        userProfile: { name: sampleUserProfile.name, email: sampleUserProfile.email },
        storyGenerator,
      });
      pdf.save('ikigai-career-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (loading) return <LoadingScreen message="Loading your report..." />;

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col">
        <div className="p-6">
          <a href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-ink-500 hover:text-ink-900 text-xs tracking-widest uppercase rounded-none">
              <Home className="h-3 w-3" />
              Home
            </Button>
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <p className="font-serif text-xl font-light text-ink-900 mb-2">Report Not Found</p>
            <div className="w-8 h-px bg-crimson-600 mx-auto mb-4" />
            <p className="text-ink-500 text-sm mb-6">{error || 'The requested report could not be found.'}</p>
            <a href="/"><Button className="bg-crimson-600 hover:bg-crimson-700 text-white rounded-none text-xs tracking-widest uppercase">Back to Home</Button></a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* ─── HEADER ─────────────────────────────────────── */}
      <header className="border-b border-ink-200/40 px-4 sm:px-8 py-4 bg-white/60 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <a href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-ink-500 hover:text-ink-900 text-xs tracking-widest uppercase rounded-none">
              <Home className="h-3 w-3" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </a>
          <div className="flex items-center gap-2">
            <NinjaStar size={20} animated={false} />
            <span className="font-serif text-xs font-light tracking-[0.2em] text-ink-500 uppercase hidden sm:inline">
              Ikigai Report
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-ink-400 hover:text-ink-700 text-[10px] tracking-widest uppercase rounded-none"
            >
              <Share2 className="h-3 w-3" />
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-1.5 bg-crimson-600 hover:bg-crimson-700 text-white text-[10px] tracking-[0.15em] uppercase rounded-none px-4"
            >
              <Download className="h-3 w-3" />
              {isGeneratingPDF ? 'Saving...' : 'PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* ─── HERO BANNER ─────────────────────────────────── */}
      <div className="bg-ink-900 px-4 sm:px-8 py-14 sm:py-20 text-center relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        >
          <span className="font-serif text-[25vw] text-white opacity-[0.03] leading-none">
            生き甲斐
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <p className="tracking-[0.4em] text-crimson-400 text-[10px] uppercase font-sans mb-4">
            Your Personal Report
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-parchment-200 mb-4 tracking-wide">
            Your Ikigai
          </h1>
          <div className="w-10 h-px bg-crimson-600 mx-auto mb-4" />
          <p className="text-ink-400 text-sm max-w-md mx-auto leading-relaxed">
            Based on your board and reflections, we have identified the paths
            that align with your unique reason for being.
          </p>

          {/* Metadata badges */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {report.confidence && (
              <div className="flex items-center gap-1.5 text-[10px] text-ink-400 border border-ink-700 px-3 py-1.5">
                <span className="text-ink-500">Confidence</span>
                <span className="text-parchment-300 font-medium capitalize">{report.confidence}</span>
              </div>
            )}
            {report.tone && (
              <div className="flex items-center gap-1.5 text-[10px] text-ink-400 border border-ink-700 px-3 py-1.5">
                <span className="text-ink-500">Tone</span>
                <span className="text-parchment-300 font-medium capitalize">{report.tone}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────── */}
      <div id="report-content" className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">

        {/* ── Career Paths ── */}
        <section>
          <motion.div {...fadeUp(0)} className="mb-8">
            <SectionLabel>Career Paths</SectionLabel>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink-900">
              Your Career Constellation
            </h2>
            <p className="text-ink-500 text-sm mt-2 leading-relaxed max-w-xl">
              These paths emerge from the intersection of your passions, skills, and potential contributions.
              Each one resonates with a different facet of your Ikigai.
            </p>
          </motion.div>

          <div className="space-y-4">
            {(report.careers || []).map((career, index) => (
              <CareerCard
                key={index}
                career={career}
                rank={index + 1}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* ── Learning Journey ── */}
        {report.majors && report.majors.length > 0 && (
          <section>
            <motion.div {...fadeUp(0)} className="mb-8">
              <SectionLabel>Academic Paths</SectionLabel>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink-900 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-ink-400" />
                Your Learning Journey
              </h2>
              <p className="text-ink-500 text-sm mt-2 leading-relaxed max-w-xl">
                These fields of study align with your Ikigai and provide the foundations
                for your chosen paths.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(report.majors || []).map((major, index) => (
                <motion.div
                  key={index}
                  {...fadeUp(index * 0.1)}
                  className="border border-ink-200 bg-white p-6"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-ink-300 font-sans mt-0.5">#{index + 1}</span>
                  </div>
                  <h3 className="font-serif text-lg font-light text-ink-900 mb-2">{major.title}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed mb-4 font-sans">{major.description}</p>

                  <div className="space-y-2 text-xs text-ink-500">
                    {major.duration && (
                      <div className="flex items-center gap-2">
                        <span className="text-ink-300">Duration</span>
                        <span className="font-medium text-ink-700">{major.duration}</span>
                      </div>
                    )}
                    {major.universities && major.universities.length > 0 && (
                      <div>
                        <span className="text-ink-300 block mb-1">Top Institutions</span>
                        <div className="flex flex-wrap gap-1.5">
                          {major.universities.slice(0, 3).map((uni, i) => (
                            <span key={i} className="text-[10px] bg-parchment-100 px-2 py-0.5 text-ink-600 border border-ink-100">
                              {uni}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Entrepreneurial Ideas ── */}
        {report.entrepreneurialIdeas && report.entrepreneurialIdeas.length > 0 && (
          <section>
            <motion.div {...fadeUp(0)} className="mb-8">
              <SectionLabel>Entrepreneurial Vision</SectionLabel>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink-900 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-ink-400" />
                Your Innovation Space
              </h2>
              <p className="text-ink-500 text-sm mt-2 leading-relaxed max-w-xl">
                These ventures emerge naturally from your unique combination of skills,
                passion, and awareness of what the world needs.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {(report.entrepreneurialIdeas || []).map((idea, index) => (
                <motion.div
                  key={index}
                  {...fadeUp(index * 0.1)}
                  className="border border-ink-200 bg-white p-6"
                >
                  <div className="w-4 h-px bg-crimson-600 mb-4" />
                  <h3 className="font-serif text-lg font-light text-ink-900 mb-2">{idea.title}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed mb-4 font-sans">{idea.description}</p>

                  {idea.nextSteps && idea.nextSteps.length > 0 && (
                    <div className="space-y-1.5">
                      {idea.nextSteps.slice(0, 3).map((step, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-ink-500">
                          <ChevronRight className="h-3 w-3 text-crimson-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Action Plan ── */}
        {report.nextSteps && report.nextSteps.length > 0 && (
          <section>
            <motion.div {...fadeUp(0)} className="mb-8">
              <SectionLabel>Your Roadmap</SectionLabel>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-ink-900 flex items-center gap-3">
                <Target className="h-6 w-6 text-ink-400" />
                First Steps
              </h2>
              <p className="text-ink-500 text-sm mt-2 leading-relaxed max-w-xl">
                A thousand-mile journey begins with a single step. These are yours.
              </p>
            </motion.div>

            <div className="bg-white border border-ink-200">
              {report.nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  {...fadeUp(index * 0.08)}
                  className="flex items-start gap-5 p-5 border-b border-ink-100 last:border-0"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-crimson-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-sans font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-ink-700 text-sm leading-relaxed font-sans">{step}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-ink-200 flex-shrink-0 mt-0.5" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Download CTA ── */}
        <motion.section {...fadeUp(0)} className="bg-ink-900 p-8 sm:p-12 text-center">
          <div
            aria-hidden
            className="pointer-events-none select-none absolute inset-0 overflow-hidden"
          >
          </div>
          <NinjaStar size={40} className="mx-auto mb-5" animated={false} />
          <p className="tracking-[0.3em] text-crimson-400 text-[10px] uppercase font-sans mb-3">
            Your Ikigai Report
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-light text-parchment-200 mb-3">
            Save your report
          </h3>
          <p className="text-ink-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
            Download a beautifully formatted PDF to revisit, share, or reflect upon your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2 bg-crimson-600 hover:bg-crimson-700 text-white rounded-none text-xs tracking-[0.2em] uppercase px-8 py-4"
            >
              <Download className="h-3.5 w-3.5" />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2 border-ink-600 text-ink-400 hover:text-parchment-200 hover:border-ink-400 rounded-none text-xs tracking-[0.2em] uppercase px-8 py-4 bg-transparent"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? 'Link Copied!' : 'Share Report'}
            </Button>
          </div>
        </motion.section>

        {/* ── Footer Note ── */}
        <div className="text-center pb-8">
          <div className="w-6 h-px bg-ink-300 mx-auto mb-4" />
          <p className="text-ink-400 text-xs leading-relaxed max-w-md mx-auto">
            This report was generated by AI based on your Ikigai board and reflections.
            Use it as a starting point, not a destination. Your path is yours alone.
          </p>
          <p className="text-ink-300 text-[10px] mt-3 tracking-widest">
            生き甲斐 · Ikigai
          </p>
        </div>
      </div>
    </div>
  );
}
