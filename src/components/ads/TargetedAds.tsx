'use client';

// MONETIZATION COMPONENTS COMMENTED OUT
// import { AIReport } from '@/lib/types';
// import GoogleAdSense from './GoogleAdSense';
// import AffiliateBanner from './AffiliateBanner';

// interface TargetedAdsProps {
//   report: AIReport;
//   className?: string;
// }

export default function TargetedAds({ report, className = '' }: any) {
  // MONETIZATION COMPONENTS COMMENTED OUT - RETURN EMPTY DIV
  return <div className={className}></div>;
  
  /* COMMENTED OUT - ORIGINAL MONETIZATION CODE
  // Extract keywords from the report for targeted ads
  const extractKeywords = (report: AIReport) => {
    const keywords = new Set<string>();
    
    // Extract from careers
    report.careers?.forEach(career => {
      keywords.add(career.title.toLowerCase());
      keywords.add(career.description.toLowerCase());
    });

    // Extract from majors
    report.majors?.forEach(major => {
      keywords.add(major.title.toLowerCase());
      keywords.add(major.description.toLowerCase());
    });

    // Extract from entrepreneurial ideas
    report.entrepreneurialIdeas?.forEach(idea => {
      keywords.add(idea.title.toLowerCase());
      keywords.add(idea.description.toLowerCase());
    });

    return Array.from(keywords).join(' ');
  };

  const keywords = extractKeywords(report);

  // Determine ad categories based on report content
  const getAdCategories = () => {
    const categories = new Set<string>();
    
    if (report.careers?.some(c => c.title.toLowerCase().includes('tech') || c.title.toLowerCase().includes('developer'))) {
      categories.add('tech');
    }
    if (report.careers?.some(c => c.title.toLowerCase().includes('business') || c.title.toLowerCase().includes('entrepreneur'))) {
      categories.add('business');
    }
    if (report.careers?.some(c => c.title.toLowerCase().includes('design') || c.title.toLowerCase().includes('creative'))) {
      categories.add('design');
    }
    if (report.careers?.some(c => c.title.toLowerCase().includes('marketing') || c.title.toLowerCase().includes('sales'))) {
      categories.add('marketing');
    }

    return Array.from(categories);
  };

  const adCategories = getAdCategories();

  // Sample affiliate products based on categories
  const getAffiliateProducts = () => {
    const products = [];

    if (adCategories.includes('tech')) {
      products.push({
        title: "Complete Web Development Bootcamp 2024",
        description: "Master HTML, CSS, JavaScript, React, Node.js and more. Build real projects and get hired.",
        image: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=💻",
        price: "$89.99",
        originalPrice: "$199.99",
        rating: 4.7,
        students: 1250000,
        duration: "65 hours",
        affiliateUrl: "https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=IKIGAI2024",
        category: 'course' as const
      });
    }

    if (adCategories.includes('business')) {
      products.push({
        title: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation",
        description: "The definitive guide to building successful startups and launching new products.",
        image: "https://via.placeholder.com/100x100/10B981/FFFFFF?text=📚",
        price: "$12.99",
        originalPrice: "$18.99",
        rating: 4.5,
        students: 500000,
        duration: "8 hours",
        affiliateUrl: "https://amzn.to/3xyz123",
        category: 'book' as const
      });
    }

    if (adCategories.includes('design')) {
      products.push({
        title: "Adobe Creative Cloud All Apps",
        description: "Professional design tools including Photoshop, Illustrator, InDesign, and more.",
        image: "https://via.placeholder.com/100x100/EC4899/FFFFFF?text=🎨",
        price: "$52.99/month",
        originalPrice: "$79.99/month",
        rating: 4.6,
        students: 2000000,
        duration: "Ongoing",
        affiliateUrl: "https://adobe.com/creativecloud/plans.html?promoid=IKIGAI2024",
        category: 'tool' as const
      });
    }

    if (adCategories.includes('marketing')) {
      products.push({
        title: "Digital Marketing Masterclass",
        description: "Learn SEO, social media marketing, email marketing, and Google Ads from industry experts.",
        image: "https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=📈",
        price: "$149.99",
        originalPrice: "$299.99",
        rating: 4.8,
        students: 750000,
        duration: "40 hours",
        affiliateUrl: "https://www.coursera.org/specializations/digital-marketing?coupon=IKIGAI2024",
        category: 'course' as const
      });
    }

    // Always include a general career development product
    products.push({
      title: "Ikigai: The Japanese Secret to a Long and Happy Life",
      description: "Discover your purpose and find fulfillment in your work and personal life.",
      image: "https://via.placeholder.com/100x100/8B5CF6/FFFFFF?text=🌸",
      price: "$13.99",
      originalPrice: "$18.99",
      rating: 4.4,
      students: 150000,
      duration: "6 hours",
      affiliateUrl: "https://amzn.to/3abc456",
      category: 'book' as const
    });

    return products.slice(0, 3); // Show max 3 products
  };

  const affiliateProducts = getAffiliateProducts();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Google AdSense Banner */}
      <div className="text-center">
        <GoogleAdSense
          slot="1234567890" // Replace with your actual ad slot
          style={{ display: 'block', width: '100%', height: '250px' }}
          format="auto"
          responsive={true}
          className="rounded-lg overflow-hidden"
        />
      </div>

      {/* Affiliate Products */}
      {affiliateProducts.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🎯 Recommended for Your Journey
            </h3>
            <p className="text-gray-600 text-sm">
              Based on your Ikigai analysis, these resources can help you achieve your goals
            </p>
          </div>
          
          <div className="space-y-3">
            {affiliateProducts.map((product, index) => (
              <AffiliateBanner
                key={index}
                {...product}
              />
            ))}
          </div>
        </div>
      )}

      {/* Google AdSense In-Article */}
      <div className="text-center">
        <GoogleAdSense
          slot="0987654321" // Replace with your actual ad slot
          style={{ display: 'block', width: '100%', height: '200px' }}
          format="auto"
          responsive={true}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
  */
}
