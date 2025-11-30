'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Home } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';
import LoadingScreen from '@/components/ui/loading-screen';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { generateAestheticPDF } from '@/lib/pdf-generator';
import { generateStoryForReport } from '@/lib/story-generator';

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
      if (!report) {
        throw new Error('No report data available');
      }

      // Generate dynamic story for this report
      const storyGenerator = generateStoryForReport(report, {
        name: sampleUserProfile.name,
        email: sampleUserProfile.email,
      });

      // Generate the aesthetic PDF with storytelling
      const pdf = generateAestheticPDF({
        report,
        userProfile: {
          name: sampleUserProfile.name,
          email: sampleUserProfile.email,
        },
        storyGenerator,
      });

      // Download the PDF
      pdf.save('ikigai-career-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your report..." />;
  }

  if (error || !report) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
          <BackgroundBlobs />

          {/* Home Button - Top Left */}
          <div className="relative z-10 p-4 sm:p-6">
            <a href="/">
              <Button
                variant="ghost"
                className="gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </a>
          </div>

          <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 -mt-20">
            <Card className="p-6 sm:p-8 text-center bg-white max-w-md shadow-md">
              <div className="text-red-500 mb-4">
                <svg
                  className="h-10 w-10 sm:h-12 sm:w-12 mx-auto"
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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Report Not Found
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {error || 'The requested report could not be found.'}
              </p>
              <a href="/">
                <Button className="w-full sm:w-auto">Back to Home</Button>
              </a>
            </Card>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-moss-50 to-earth-50 relative overflow-hidden">
        {/* Static Background - No blur or animations to prevent GPU overload */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sage-100/30 via-moss-100/30 to-earth-100/30"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sage-200/40 to-moss-200/40 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-earth-200/40 to-gold-200/40 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-moss-200/30 to-sage-200/30 rounded-full"></div>
        </div>

        {/* Header */}
        <ReportHeader
          onDownloadPDF={handleDownloadPDF}
          isGeneratingPDF={isGeneratingPDF}
        />

        {/* Report Metadata */}
        <div className="relative z-10 px-4 sm:px-6 mb-6 sm:mb-8">
          <div className="max-w-7xl mx-auto">
            <Card className="p-4 sm:p-6 bg-white rounded-xl border-sage-200 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <Badge
                  variant="secondary"
                  className="gap-2 bg-gradient-to-r from-sage-100 to-moss-100 text-sage-800 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold"
                >
                  <span className="text-sage-600">Confidence:</span>
                  <span className="font-bold">
                    {report.confidence || 'N/A'}
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="border-2 border-earth-300 text-earth-700 bg-earth-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold"
                >
                  <span className="text-earth-600">Tone:</span>
                  <span className="font-bold">{report.tone || 'N/A'}</span>
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Content */}
        <div
          id="report-content"
          className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6"
        >
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
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
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(report.careers || []).map((career, index) => (
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
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(report.majors || []).map((major, index) => (
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
                        universities: major.universities || [
                          'Top Universities',
                        ],
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
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {(report.entrepreneurialIdeas || []).map((idea, index) => (
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
              <ActionPlan steps={report.nextSteps || []} />
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
            <Card className="p-6 sm:p-8 text-center bg-white rounded-xl border-sage-200 shadow-md">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <NinjaStar size={50} className="sm:w-16 sm:h-16" animated={false} />
                </div>
              </div>
              <p className="text-earth-600 mb-3 sm:mb-4 font-sans text-base sm:text-lg">
                This report was generated using AI based on your Ikigai board
                and quiz responses.
              </p>
              <p className="text-xs sm:text-sm text-earth-500 font-sans">
                Remember: Your journey is unique. Use this as a starting point,
                not a destination.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
