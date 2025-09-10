// Utility functions for generating personalized explanations

export interface UserProfile {
  strengths: string[];
  interests: string[];
  workStyle: string[];
  goals: string[];
  values: string[];
}

export function generatePersonalizedExplanation(
  item: { title: string; description: string },
  profile: UserProfile,
  type: 'career' | 'major' | 'entrepreneurial'
): string {
  const { title, description } = item;

  // Extract key traits from the user profile
  const topStrengths = profile.strengths.slice(0, 2);
  const topInterests = profile.interests.slice(0, 2);
  const workStyle = profile.workStyle[0] || 'collaborative';
  const primaryGoal = profile.goals[0] || 'professional growth';

  // Generate personalized explanations based on type
  switch (type) {
    case 'career':
      return generateCareerExplanation(
        title,
        topStrengths,
        topInterests,
        workStyle,
        primaryGoal
      );
    case 'major':
      return generateMajorExplanation(
        title,
        topStrengths,
        topInterests,
        primaryGoal
      );
    case 'entrepreneurial':
      return generateEntrepreneurialExplanation(
        title,
        topStrengths,
        topInterests,
        profile.values
      );
    default:
      return description;
  }
}

function generateCareerExplanation(
  title: string,
  strengths: string[],
  interests: string[],
  workStyle: string,
  goal: string
): string {
  const strengthText =
    strengths.length > 0 ? strengths.join(' and ') : 'your unique abilities';
  const interestText =
    interests.length > 0 ? interests.join(' and ') : 'your passions';

  return `You excel in ${strengthText} and have a strong interest in ${interestText}. This career path aligns perfectly with your ${workStyle} work style and your goal of ${goal}. The ${title} field offers the challenge and growth opportunities you're seeking while allowing you to make a meaningful impact.`;
}

function generateMajorExplanation(
  title: string,
  strengths: string[],
  interests: string[],
  goal: string
): string {
  const strengthText =
    strengths.length > 0
      ? strengths.join(' and ')
      : 'your analytical abilities';
  const interestText =
    interests.length > 0 ? interests.join(' and ') : 'your academic interests';

  return `This field of study builds on your strengths in ${strengthText} and aligns with your interest in ${interestText}. A ${title} education will provide you with the foundational knowledge and skills needed to achieve your goal of ${goal} while opening doors to diverse career opportunities.`;
}

function generateEntrepreneurialExplanation(
  title: string,
  strengths: string[],
  interests: string[],
  values: string[]
): string {
  const strengthText =
    strengths.length > 0 ? strengths.join(' and ') : 'your innovative thinking';
  const interestText =
    interests.length > 0
      ? interests.join(' and ')
      : 'your entrepreneurial spirit';
  const valueText = values.length > 0 ? values[0] : 'making a positive impact';

  return `This entrepreneurial opportunity leverages your strengths in ${strengthText} and your passion for ${interestText}. The ${title} concept aligns with your core value of ${valueText} and offers a unique way to create meaningful change while building something of your own.`;
}

// Sample data for demonstration
export const sampleUserProfile: UserProfile = {
  strengths: ['analytical thinking', 'leadership', 'problem-solving'],
  interests: ['technology', 'finance', 'innovation'],
  workStyle: ['collaborative', 'results-driven'],
  goals: ['professional growth', 'financial independence'],
  values: ['integrity', 'innovation', 'social impact'],
};

// Generate sample personalized data
export function generateSampleReportData() {
  const careers = [
    {
      title: 'Investment Banking',
      description: 'Financial advisory and capital raising services',
      salary: '$100,000 – $250,000',
      growth: 'High potential, high risk',
      nextSteps: [
        'Obtain a degree in finance or economics',
        'Gain internship experience in banking or consulting',
        'Prepare for the CFA exam',
      ],
    },
    {
      title: 'Product Management',
      description: 'Leading product development and strategy',
      salary: '$90,000 – $180,000',
      growth: 'High growth, moderate risk',
      nextSteps: [
        'Develop technical and business acumen',
        'Build experience in user research and data analysis',
        'Network with product professionals',
      ],
    },
    {
      title: 'Data Science',
      description: 'Extracting insights from complex datasets',
      salary: '$85,000 – $160,000',
      growth: 'Very high growth, low risk',
      nextSteps: [
        'Master programming languages like Python and R',
        'Build a portfolio of data science projects',
        'Pursue advanced degrees or certifications',
      ],
    },
  ];

  const majors = [
    {
      title: 'Finance',
      description: 'Financial markets, investments, and corporate finance',
      duration: '4 years',
      universities: ['Wharton', 'Stern', 'Booth'],
      nextSteps: [
        'Focus on quantitative coursework',
        'Join finance clubs and competitions',
        'Seek summer internships in finance',
      ],
    },
    {
      title: 'Computer Science',
      description: 'Programming, algorithms, and software development',
      duration: '4 years',
      universities: ['MIT', 'Stanford', 'Carnegie Mellon'],
      nextSteps: [
        'Build a strong foundation in mathematics',
        'Complete coding bootcamps or online courses',
        'Contribute to open-source projects',
      ],
    },
    {
      title: 'Business Administration',
      description: 'Management, strategy, and organizational behavior',
      duration: '4 years',
      universities: ['Harvard', 'Kellogg', 'Tuck'],
      nextSteps: [
        'Develop leadership skills through student organizations',
        'Take courses in entrepreneurship and innovation',
        'Gain practical experience through internships',
      ],
    },
  ];

  const entrepreneurialIdeas = [
    {
      title: 'Financial Technology Startup',
      description: 'Innovative solutions for personal finance management',
      nextSteps: [
        'Research market gaps in fintech',
        'Develop a minimum viable product',
        'Network with potential investors and advisors',
      ],
    },
    {
      title: 'Data Analytics Consulting',
      description: 'Helping businesses make data-driven decisions',
      nextSteps: [
        'Identify target industries and clients',
        'Build expertise in specific analytics tools',
        'Create case studies and testimonials',
      ],
    },
  ];

  return {
    careers: careers.map(career => ({
      ...career,
      personalizedDescription: generatePersonalizedExplanation(
        career,
        sampleUserProfile,
        'career'
      ),
    })),
    majors: majors.map(major => ({
      ...major,
      personalizedDescription: generatePersonalizedExplanation(
        major,
        sampleUserProfile,
        'major'
      ),
    })),
    entrepreneurialIdeas: entrepreneurialIdeas.map(idea => ({
      ...idea,
      personalizedDescription: generatePersonalizedExplanation(
        idea,
        sampleUserProfile,
        'entrepreneurial'
      ),
    })),
  };
}
