import jsPDF from 'jspdf';
import { AIReport } from './types';
import { StoryGenerator, StoryTheme } from './story-generator';

// Japanese-inspired font configuration
const FONTS = {
  primary: 'NotoSansJP', // Clean, modern Japanese font
  secondary: 'NotoSerifJP', // For body text
  accent: 'NotoSansJP', // For headers and accents
} as const;

// Color palette inspired by Japanese aesthetics
const COLORS = {
  primary: '#2C3E50', // Deep indigo
  secondary: '#34495E', // Slate blue
  accent: '#E74C3C', // Soft red
  sage: '#68A357', // Sage green
  moss: '#5B7A34', // Moss green
  earth: '#8B7355', // Earth brown
  gold: '#F39C12', // Warm gold
  light: '#F8F9FA', // Light background
  text: '#2C3E50', // Primary text
  textLight: '#6C757D', // Secondary text
  divider: '#E9ECEF', // Subtle dividers
} as const;

// Layout constants
const LAYOUT = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: 20,
  contentWidth: 170, // pageWidth - margin * 2
  lineHeight: 1.4,
  sectionSpacing: 15,
  cardSpacing: 10,
} as const;

export interface PDFGeneratorOptions {
  report: AIReport;
  userProfile?: {
    name?: string;
    email?: string;
  };
  storyTheme?: StoryTheme;
  storyGenerator?: StoryGenerator;
}

