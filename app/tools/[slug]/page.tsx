// app/tools/[slug]/page.tsx - COMPLETE UPDATED VERSION
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import ToolSchema from '@/app/components/seo/ToolSchema';
import Icon from '@/app/components/Icon';

// Updated interface with structured fields
interface ToolOpportunity {
  id: string;
  type: 'tool';
  title: string;
  description: string;
  tool_description: string;
  icon: string;
  icon_color: string;
  bg_color: string;
  referral_link: string;
  website_name: string;
  page_slug: string;
  created_at: string;
  category?: string;
  // STRUCTURED FIELDS
  application_category?: string;
  operating_system?: string;
  price?: number;
  price_currency?: string;
  rating_value?: number;
  rating_count?: number;
}

// =============================
// UPDATED: Fetch More Fields for Metadata
// =============================
const getToolMetadata = async (slug: string) => {
  return unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching metadata for tool: ${slug}`);
      
      const { data: tool } = await supabase
        .from('opportunities')
        .select('title, tool_description, website_name, created_at')
        .eq('page_slug', slug)
        .eq('type', 'tool')
        .single();

      return tool;
    },
    ['tool-metadata', slug],
    {
      tags: ['opportunities', 'digital-tools', `tool-${slug}`],
      revalidate: false,
    }
  )();
};

// =============================
// Cached function for tool details - UPDATED to fetch structured fields
// =============================
const getToolBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching FRESH tool: ${slug}`);
      
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          application_category,
          operating_system,
          price,
          price_currency,
          rating_value,
          rating_count
        `)
        .eq('page_slug', slug)
        .eq('type', 'tool')
        .single();

      if (error || !data) {
        console.error('❌ Tool not found:', slug, error);
        return null;
      }

      return data as ToolOpportunity;
    },
    ['tool-detail', slug],
    {
      tags: ['opportunities', 'digital-tools'],
      revalidate: false,
    }
  )();
};

// =============================
// COMPLETELY REWRITTEN: Optimized Metadata Generation
// =============================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const tool = await getToolMetadata(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | TalentVaults',
      description: 'This digital tool could not be found.',
      robots: { index: false, follow: false }, // Don't index 404s
    };
  }

  // ✅ OPTIMIZED TITLE (< 60 characters for Google)
  const shortDescription = tool.tool_description?.replace(/<[^>]*>/g, ' ').substring(0, 80).trim();
  let seoTitle = `${tool.title} - ${shortDescription || 'Professional Digital Tool'} | TalentVaults`;
  
  // Ensure title is under 60 chars
  if (seoTitle.length > 60) {
    seoTitle = `${tool.title} | Professional Tool | TalentVaults`;
  }

  // ✅ OPTIMIZED DESCRIPTION (Includes key selling points)
  const cleanDescription = tool.tool_description?.replace(/<[^>]*>/g, ' ').trim();
  const seoDescription = `Discover ${tool.title} - ${cleanDescription?.substring(0, 120) || 'A professional digital tool for remote workers'}. Expert-vetted by TalentVaults.`;

  // ✅ ALWAYS INCLUDE CANONICAL URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  return {
    title: seoTitle,
    description: seoDescription,
    
    // 🔥 CRITICAL FOR SEO: Canonical URL prevents duplicate content
    alternates: {
      canonical: `${baseUrl}/tools/${slug}`,
    },
    
    // ✅ For social sharing
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${baseUrl}/tools/${slug}`,
      type: 'article',
      publishedTime: tool.created_at,
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
  const { data: tools } = await supabase
    .from('opportunities')
    .select('page_slug')
    .eq('type', 'tool')
    .eq('page_generated', true);

  return tools?.map((tool) => ({
    slug: tool.page_slug,
  })) || [];
}

