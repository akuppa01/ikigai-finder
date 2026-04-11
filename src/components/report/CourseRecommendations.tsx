'use client';

import { ExternalLink, Clock, BookOpen } from 'lucide-react';

interface Course {
  title: string;
  provider: 'Coursera' | 'edX' | 'Udemy' | 'LinkedIn Learning' | 'Codecademy';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  href: string;
}

interface CourseRecommendationsProps {
  careerTitle: string;
  index?: number;
}

// Curated course recommendations by domain keyword
// href fields are placeholders — replace with affiliate links
function getCoursesForCareer(title: string): Course[] {
  const t = title.toLowerCase();

  if (
    t.includes('software') || t.includes('developer') ||
    t.includes('engineer') || t.includes('programming') ||
    t.includes('web') || t.includes('full stack') || t.includes('backend') || t.includes('frontend')
  ) {
    return [
      { title: 'Meta Front-End Developer Certificate', provider: 'Coursera', duration: '7 months', level: 'Beginner', href: '#' },
      { title: 'IBM Full Stack Software Developer', provider: 'Coursera', duration: '12 months', level: 'Intermediate', href: '#' },
      { title: 'The Web Developer Bootcamp', provider: 'Udemy', duration: '60 hours', level: 'Beginner', href: '#' },
    ];
  }

  if (
    t.includes('data') || t.includes('analyst') || t.includes('analytics') ||
    t.includes('machine learning') || t.includes('ai') || t.includes('scientist')
  ) {
    return [
      { title: 'Google Data Analytics Certificate', provider: 'Coursera', duration: '6 months', level: 'Beginner', href: '#' },
      { title: 'IBM Data Science Professional Certificate', provider: 'Coursera', duration: '11 months', level: 'Beginner', href: '#' },
      { title: 'Machine Learning Specialization', provider: 'Coursera', duration: '3 months', level: 'Intermediate', href: '#' },
    ];
  }

  if (
    t.includes('design') || t.includes('ux') || t.includes('ui') ||
    t.includes('product design') || t.includes('graphic')
  ) {
    return [
      { title: 'Google UX Design Certificate', provider: 'Coursera', duration: '6 months', level: 'Beginner', href: '#' },
      { title: 'UI/UX Design Bootcamp', provider: 'Udemy', duration: '30 hours', level: 'Beginner', href: '#' },
      { title: 'Interaction Design Specialization', provider: 'Coursera', duration: '8 months', level: 'Intermediate', href: '#' },
    ];
  }

  if (
    t.includes('business') || t.includes('management') ||
    t.includes('entrepreneur') || t.includes('startup') || t.includes('consultant')
  ) {
    return [
      { title: 'Business Foundations Specialization', provider: 'Coursera', duration: '5 months', level: 'Beginner', href: '#' },
      { title: 'Digital Marketing & E-commerce Certificate', provider: 'Coursera', duration: '6 months', level: 'Beginner', href: '#' },
      { title: 'Entrepreneurship Specialization', provider: 'Coursera', duration: '5 months', level: 'Intermediate', href: '#' },
    ];
  }

  if (
    t.includes('health') || t.includes('medicine') || t.includes('nursing') ||
    t.includes('therapy') || t.includes('psychology') || t.includes('mental')
  ) {
    return [
      { title: 'Science of Well-Being', provider: 'Coursera', duration: '10 weeks', level: 'Beginner', href: '#' },
      { title: 'Healthcare Organization Essentials', provider: 'edX', duration: '8 weeks', level: 'Beginner', href: '#' },
      { title: 'Psychological First Aid', provider: 'Coursera', duration: '6 hours', level: 'Beginner', href: '#' },
    ];
  }

  if (
    t.includes('teacher') || t.includes('education') || t.includes('coach') ||
    t.includes('instructor') || t.includes('train')
  ) {
    return [
      { title: 'Learning How to Learn', provider: 'Coursera', duration: '4 weeks', level: 'Beginner', href: '#' },
      { title: 'Instructional Design Masterclass', provider: 'Udemy', duration: '20 hours', level: 'Intermediate', href: '#' },
      { title: 'Teaching as a Foreign Language Certificate', provider: 'Coursera', duration: '3 months', level: 'Beginner', href: '#' },
    ];
  }

  if (
    t.includes('finance') || t.includes('account') || t.includes('invest') ||
    t.includes('banking') || t.includes('economics')
  ) {
    return [
      { title: 'Financial Markets by Yale', provider: 'Coursera', duration: '7 weeks', level: 'Beginner', href: '#' },
      { title: 'Investment Management Specialization', provider: 'Coursera', duration: '7 months', level: 'Intermediate', href: '#' },
      { title: 'Financial Analysis & Decision Making', provider: 'edX', duration: '6 weeks', level: 'Intermediate', href: '#' },
    ];
  }

  if (
    t.includes('marketing') || t.includes('brand') || t.includes('content') ||
    t.includes('social media') || t.includes('seo')
  ) {
    return [
      { title: 'Google Digital Marketing Certificate', provider: 'Coursera', duration: '6 months', level: 'Beginner', href: '#' },
      { title: 'Social Media Marketing Specialization', provider: 'Coursera', duration: '7 months', level: 'Beginner', href: '#' },
      { title: 'Content Strategy for Professionals', provider: 'Coursera', duration: '8 weeks', level: 'Intermediate', href: '#' },
    ];
  }

  // Default — broadly applicable
  return [
    { title: 'Project Management Professional Certificate', provider: 'Coursera', duration: '6 months', level: 'Beginner', href: '#' },
    { title: 'Critical Thinking & Problem Solving', provider: 'edX', duration: '6 weeks', level: 'Beginner', href: '#' },
    { title: 'Communication Skills for Professionals', provider: 'Coursera', duration: '4 months', level: 'Beginner', href: '#' },
  ];
}

