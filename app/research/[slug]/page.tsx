// app/research/[slug]/page.tsx - COMPLETE UPDATED VERSION
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import ResearchSchema from '@/app/components/seo/ResearchSchema';
import Icon from '@/app/components/Icon';

// Updated interface with structured fields
interface Opportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  original_description: string;
  source: string;
  referral_link: string;
  website_name: string;
  reward: string | null;
  time_estimate: string | null;
  category: string | null;
  eligibility: string[] | null;
  page_slug: string;
  created_at: string;
  page_generated: boolean;
  // STRUCTURED FIELDS
  country_code?: string;
  compensation_amount?: number;
  compensation_currency?: string;
}

// =============================
// UPDATED: Fetch More Fields for Metadata
// =============================
const getSurveyMetadata = async (slug: string) => {
  return unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching metadata for survey: ${slug}`);
      
      const { data: opportunity } = await supabase
        .from('opportunities')
        .select('title, description, reward, time_estimate, category, created_at')
        .eq('page_slug', slug)
        .eq('type', 'survey')
        .eq('page_generated', true)
        .single();

      return opportunity;
    },
    ['survey-metadata', slug],
    {
      tags: ['opportunities', 'opportunities-surveys', `survey-${slug}`],
      revalidate: false,
    }
  )();
};

// =============================
// Cached function for survey details - UPDATED to fetch structured fields
// =============================
const getSurveyBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching FRESH survey: ${slug}`);
      
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          country_code,
          compensation_amount,
          compensation_currency
        `)
        .eq('page_slug', slug)
        .eq('type', 'survey')
        .eq('page_generated', true)
        .single();

      if (error || !data) {
        console.error('❌ Survey not found:', slug, error);
        return null;
      }

      return data as Opportunity;
    },
    ['survey-detail', slug],
    {
      tags: ['opportunities', 'opportunities-surveys'],
      revalidate: false,
    }
  )();
};

// =============================
// COMPLETELY REWRITTEN: Optimized Metadata Generation
// =============================
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const opportunity = await getSurveyMetadata(slug);

  if (!opportunity) {
    return {
      title: 'Research Opportunity Not Found | TalentVaults',
      description: 'This research opportunity could not be found.',
      robots: { index: false, follow: false }, // Don't index 404s
    };
  }

  // ✅ OPTIMIZED TITLE (< 60 characters for Google)
  const rewardText = opportunity.reward ? `Earn ${opportunity.reward}` : 'High Compensation';
  const timeText = opportunity.time_estimate ? ` • ${opportunity.time_estimate}` : '';
  const categoryText = opportunity.category ? ` • ${opportunity.category}` : '';
  
  let seoTitle = `${opportunity.title} - ${rewardText}${timeText}${categoryText} | TalentVaults`;
  
  // Ensure title is under 60 chars
  if (seoTitle.length > 60) {
    seoTitle = `${opportunity.title} - ${rewardText}${categoryText}`;
    if (seoTitle.length > 60) {
      seoTitle = `${opportunity.title} | Paid Research Study`;
    }
  }

  // ✅ OPTIMIZED DESCRIPTION (Includes key selling points)
  const cleanDescription = opportunity.description?.replace(/<[^>]*>/g, ' ').substring(0, 120).trim();
  const seoDescription = `Participate in this ${opportunity.category?.toLowerCase() || 'professional'} research study. ${rewardText} for ${opportunity.time_estimate || 'your time'}. ${cleanDescription}...`;

  // ✅ ALWAYS INCLUDE CANONICAL URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  return {
    title: seoTitle,
    description: seoDescription,
    
    // 🔥 CRITICAL FOR SEO: Canonical URL prevents duplicate content
    alternates: {
      canonical: `${baseUrl}/research/${slug}`,
    },
    
    // ✅ For social sharing
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${baseUrl}/research/${slug}`,
      type: 'article',
      publishedTime: opportunity.created_at,
      authors: ['TalentVaults'],
    },
    
    // ✅ For Twitter cards
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
    },
  };
}

// This tells Next.js which pages to generate statically
export async function generateStaticParams() {
  const { data: surveys } = await supabase
    .from('opportunities')
    .select('page_slug')
    .eq('type', 'survey')
    .eq('page_generated', true);

  return surveys?.map((survey) => ({
    slug: survey.page_slug,
  })) || [];
}

