'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Star } from 'lucide-react';
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
        <div className="relative z-10 flex items-center justify-center min-h-screen">
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
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      <BackgroundBlobs />

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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
          <Card className="p-8 mb-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-200/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-orange-200/30 rounded-full"></div>
            <div className="absolute bottom-6 left-8 w-4 h-4 bg-yellow-300/30 rounded-full"></div>
            <div className="absolute bottom-4 right-6 w-10 h-10 bg-orange-200/20 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <NinjaStar size={120} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Your Ikigai Career Report
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover your path to purpose and fulfillment
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge
                  variant="secondary"
                  className="gap-1 bg-yellow-100 text-yellow-800"
                >
                  <Star className="h-3 w-3" />
                  Confidence: {report.confidence}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-yellow-300 text-yellow-700"
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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Career Paths */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🌟 Your Career Constellation
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Like Master Oogway once said, &ldquo;Yesterday is history, tomorrow is
                a mystery, but today is a gift.&rdquo; These career paths align with
                your unique Ikigai - the intersection of what you love, what
                you&apos;re good at, what you can be paid for, and what the world
                needs.
              </p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2">
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
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📚 Your Learning Journey
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                &ldquo;The journey of a thousand miles begins with a single step.&rdquo;
                These fields of study will help you develop the skills and
                knowledge needed to thrive in your chosen path. Each major is a
                stepping stone toward your Ikigai.
              </p>
            </motion.div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🚀 Your Innovation Garden
                  </h2>
                  <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    &ldquo;The best time to plant a tree was 20 years ago. The second
                    best time is now.&rdquo; These entrepreneurial ideas are seeds of
                    possibility, waiting for your passion and dedication to help
                    them bloom into something extraordinary.
                  </p>
                </motion.div>
                <div className="grid gap-3 md:grid-cols-2">
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
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎯 Your Action Plan
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                &ldquo;A journey of a thousand miles begins with a single step.&rdquo; These
                are your first steps toward living your Ikigai. Start with one,
                then the next, and before you know it, you&apos;ll be walking the
                path of your dreams.
              </p>
            </motion.div>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200/50">
              <div className="space-y-3">
                {report.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
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