const providerColors: Record<Course['provider'], string> = {
  'Coursera': 'text-[#0056D2]',
  'edX': '#000000',
  'Udemy': 'text-[#A435F0]',
  'LinkedIn Learning': 'text-[#0A66C2]',
  'Codecademy': 'text-[#1F4056]',
};

const levelColors: Record<Course['level'], string> = {
  'Beginner': 'bg-[#2D6A4F]/10 text-[#2D6A4F]',
  'Intermediate': 'bg-bronze-50 text-bronze-700',
  'Advanced': 'bg-crimson-50 text-crimson-700',
};

export default function CourseRecommendations({ careerTitle }: CourseRecommendationsProps) {
  const courses = getCoursesForCareer(careerTitle);

  return (
    <div className="mt-6 pt-5 border-t border-ink-100">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-3 w-3 text-ink-400" />
        <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400 font-sans">
          Recommended Courses
        </p>
      </div>

      <div className="space-y-3">
        {courses.map((course, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 p-3 bg-parchment-100 hover:bg-parchment-200 transition-colors duration-150 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans text-ink-800 leading-snug mb-1.5 group-hover:text-ink-900">
                {course.title}
              </p>
              <div className="flex items-center flex-wrap gap-2">
                <span className={`text-[10px] font-semibold ${providerColors[course.provider] || 'text-ink-500'}`}>
                  {course.provider}
                </span>
                <span className="text-ink-200">·</span>
                <span className="flex items-center gap-1 text-[10px] text-ink-400">
                  <Clock className="h-2.5 w-2.5" />
                  {course.duration}
                </span>
                <span className={`text-[9px] tracking-wide px-1.5 py-0.5 rounded-sm ${levelColors[course.level]}`}>
                  {course.level}
                </span>
              </div>
            </div>
            <a
              href={course.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-crimson-600 hover:text-crimson-800 font-sans transition-colors duration-150 pt-0.5"
            >
              Enroll
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-ink-300 mt-3 leading-relaxed">
        * Course links are for reference. We may earn a small commission if you enroll through these links.
      </p>
    </div>
  );
}