// Helper function to format tool description
function formatToolDescription(text: string) {
  if (!text) return null;
  
  // Split into paragraphs
  const paragraphs = text.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    const trimmed = paragraph.trim();
    
    // First paragraph (overview) - clean any markdown
    if (index === 0) {
      const cleanedParagraph = trimmed.replace(/\*\*/g, '').trim();
      return (
        <div key={index} className="text-text-light dark:text-gray-300 leading-relaxed mb-8">
          <p className="whitespace-pre-line">{cleanedParagraph}</p>
        </div>
      );
    }
    
    // Check if paragraph has bullet points
    if (trimmed.includes('-')) {
      const lines = trimmed.split('\n');
      const bulletPoints = lines.filter(line => line.trim().startsWith('-'));
      
      return (
        <div key={index} className="mb-8">
          <ul className="space-y-4">
            {bulletPoints.map((bullet, idx) => {
              // Remove the leading hyphen and space
              const content = bullet.replace(/^- /, '').trim();
              
              // Split by the first colon to get feature name and description
              const colonIndex = content.indexOf(':');
              
              if (colonIndex > 0) {
                const featureName = content.substring(0, colonIndex).trim();
                const featureDesc = content.substring(colonIndex + 1).trim();
                
                // Clean any markdown from feature name
                const cleanedFeatureName = featureName.replace(/\*\*/g, '').trim();
                
                return (
                  <li key={idx} className="flex items-start">
                    <Icon 
                      name="check_circle" 
                      size="sm" 
                      className="text-secondary mr-3 mt-0.5 flex-shrink-0" 
                    />
                    <span className="text-text-light dark:text-gray-300">
                      <span className="font-bold">{cleanedFeatureName}:</span>
                      <span className="ml-1">{featureDesc}</span>
                    </span>
                  </li>
                );
              }
              
              // If no colon, clean markdown and show entire content
              const cleanedContent = content.replace(/\*\*/g, '').trim();
              return (
                <li key={idx} className="flex items-start">
                  <Icon 
                    name="check_circle" 
                    size="sm" 
                    className="text-secondary mr-3 mt-0.5 flex-shrink-0" 
                  />
                  <span className="text-text-light dark:text-gray-300">{cleanedContent}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    
    // Skip any additional paragraphs after bullet points
    return null;
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
// Main Component - UPDATED with ToolSchema and Lucide Icons
// =============================
export default async function ToolDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // Fetch tool data using cached function
  const tool = await getToolBySlug(slug);

  // Handle tool not found
  if (!tool) {
    notFound();
  }

  const safeLink = getSafeUrl(tool.referral_link, tool.website_name);

  return (
    <main className="w-full flex-grow">
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* 🔥 NEW: Tool Schema Injection */}
          <ToolSchema tool={tool} />
          
          {/* Back Link */}
          <Link 
            href="/tools" 
            className="flex items-center text-primary mb-6 text-sm font-medium hover:text-primary/80 transition"
          >
            <Icon name="arrow_back" size="lg" className="mr-1" />
            <span>Back to All Tools</span>
          </Link>

          {/* Tool Header */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
            {/* Icon */}
            <div className={`flex items-center justify-center size-24 rounded-2xl ${tool.bg_color} ${tool.icon_color}`}>
              <Icon 
                name={tool.icon || 'settings'} 
                className="h-15 w-15" 
              />
            </div>

            {/* Title and Short Description */}
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark">
                {tool.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-text-muted-light dark:text-text-muted-dark">
                {tool.tool_description}
              </p>
            </div>
          </div>

          {/* Main Description */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl p-8 border border-border-light dark:border-border-dark mb-12">
            {formatToolDescription(tool.description)}
          </div>

          {/* Call to Action */}
          <div className="bg-card-light dark:bg-card-dark rounded-xl p-8 border border-border-light dark:border-border-dark text-center">
            <h3 className="text-2xl font-bold text-text-light dark:text-white mb-6">
              Ready to Get Started?
            </h3>
            
            {/* Button */}
            <a
              href={safeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-3xl mx-auto text-center py-4 rounded-xl font-bold text-xl text-white bg-primary hover:bg-primary/90 transition shadow-lg mb-4"
            >
              Visit Website
            </a>
            
            {/* Updated Disclaimer Note */}
            <div className="mt-4 px-2">
              <p className="text-xs text-text-muted-light dark:text-gray-400 text-center leading-relaxed">
                <span className="text-sm font-bold uppercase">AFFILIATE NOTICE:</span> This button takes you to the {tool.website_name} website, which uses cookies for tracking to attribute referrals. TalentVaults earns a commission if you sign up and purchase this service or product. For more information, see our privacy policy. <span className="text-sm font-bold uppercase">AFFILIATE-HINWEIS:</span> Diese Schaltfläche führt Sie zur Webseite von {tool.website_name}, wo Cookies für Tracking zur Zuordnung von Empfehlungen verwendet werden. TalentVaults erhält eine Provision, wenn Sie sich anmelden und dieses Produkt oder diese Dienstleistung erwerben. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}