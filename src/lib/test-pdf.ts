import { generateAestheticPDF } from './pdf-generator';
import { generateStoryForReport } from './story-generator';
import { AIReport } from './types';

// Test data for PDF generation
const testReport: AIReport = {
  careers: [
    {
      title: "Software Developer",
      description: "Create and maintain software applications that solve real-world problems",
      steps: ["Learn programming languages", "Build projects", "Get certified"],
      salary: "$60,000 - $120,000",
      growth: "High demand field with 22% projected growth"
    },
    {
      title: "Data Analyst", 
      description: "Analyze data to help organizations make informed decisions",
      steps: ["Learn SQL and Python", "Master data visualization", "Get industry experience"],
      salary: "$50,000 - $90,000",
      growth: "Growing field with 25% projected growth"
    }
  ],
  majors: [
    {
      title: "Computer Science",
      description: "Study of computational systems and programming",
      universities: ["MIT", "Stanford", "Local universities"],
      duration: "4 years",
      prerequisites: ["High school math", "Basic programming knowledge"]
    },
    {
      title: "Data Science",
      description: "Interdisciplinary field combining statistics and computer science", 
      universities: ["Carnegie Mellon", "UC Berkeley", "Online programs"],
      duration: "4 years",
      prerequisites: ["Calculus", "Statistics", "Programming"]
    }
  ],
  entrepreneurialIdeas: [
    {
      title: "SaaS Application",
      description: "Build a software-as-a-service product for small businesses",
      market: "Small to medium businesses",
      steps: ["Identify problem", "Build MVP", "Get customers"],
      investment: "$5,000 - $20,000"
    }
  ],
  nextSteps: [
    "Research career options that interest you",
    "Take online courses to develop new skills", 
    "Network with professionals in your field of interest",
    "Start building projects to gain experience"
  ],
  confidence: "High",
  tone: "Encouraging"
};

export function testPDFGeneration() {
  try {
    console.log('Testing PDF generation...');
    
    // Generate story for the test report
    const storyGenerator = generateStoryForReport(testReport, {
      name: 'Test User',
      email: 'test@example.com'
    });
    
    // Generate the PDF
    const pdf = generateAestheticPDF({
      report: testReport,
      userProfile: {
        name: 'Test User',
        email: 'test@example.com'
      },
      storyGenerator
    });
    
    console.log('PDF generated successfully!');
    return pdf;
  } catch (error) {
    console.error('PDF generation test failed:', error);
    throw error;
  }
}

// Export for testing
export { testReport };