// Helper function to format the description with first line bold
function formatDescription(text: string) {
  if (!text) return null;
  
  // Split into paragraphs
  const paragraphs = text.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();
    
    // For the first paragraph, make first sentence bold
    if (index === 0) {
      // Find the first sentence (ending with period, exclamation, or question mark)
      const sentenceEnd = trimmed.search(/[.!?](?=\s|$)/);
      
      if (sentenceEnd > 0) {
        const firstSentence = trimmed.substring(0, sentenceEnd + 1);
        const rest = trimmed.substring(sentenceEnd + 1).trim();
        
        // Clean any markdown from first sentence
        const cleanedFirstSentence = firstSentence.replace(/\*\*/g, '').trim();
        
        return (
          <div key={index} className="mb-4">
            <p className="font-bold text-text-light dark:text-gray-300 leading-relaxed text-lg">
              {cleanedFirstSentence}
            </p>
            {rest && (
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                {rest}
              </p>
            )}
          </div>
        );
      }
      
      // If no sentence ending found, clean markdown and show whole paragraph
      const cleanedParagraph = trimmed.replace(/\*\*/g, '').trim();
      return (
        <p key={index} className="text-text-light dark:text-gray-300 leading-relaxed mb-4">
          {cleanedParagraph}
        </p>
      );
    }
    
    // Check if paragraph starts with bullet points
    if (trimmed.startsWith('-')) {
      const bulletPoints = trimmed.split('\n').filter(line => line.trim().startsWith('-'));
      return (
        <ul key={index} className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300 mb-4">
          {bulletPoints.map((bullet, idx) => (
            <li key={idx} className="flex items-start">
              <Icon name="check_circle" size="sm" className="text-secondary mr-2 mt-0.5 flex-shrink-0" />
              <span>{bullet.replace(/^- /, '').trim()}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    // Regular paragraph - clean any remaining markdown
    const cleanedParagraph = trimmed.replace(/\*\*/g, '').trim();
    return (
      <p key={index} className="text-text-light dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
        {cleanedParagraph}
      </p>
    );
  });
}

// Helper to safely get URL
function getSafeUrl(link: string | null, websiteName: string): string {
  if (!link || link === '#' || link.trim() === '') {
    return `https://${websiteName.toLowerCase().replace(/\s+/g, '')}.com`;
  }
  
  // Ensure URL has protocol
  if (!link.startsWith('http://') && !link.startsWith('https://')) {
    return `https://${link}`;
  }
  
  return link;
}

// =============================
// Main Component - UPDATED with ResearchSchema and Lucide Icons
// =============================
export default async function ResearchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch survey data using cached function
  const opportunity = await getSurveyBySlug(slug);

  // If error or no opportunity found, show 404
  if (!opportunity) {
    notFound();
  }

  const safeLink = getSafeUrl(opportunity.referral_link, opportunity.website_name);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* 🔥 NEW: Research Schema Injection */}
      <ResearchSchema opportunity={opportunity} />
      
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 sm:p-10 border border-border-light dark:border-border-dark">
        
        {/* Header and Back Link */}
        <Link href="/research" className="flex items-center text-primary mb-6 text-sm font-medium">
          <Icon name="arrow_back" size="lg" className="mr-1" />
          <span>Back to All Surveys</span>
        </Link>
        
        {/* Category Badge */}
        {opportunity.category && (
          <span className="inline-block text-xs font-semibold uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4">
            {opportunity.category}
          </span>
        )}
        
        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-white mb-8">
          {opportunity.title}
        </h1>

        {/* Key Stats Card */}
        <div className="grid grid-cols-2 gap-4 border-y border-border-light dark:border-border-dark py-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">Reward</p>
            <p className="text-xl font-bold text-secondary">
              {opportunity.reward || 'To be determined'}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">Est. Time</p>
            <p className="text-xl font-bold text-text-light dark:text-white">
              {opportunity.time_estimate || 'Varies'}
            </p>
          </div>
        </div>

        {/* Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-4">Opportunity Description</h2>
          <div className="text-text-light dark:text-gray-300 leading-relaxed">
            {formatDescription(opportunity.description)}
          </div>
        </section>

        {/* Eligibility Requirements */}
        {opportunity.eligibility && opportunity.eligibility.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary mb-4">Eligibility Requirements</h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300">
              {opportunity.eligibility.map((req: string, index: number) => (
                <li key={index} className="flex items-start">
                  <Icon name="check_circle" size="sm" className="text-secondary mr-2 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Action Button */}
        <div className="mt-10 pt-6 border-t border-border-light dark:border-border-dark">
          <a
            href={safeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full text-center py-3 rounded-xl font-bold text-lg text-white bg-primary hover:bg-primary/90 transition shadow-md"
          >
            <Icon name="arrow_forward" className="align-middle mr-2" />
            Participate Now
          </a>
          
          {/* Updated Disclaimer Note */}
          <div className="mt-4 px-2">
            <p className="text-xs text-text-muted-light dark:text-gray-400 text-center leading-relaxed">
              <span className="text-sm font-bold uppercase">AFFILIATE NOTICE:</span> This button takes you to the {opportunity.website_name} website, which uses cookies for tracking to attribute referrals. TalentVaults earns a commission if you sign up, pass the screener and complete a study. For more information, see our privacy policy. <span className="text-sm font-bold uppercase">AFFILIATE-HINWEIS:</span> Diese Schaltfläche führt Sie zur Webseite von {opportunity.website_name}, wo Cookies für Tracking zur Zuordnung von Empfehlungen verwendet werden. TalentVaults erhält eine Provision, wenn Sie sich anmelden, den Screener bestehen und diese Studie abschließen. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}