export class PDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private pageNumber: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = LAYOUT.margin;
    this.pageNumber = 1;
  }

  private checkPageBreak(requiredHeight: number): boolean {
    if (this.currentY + requiredHeight > LAYOUT.pageHeight - LAYOUT.margin) {
      this.pdf.addPage();
      this.currentY = LAYOUT.margin;
      this.pageNumber++;
      return true;
    }
    return false;
  }

  private addText(
    text: string,
    fontSize: number,
    options: {
      isBold?: boolean;
      color?: string;
      align?: 'left' | 'center' | 'right';
      maxWidth?: number;
    } = {}
  ): void {
    const {
      isBold = false,
      color = COLORS.text,
      align = 'left',
      maxWidth = LAYOUT.contentWidth,
    } = options;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    this.pdf.setTextColor(color);

    const lines = this.pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * LAYOUT.lineHeight;

    this.checkPageBreak(lines.length * lineHeight + 5);

    lines.forEach((line: string) => {
      let x = LAYOUT.margin;
      if (align === 'center') {
        x = LAYOUT.pageWidth / 2;
      } else if (align === 'right') {
        x = LAYOUT.pageWidth - LAYOUT.margin;
      }

      this.pdf.text(line, x, this.currentY);
      this.currentY += lineHeight;
    });

    this.currentY += 5;
  }

  private addSectionHeader(
    title: string,
    subtitle?: string,
    emoji?: string
  ): void {
    this.checkPageBreak(40);
    this.currentY += 10;

    // Add subtle divider line
    this.pdf.setDrawColor(COLORS.divider);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(
      LAYOUT.margin,
      this.currentY - 5,
      LAYOUT.pageWidth - LAYOUT.margin,
      this.currentY - 5
    );

    // Title with emoji
    const titleText = emoji ? `${emoji} ${title}` : title;
    this.addText(titleText, 18, {
      isBold: true,
      color: COLORS.primary,
      align: 'center',
    });

    // Subtitle
    if (subtitle) {
      this.addText(subtitle, 12, {
        color: COLORS.textLight,
        align: 'center',
      });
    }

    this.currentY += 10;
  }

  private addCard(
    title: string,
    content: string,
    options: {
      color?: string;
      icon?: string;
      details?: Record<string, string>;
    } = {}
  ): void {
    const { color = COLORS.sage, icon, details = {} } = options;

    // Calculate required height
    const titleLines = this.pdf.splitTextToSize(
      title,
      LAYOUT.contentWidth - 20
    );
    const contentLines = this.pdf.splitTextToSize(
      content,
      LAYOUT.contentWidth - 20
    );
    const detailsHeight = Object.keys(details).length * 8;
    const requiredHeight =
      titleLines.length * 14 + contentLines.length * 10 + detailsHeight + 20;

    this.checkPageBreak(requiredHeight);

    // Card background
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.setDrawColor(COLORS.divider);
    this.pdf.setLineWidth(0.5);
    this.pdf.roundedRect(
      LAYOUT.margin,
      this.currentY - 5,
      LAYOUT.contentWidth,
      requiredHeight,
      3,
      3,
      'FD'
    );

    // Icon and title
    if (icon) {
      this.pdf.setFontSize(16);
      this.pdf.text(icon, LAYOUT.margin + 10, this.currentY + 8);
    }

    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(color);
    this.pdf.text(
      titleLines,
      LAYOUT.margin + (icon ? 25 : 10),
      this.currentY + 8
    );
    this.currentY += titleLines.length * 14 + 5;

    // Content
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(COLORS.text);
    this.pdf.text(contentLines, LAYOUT.margin + 10, this.currentY);
    this.currentY += contentLines.length * 10 + 5;

    // Details
    if (Object.keys(details).length > 0) {
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(COLORS.textLight);

      Object.entries(details).forEach(([key, value]) => {
        this.pdf.text(`${key}: ${value}`, LAYOUT.margin + 10, this.currentY);
        this.currentY += 8;
      });
    }

    this.currentY += 10;
  }

  private addDivider(): void {
    this.checkPageBreak(10);
    this.pdf.setDrawColor(COLORS.divider);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(
      LAYOUT.margin,
      this.currentY,
      LAYOUT.pageWidth - LAYOUT.margin,
      this.currentY
    );
    this.currentY += 10;
  }

  private addQuote(text: string, author?: string): void {
    this.checkPageBreak(30);

    // Quote background
    this.pdf.setFillColor(COLORS.light);
    this.pdf.roundedRect(
      LAYOUT.margin,
      this.currentY - 5,
      LAYOUT.contentWidth,
      25,
      3,
      3,
      'F'
    );

    // Quote text
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(COLORS.text);
    this.pdf.text(`"${text}"`, LAYOUT.margin + 10, this.currentY + 8, {
      align: 'center',
      maxWidth: LAYOUT.contentWidth - 20,
    });

    // Author
    if (author) {
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(COLORS.textLight);
      this.pdf.text(`— ${author}`, LAYOUT.margin + 10, this.currentY + 15, {
        align: 'right',
      });
    }

    this.currentY += 25;
  }

  private addFooter(): void {
    const footerY = LAYOUT.pageHeight - 15;

    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(COLORS.textLight);

    // Page number
    this.pdf.text(
      `Page ${this.pageNumber}`,
      LAYOUT.pageWidth - LAYOUT.margin,
      footerY,
      {
        align: 'right',
      }
    );

    // App name
    this.pdf.text('Ikigai Finder', LAYOUT.margin, footerY);
  }

  public generatePDF(options: PDFGeneratorOptions): jsPDF {
    const { report, userProfile, storyTheme, storyGenerator } = options;

    // Title page
    this.addTitlePage(userProfile?.name, storyTheme);

    // Table of contents
    this.addTableOfContents();

    // Introduction with story
    this.addIntroduction(storyGenerator);

    // Career constellation
    this.addCareerSection(report.careers || [], storyGenerator);

    // Learning journey
    this.addLearningSection(report.majors || [], storyGenerator);

    // Innovation garden
    if (report.entrepreneurialIdeas && report.entrepreneurialIdeas.length > 0) {
      this.addInnovationSection(report.entrepreneurialIdeas, storyGenerator);
    }

    // Action plan
    this.addActionPlanSection(report.nextSteps || [], storyGenerator);

    // Closing reflection
    this.addClosingReflection(storyGenerator);

    // Add footer to all pages
    for (let i = 1; i <= this.pageNumber; i++) {
      this.pdf.setPage(i);
      this.addFooter();
    }

    return this.pdf;
  }

  private addTitlePage(userName?: string, storyTheme?: StoryTheme): void {
    // Background gradient effect
    this.pdf.setFillColor(COLORS.sage);
    this.pdf.rect(0, 0, LAYOUT.pageWidth, 80, 'F');

    // Main title
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text('Your Ikigai Journey', LAYOUT.pageWidth / 2, 40, {
      align: 'center',
    });

    // Subtitle
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(
      'A Personal Guide to Purpose and Fulfillment',
      LAYOUT.pageWidth / 2,
      55,
      {
        align: 'center',
      }
    );

    // User name if available
    if (userName) {
      this.pdf.setFontSize(14);
      this.pdf.text(`Prepared for ${userName}`, LAYOUT.pageWidth / 2, 70, {
        align: 'center',
      });
    }

    this.currentY = 100;

    // Story theme introduction
    if (storyTheme) {
      this.addText(
        `In the tradition of the ${storyTheme.name.toLowerCase()}, your journey begins...`,
        12,
        {
          align: 'center',
          color: COLORS.textLight,
        }
      );
      this.currentY += 10;
    }

    // Inspirational quote
    this.addQuote(
      'The journey of a thousand miles begins with a single step',
      'Lao Tzu'
    );

    this.currentY += 20;
  }

  private addTableOfContents(): void {
    this.addSectionHeader('Table of Contents', undefined, '📋');

    const sections = [
      'Introduction & Your Story',
      'Career Constellation',
      'Learning Journey',
      'Innovation Garden',
      'Action Plan',
      'Closing Reflection',
    ];

    sections.forEach((section, index) => {
      this.addText(`${index + 1}. ${section}`, 12, {
        color: COLORS.textLight,
      });
    });

    this.addDivider();
  }

  private addIntroduction(storyGenerator?: StoryGenerator): void {
    this.addSectionHeader(
      'Your Story Begins',
      'Every journey starts with a single step',
      '🌟'
    );

    // Use dynamic storytelling if available
    if (storyGenerator) {
      const openingNarrative =
        storyGenerator.generatePersonalizedNarrative('opening');
      this.addText(openingNarrative, 12);
    } else {
      // Fallback to generic text
      this.addText(
        "In the ancient traditions of wisdom, every seeker embarks on a unique path. Your Ikigai journey is no different—it's a personal quest to discover where your passions, skills, values, and the world's needs intersect.",
        12
      );
    }

    this.addQuote(
      'The way to get started is to quit talking and begin doing',
      'Walt Disney'
    );

    this.addDivider();
  }

  private addCareerSection(
    careers: any[],
    storyGenerator?: StoryGenerator
  ): void {
    this.addSectionHeader(
      'Your Career Constellation',
      'Paths that align with your unique Ikigai',
      '🌟'
    );

    // Add story narrative for career section
    if (storyGenerator) {
      const careerNarrative =
        storyGenerator.generatePersonalizedNarrative('career');
      this.addText(careerNarrative, 12);
      this.currentY += 5;
    }

    careers.forEach((career, index) => {
      this.addCard(
        `${index + 1}. ${career.title}`,
        career.description || 'A career path that aligns with your Ikigai',
        {
          color: COLORS.sage,
          icon: '💼',
          details: {
            'Salary Range': career.salary || 'To be determined',
            'Growth Potential': career.growth || 'High potential',
          },
        }
      );
    });

    this.addDivider();
  }

  private addLearningSection(
    majors: any[],
    storyGenerator?: StoryGenerator
  ): void {
    this.addSectionHeader(
      'Your Learning Journey',
      'Fields of study to develop your skills',
      '📚'
    );

    // Add story narrative for learning section
    if (storyGenerator) {
      const learningNarrative =
        storyGenerator.generatePersonalizedNarrative('learning');
      this.addText(learningNarrative, 12);
      this.currentY += 5;
    }

    majors.forEach((major, index) => {
      this.addCard(
        `${index + 1}. ${major.title}`,
        major.description || 'A field of study that supports your Ikigai',
        {
          color: COLORS.moss,
          icon: '🎓',
          details: {
            Duration: major.duration || '4 years',
            Universities:
              major.universities?.join(', ') || 'Various options available',
          },
        }
      );
    });

    this.addDivider();
  }

  private addInnovationSection(
    ideas: any[],
    storyGenerator?: StoryGenerator
  ): void {
    this.addSectionHeader(
      'Your Innovation Garden',
      'Entrepreneurial seeds of possibility',
      '🚀'
    );

    // Add story narrative for innovation section
    if (storyGenerator) {
      const innovationNarrative =
        storyGenerator.generatePersonalizedNarrative('innovation');
      this.addText(innovationNarrative, 12);
      this.currentY += 5;
    }

    ideas.forEach((idea, index) => {
      this.addCard(
        `${index + 1}. ${idea.title}`,
        idea.description ||
          'An entrepreneurial opportunity aligned with your Ikigai',
        {
          color: COLORS.earth,
          icon: '💡',
          details: {
            'Target Market': idea.market || 'To be defined',
            Investment: idea.investment || 'To be determined',
          },
        }
      );
    });

    this.addDivider();
  }

  private addActionPlanSection(
    steps: string[],
    storyGenerator?: StoryGenerator
  ): void {
    this.addSectionHeader(
      'Your Action Plan',
      'First steps toward your Ikigai',
      '🎯'
    );

    // Add story narrative for action section
    if (storyGenerator) {
      const actionNarrative =
        storyGenerator.generatePersonalizedNarrative('action');
      this.addText(actionNarrative, 12);
      this.currentY += 5;
    }

    steps.forEach((step, index) => {
      this.addCard(`Step ${index + 1}`, step, {
        color: COLORS.gold,
        icon: '✓',
      });
    });

    this.addDivider();
  }

  private addClosingReflection(storyGenerator?: StoryGenerator): void {
    this.addSectionHeader(
      'Your Journey Continues',
      'The path ahead is yours to walk',
      '🌅'
    );

    // Use dynamic storytelling for closing if available
    if (storyGenerator) {
      const closingNarrative =
        storyGenerator.generatePersonalizedNarrative('closing');
      this.addText(closingNarrative, 12);
    } else {
      // Fallback to generic text
      this.addText(
        'Remember, your Ikigai is not a destination but a journey. It evolves as you grow, learn, and discover new aspects of yourself. This report is merely a map—the actual journey is yours to take.',
        12
      );
    }

    this.addQuote(
      'The only impossible journey is the one you never begin',
      'Tony Robbins'
    );

    this.addText(
      'May your path be filled with purpose, joy, and the satisfaction of living authentically. Your Ikigai awaits.',
      12,
      {
        align: 'center',
        color: COLORS.sage,
        isBold: true,
      }
    );
  }
}

export function generateAestheticPDF(options: PDFGeneratorOptions): jsPDF {
  const generator = new PDFGenerator();
  return generator.generatePDF(options);
}
