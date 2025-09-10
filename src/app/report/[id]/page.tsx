'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Star, Home } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NinjaStar from '@/components/NinjaStar';
import CareerCard from '@/components/report/CareerCard';
import MajorCard from '@/components/report/MajorCard';
import EntrepreneurCard from '@/components/report/EntrepreneurCard';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import TargetedAds from '@/components/ads/TargetedAds';
import PremiumFeatures from '@/components/premium/PremiumFeatures';
import { AIReport } from '@/lib/openai';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) {
          throw new Error('Report not found');
        }
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
      const element = document.getElementById('report-content');
      if (!element) {
        throw new Error('Report content not found');
      }

      // Generate canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFF8E7',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download
      pdf.save('ikigai-career-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
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

        <div className="relative z-10 flex items-center justify-center min-h-screen -mt-20">
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your report...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
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
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm max-w-md">
            <div className="text-red-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Report Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'The requested report could not be found.'}
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="gap-2 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGeneratingPDF ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </>
              )}
            </Button>
          </div>

          {/* Title Section */}
          <Card className="p-12 mb-12 text-center bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-12 right-12 w-12 h-12 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 animate-bounce delay-300"></div>
            <div className="absolute bottom-8 left-12 w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full opacity-20 animate-bounce delay-700"></div>
            <div className="absolute bottom-6 right-8 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-bounce delay-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <NinjaStar size={140} />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Your Ikigai Career Report
              </h1>
              <p className="text-2xl text-gray-700 mb-8 font-medium">
                Discover your path to purpose and fulfillment
              </p>
              <div className="flex items-center justify-center gap-6">
                <Badge
                  variant="secondary"
                  className="gap-2 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-800 px-4 py-2 text-sm font-semibold"
                >
                  <Star className="h-4 w-4" />
                  Confidence: {report.confidence}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 bg-purple-50 px-4 py-2 text-sm font-semibold"
                >
                  Tone: {report.tone}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Career Paths */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">🌟</span>
                <span>Your Career Constellation</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Discover Your Professional Destiny
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                Like Master Oogway once said, &ldquo;Yesterday is history,
                tomorrow is a mystery, but today is a gift.&rdquo; These career
                paths align with your unique Ikigai - the intersection of what
                you love, what you&apos;re good at, what you can be paid for,
                and what the world needs.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {report.careers.map((career, index) => (
                <CareerCard key={index} career={career} index={index} />
              ))}
            </div>
          </section>

          {/* Majors */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">📚</span>
                <span>Your Learning Journey</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Knowledge is Your Foundation
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                &ldquo;The journey of a thousand miles begins with a single
                step.&rdquo; These fields of study will help you develop the
                skills and knowledge needed to thrive in your chosen path. Each
                major is a stepping stone toward your Ikigai.
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {report.majors.map((major, index) => (
                <MajorCard key={index} major={major} index={index} />
              ))}
            </div>
          </section>

          {/* Entrepreneurial Ideas */}
          {report.entrepreneurialIdeas &&
            report.entrepreneurialIdeas.length > 0 && (
              <section>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center mb-12"
                >
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                    <span className="text-2xl">🚀</span>
                    <span>Your Innovation Garden</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Plant Seeds of Innovation
                  </h2>
                  <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                    &ldquo;The best time to plant a tree was 20 years ago. The
                    second best time is now.&rdquo; These entrepreneurial ideas
                    are seeds of possibility, waiting for your passion and
                    dedication to help them bloom into something extraordinary.
                  </p>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {report.entrepreneurialIdeas.map((idea, index) => (
                    <EntrepreneurCard key={index} idea={idea} index={index} />
                  ))}
                </div>
              </section>
            )}

          {/* Next Steps */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
                <span>Your Action Plan</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Take Your First Steps
              </h2>
              <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                &ldquo;A journey of a thousand miles begins with a single
                step.&rdquo; These are your first steps toward living your
                Ikigai. Start with one, then the next, and before you know it,
                you&apos;ll be walking the path of your dreams.
              </p>
            </motion.div>
            <Card className="p-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl">
              <div className="space-y-4">
                {report.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base font-medium">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </section>

          {/* Targeted Ads Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <TargetedAds report={report} />
            </motion.div>
          </section>

          {/* Premium Features Section */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <PremiumFeatures />
            </motion.div>
          </section>

          {/* Footer */}
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm">
            <p className="text-gray-600 mb-4">
              This report was generated using AI based on your Ikigai board and
              quiz responses.
            </p>
            <p className="text-sm text-gray-500">
              Remember: Your journey is unique. Use this as a starting point,
              not a destination.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
