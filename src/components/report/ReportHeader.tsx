'use client';

import { Button } from '@/components/ui/button';
import { Home, Download } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ReportHeaderProps {
  onDownloadPDF: () => void;
  isGeneratingPDF: boolean;
}

export default function ReportHeader({
  onDownloadPDF,
  isGeneratingPDF,
}: ReportHeaderProps) {
  return (
    <div className="relative z-10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="/">
            <Button
              variant="ghost"
              className="gap-2 text-sage-700 hover:text-sage-800 hover:bg-sage-50 backdrop-blur-sm border border-sage-200"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </a>

          <Button
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className="gap-2 bg-gradient-to-r from-sage-500 to-moss-500 hover:from-sage-600 hover:to-moss-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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

        {/* Report Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-sage-800 mb-4 font-serif">
            Your Ikigai Career Report
          </h1>
          <p className="text-xl text-earth-600 font-sans">
            Discover your path to purpose and fulfillment
          </p>
        </div>
      </div>
    </div>
  );
}
