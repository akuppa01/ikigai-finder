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
// import TargetedAds from '@/components/ads/TargetedAds';
// import PremiumFeatures from '@/components/premium/PremiumFeatures';
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
      // Create a new PDF with better layout
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let currentY = margin;

      // Helper function to add a new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (currentY + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrapping
      const addText = (
        text: string,
        fontSize: number,
        isBold: boolean = false,
        color: string = '#000000'
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('times', isBold ? 'bold' : 'normal'); // Use Times font for better PDF compatibility
        pdf.setTextColor(color);

        const lines = pdf.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.4;

        checkPageBreak(lines.length * lineHeight + 5);

        lines.forEach((line: string) => {
          pdf.text(line, margin, currentY);
          currentY += lineHeight;
        });
        currentY += 5;
      };

      // Helper function to add a section header
      const addSectionHeader = (title: string, emoji: string) => {
        checkPageBreak(30); // Ensure enough space for title and underline
        currentY += 10;

        // Add emoji and title
        pdf.setFontSize(18);
        pdf.setFont('times', 'bold'); // Use Times font for better PDF compatibility
        pdf.setTextColor('#68A357'); // Sage green
        pdf.text(`${emoji} ${title}`, margin, currentY);
        currentY += 8;

        // Add underline
        pdf.setDrawColor(104, 163, 87); // Sage green
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
      };

      // Helper function to add a card-like section
      const addCard = (
        title: string,
        description: string,
        color: string = '#4F46E5'
      ) => {
        // Calculate required height for the entire card
        const titleLines = pdf.splitTextToSize(title, contentWidth - 10);
        const descLines = pdf.splitTextToSize(description, contentWidth - 10);
        const requiredHeight =
          titleLines.length * 14 * 0.4 + descLines.length * 10 * 0.4 + 15;

        checkPageBreak(requiredHeight);

        // Card background
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(
          margin,
          currentY - 5,
          contentWidth,
          requiredHeight,
          2,
          2,
          'FD'
        );

        // Title
        pdf.setFontSize(14);
        pdf.setFont('times', 'bold'); // Use Times font for better PDF compatibility
        pdf.setTextColor(color);
        pdf.text(titleLines, margin + 5, currentY + 5);
        currentY += titleLines.length * 14 * 0.4 + 3;

        // Description
        pdf.setFontSize(10);
        pdf.setFont('times', 'normal'); // Use Times font for better PDF compatibility
        pdf.setTextColor('#374151');
        pdf.text(descLines, margin + 5, currentY);
        currentY += descLines.length * 10 * 0.4 + 10;
      };

      // Title Page
      pdf.setFillColor(104, 163, 87); // Sage green
      pdf.rect(0, 0, pageWidth, 60, 'F');

      pdf.setFontSize(24);
      pdf.setFont('times', 'bold'); // Use Times font for better PDF compatibility
      pdf.setTextColor(255, 255, 255);
      pdf.text('Your Ikigai Career Report', pageWidth / 2, 25, {
        align: 'center',
      });

      pdf.setFontSize(14);
      pdf.setFont('times', 'normal'); // Use Times font for better PDF compatibility
      pdf.text(
        'Discover your path to purpose and fulfillment',
        pageWidth / 2,
        35,
        { align: 'center' }
      );

      currentY = 80;

      // Report metadata
      addText(`Confidence Level: ${report.confidence}`, 12, true, '#68A357'); // Sage green
      addText(`Tone: ${report.tone}`, 12, true, '#8B7355'); // Earth brown
      currentY += 10;

      // Career Paths Section
      addSectionHeader('Your Career Constellation', '🌟');
      addText(
        'Like Master Oogway once said, "Yesterday is history, tomorrow is a mystery, but today is a gift." These career paths align with your unique Ikigai - the intersection of what you love, what you\'re good at, what you can be paid for, and what the world needs.',
        11
      );
      currentY += 5;

      report.careers.forEach((career, index) => {
        addCard(
          `${index + 1}. ${career.title}`,
          career.description,
          '#68A357' // Sage green
        );
      });

      // Majors Section
      addSectionHeader('Your Learning Journey', '📚');
      addText(
        '"The journey of a thousand miles begins with a single step." These fields of study will help you develop the skills and knowledge needed to thrive in your chosen path. Each major is a stepping stone toward your Ikigai.',
        11
      );
      currentY += 5;

      report.majors.forEach((major, index) => {
        addCard(
          `${index + 1}. ${major.title}`,
          major.description,
          '#5B7A34' // Moss green
        );
      });

      // Entrepreneurial Ideas Section
      if (
        report.entrepreneurialIdeas &&
        report.entrepreneurialIdeas.length > 0
      ) {
        addSectionHeader('Your Innovation Garden', '🚀');
        addText(
          '"The best time to plant a tree was 20 years ago. The second best time is now." These entrepreneurial ideas are seeds of possibility, waiting for your passion and dedication to help them bloom into something extraordinary.',
          11
        );
        currentY += 5;

        report.entrepreneurialIdeas.forEach((idea, index) => {
          addCard(
            `${index + 1}. ${idea.title}`,
            idea.description,
            '#8B7355' // Earth brown
          );
        });
      }

      // Next Steps Section
      addSectionHeader('Your Action Plan', '🎯');
      addText(
        '"A journey of a thousand miles begins with a single step." These are your first steps toward living your Ikigai. Start with one, then the next, and before you know it, you\'ll be walking the path of your dreams.',
        11
      );
      currentY += 5;

      report.nextSteps.forEach((step, index) => {
        addCard(
          `Step ${index + 1}`,
          step,
          '#F59E0B' // Gold
        );
      });

      // Footer
      checkPageBreak(20);
      currentY += 10;
      addText(
        'This report was generated using AI based on your Ikigai board and quiz responses.',
        10,
        false,
        '#6B7280'
      );
      addText(
        'Remember: Your journey is unique. Use this as a starting point, not a destination.',
        10,
        false,
        '#6B7280'
      );

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
    <div className="min-h-screen bg-gradient-to-br from-sage-100 via-moss-100 to-earth-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sage-200/20 via-moss-200/20 to-earth-200/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sage-300/30 to-moss-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-earth-300/30 to-gold-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-moss-200/20 to-sage-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
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
              className="gap-2 bg-gradient-to-r from-sage-500 to-moss-500 hover:from-sage-600 hover:to-moss-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
          <Card className="p-12 mb-12 text-center bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl relative overflow-hidden rounded-2xl">
            {/* Decorative elements */}
            <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-r from-sage-400 to-moss-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-12 right-12 w-12 h-12 bg-gradient-to-r from-earth-400 to-gold-400 rounded-full opacity-20 animate-bounce delay-300"></div>
            <div className="absolute bottom-8 left-12 w-8 h-8 bg-gradient-to-r from-moss-400 to-sage-400 rounded-full opacity-20 animate-bounce delay-700"></div>
            <div className="absolute bottom-6 right-8 w-20 h-20 bg-gradient-to-r from-sage-400 to-earth-400 rounded-full opacity-20 animate-bounce delay-1000"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <NinjaStar size={140} />
                  <div className="absolute inset-0 bg-gradient-to-r from-sage-400 to-moss-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-sage-600 via-moss-600 to-earth-600 bg-clip-text text-transparent mb-6 font-serif">
                Your Ikigai Career Report
              </h1>
              <p className="text-2xl text-earth-700 mb-8 font-medium font-sans">
                Discover your path to purpose and fulfillment
              </p>
              <div className="flex items-center justify-center gap-6">
                <Badge
                  variant="secondary"
                  className="gap-2 bg-gradient-to-r from-sage-100 to-moss-100 text-sage-800 px-4 py-2 text-sm font-semibold"
                >
                  <Star className="h-4 w-4" />
                  Confidence: {report.confidence}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-2 border-earth-300 text-earth-700 bg-earth-50 px-4 py-2 text-sm font-semibold"
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
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sage-500 to-moss-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">🌟</span>
                <span>Your Career Constellation</span>
              </div>
              <h2 className="text-4xl font-bold text-sage-800 mb-6 font-serif">
                Discover Your Professional Destiny
              </h2>
              <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto font-sans">
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
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-moss-500 to-sage-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">📚</span>
                <span>Your Learning Journey</span>
              </div>
              <h2 className="text-4xl font-bold text-sage-800 mb-6 font-serif">
                Knowledge is Your Foundation
              </h2>
              <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto font-sans">
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
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-earth-500 to-gold-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                    <span className="text-2xl">🚀</span>
                    <span>Your Innovation Garden</span>
                  </div>
                  <h2 className="text-4xl font-bold text-sage-800 mb-6 font-serif">
                    Plant Seeds of Innovation
                  </h2>
                  <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto font-sans">
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
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sage-500 to-earth-500 text-white px-6 py-3 rounded-full text-lg font-semibold mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
                <span>Your Action Plan</span>
              </div>
              <h2 className="text-4xl font-bold text-sage-800 mb-6 font-serif">
                Take Your First Steps
              </h2>
              <p className="text-xl text-earth-700 leading-relaxed max-w-3xl mx-auto font-sans">
                &ldquo;A journey of a thousand miles begins with a single
                step.&rdquo; These are your first steps toward living your
                Ikigai. Start with one, then the next, and before you know it,
                you&apos;ll be walking the path of your dreams.
              </p>
            </motion.div>
            <Card className="p-8 bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
              <div className="space-y-4">
                {report.nextSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-sage-50 to-moss-50 hover:from-sage-100 hover:to-moss-100 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-sage-500 to-moss-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-earth-700 leading-relaxed text-base font-medium font-sans">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </section>

          {/* Targeted Ads Section - COMMENTED OUT */}
          {/* <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <TargetedAds report={report} />
            </motion.div>
          </section> */}

          {/* Premium Features Section - COMMENTED OUT */}
          {/* <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <PremiumFeatures />
            </motion.div>
          </section> */}

          {/* Footer */}
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm rounded-xl">
            <p className="text-earth-600 mb-4 font-sans">
              This report was generated using AI based on your Ikigai board and
              quiz responses.
            </p>
            <p className="text-sm text-earth-500 font-sans">
              Remember: Your journey is unique. Use this as a starting point,
              not a destination.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
