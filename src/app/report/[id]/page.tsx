'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NinjaStar from '@/components/NinjaStar';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import ReportHeader from '@/components/report/ReportHeader';
import ReportCard from '@/components/report/ReportCard';
import SectionHeader from '@/components/report/SectionHeader';
import ActionPlan from '@/components/report/ActionPlan';
import { AIReport } from '@/lib/openai';
import {
  generatePersonalizedExplanation,
  sampleUserProfile,
} from '@/lib/personalization';
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

      // Career Constellation Section
      addSectionHeader('Your Career Constellation', '🌟');
      addText(
        'Like Master Oogway once said, "Yesterday is history, tomorrow is a mystery, but today is a gift." These career paths align with your unique Ikigai - the intersection of what you love, what you\'re good at, what you can be paid for, and what the world needs.',
        11
      );
      currentY += 5;

      report.careers.forEach((career, index) => {
        const personalizedDescription = generatePersonalizedExplanation(
          career,
          sampleUserProfile,
          'career'
        );

        addCard(
          `${index + 1}. ${career.title}`,
          personalizedDescription,
          '#68A357' // Sage green
        );
      });

      // Learning Journey Section
      addSectionHeader('Your Learning Journey', '📚');
      addText(
        '"The journey of a thousand miles begins with a single step." These fields of study will help you develop the skills and knowledge needed to thrive in your chosen path. Each major is a stepping stone toward your Ikigai.',
        11
      );
      currentY += 5;

      report.majors.forEach((major, index) => {
        const personalizedDescription = generatePersonalizedExplanation(
          major,
          sampleUserProfile,
          'major'
        );

        addCard(
          `${index + 1}. ${major.title}`,
          personalizedDescription,
          '#5B7A34' // Moss green
        );
      });

      // Innovation Garden Section
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
          const personalizedDescription = generatePersonalizedExplanation(
            idea,
            sampleUserProfile,
            'entrepreneurial'
          );

          addCard(
            `${index + 1}. ${idea.title}`,
            personalizedDescription,
            '#8B7355' // Earth brown
          );
        });
      }

      // Action Plan Section
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
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-moss-50 to-earth-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sage-100/30 via-moss-100/30 to-earth-100/30"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sage-200/40 to-moss-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-earth-200/40 to-gold-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-moss-200/30 to-sage-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <ReportHeader
        onDownloadPDF={handleDownloadPDF}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* Report Metadata */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-sage-200">
            <div className="flex items-center justify-center gap-8">
              <Badge
                variant="secondary"
                className="gap-2 bg-gradient-to-r from-sage-100 to-moss-100 text-sage-800 px-4 py-2 text-sm font-semibold"
              >
                <span className="text-sage-600">Confidence:</span>
                <span className="font-bold">{report.confidence}</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-2 border-earth-300 text-earth-700 bg-earth-50 px-4 py-2 text-sm font-semibold"
              >
                <span className="text-earth-600">Tone:</span>
                <span className="font-bold">{report.tone}</span>
              </Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Career Constellation */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                emoji="🌟"
                title="Your Career Constellation"
                subtitle="Like Master Oogway once said, 'Yesterday is history, tomorrow is a mystery, but today is a gift.' These career paths align with your unique Ikigai - the intersection of what you love, what you're good at, what you can be paid for, and what the world needs."
              />
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {report.careers.map((career, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ReportCard
                    title={career.title}
                    rank={index + 1}
                    description={generatePersonalizedExplanation(
                      career,
                      sampleUserProfile,
                      'career'
                    )}
                    details={{
                      salary: career.salary || '$80,000 – $150,000',
                      growth: career.growth || 'High potential',
                    }}
                    nextSteps={
                      career.nextSteps || [
                        'Research the industry and job market',
                        'Build relevant skills and experience',
                        'Network with professionals in the field',
                      ]
                    }
                    color="sage"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Learning Journey */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionHeader
                emoji="📚"
                title="Your Learning Journey"
                subtitle="'The journey of a thousand miles begins with a single step.' These fields of study will help you develop the skills and knowledge needed to thrive in your chosen path. Each major is a stepping stone toward your Ikigai."
              />
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {report.majors.map((major, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ReportCard
                    title={major.title}
                    rank={index + 1}
                    description={generatePersonalizedExplanation(
                      major,
                      sampleUserProfile,
                      'major'
                    )}
                    details={{
                      duration: major.duration || '4 years',
                      universities: major.universities || ['Top Universities'],
                    }}
                    nextSteps={
                      major.nextSteps || [
                        'Research program requirements',
                        'Visit campuses and meet with advisors',
                        'Apply for scholarships and financial aid',
                      ]
                    }
                    color="moss"
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Innovation Garden */}
          {report.entrepreneurialIdeas &&
            report.entrepreneurialIdeas.length > 0 && (
              <section>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <SectionHeader
                    emoji="🚀"
                    title="Your Innovation Garden"
                    subtitle="'The best time to plant a tree was 20 years ago. The second best time is now.' These entrepreneurial ideas are seeds of possibility, waiting for your passion and dedication to help them bloom into something extraordinary."
                  />
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {report.entrepreneurialIdeas.map((idea, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ReportCard
                        title={idea.title}
                        rank={index + 1}
                        description={generatePersonalizedExplanation(
                          idea,
                          sampleUserProfile,
                          'entrepreneurial'
                        )}
                        nextSteps={
                          idea.nextSteps || [
                            'Research market opportunities',
                            'Develop a business plan',
                            'Build a prototype or MVP',
                          ]
                        }
                        color="earth"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          {/* Action Plan */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SectionHeader
                emoji="🎯"
                title="Your Action Plan"
                subtitle="'A journey of a thousand miles begins with a single step.' These are your first steps toward living your Ikigai. Start with one, then the next, and before you know it, you'll be walking the path of your dreams."
              />
            </motion.div>
            <ActionPlan steps={report.nextSteps} />
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
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm rounded-xl border-sage-200">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <NinjaStar size={60} />
                <div className="absolute inset-0 bg-gradient-to-r from-sage-400 to-moss-400 rounded-full blur-lg opacity-30"></div>
              </div>
            </div>
            <p className="text-earth-600 mb-4 font-sans text-lg">
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
