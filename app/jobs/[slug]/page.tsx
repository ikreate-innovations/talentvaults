// app/jobs/[slug]/page.tsx - COMPLETE UPDATED VERSION
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import JobSchema from '@/app/components/seo/JobSchema';

// Updated interface with structured fields
interface JobOpportunity {
  id: string;
  type: 'job';
  title: string;
  description: string;
  company: string;
  location: string;
  hourly_rate: string;
  vetting_score: number;
  compliance_status: string;
  referral_link: string;
  website_name: string;
  page_slug: string;
  created_at: string;
  employment_type: string;
  // STRUCTURED FIELDS
  country_code?: string;
  is_remote?: boolean;
  is_worldwide?: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_unit?: 'HOUR' | 'YEAR' | 'MONTH';
  company_website?: string;
}

// =============================
// Metadata generation (unchanged)
// =============================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const job = await unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching metadata for job: ${slug}`);
      
      const { data: job } = await supabase
        .from('opportunities')
        .select('title, description, hourly_rate, vetting_score, location, company, created_at')
        .eq('page_slug', slug)
        .eq('type', 'job')
        .single();

      return job;
    },
    ['job-metadata', slug],
    {
      tags: ['opportunities', 'opportunities-jobs', `job-${slug}`],
      revalidate: false,
    }
  )();

  if (!job) {
    return {
      title: 'Job Not Found | TalentVaults',
      description: 'This job opportunity could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const salaryText = job.hourly_rate 
    ? `$${job.hourly_rate.replace(/[^0-9.-]/g, '')}/hr`
    : 'Top Rate';
  
  const locationText = job.location?.includes('Remote') 
    ? 'Remote' 
    : (job.location || 'Remote');
  
  let seoTitle = `${job.title} - ${salaryText} • ${job.vetting_score || 90}% Score | ${locationText}`;
  
  if (seoTitle.length > 60) {
    seoTitle = `${job.title} - ${salaryText} | ${locationText}`;
    if (seoTitle.length > 60) {
      seoTitle = `${job.title} | ${locationText}`;
    }
  }

  const cleanDescription = job.description?.replace(/<[^>]*>/g, ' ').substring(0, 120).trim();
  const seoDescription = `Apply to this ${locationText.toLowerCase()} ${job.title} role at ${job.company || 'a leading company'}. Vetted ${job.vetting_score || 90}% score. ${cleanDescription}...`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentvaults.com';
  
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `${baseUrl}/jobs/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${baseUrl}/jobs/${slug}`,
      type: 'article',
      publishedTime: job.created_at,
      authors: ['TalentVaults'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
    },
  };
}

// =============================
// Cached function for job details - UPDATED to fetch structured fields
// =============================
const getJobBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      console.log(`🧠 [CACHE MISS] Fetching FRESH job: ${slug}`);
      
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          id,
          type,
          title,
          description,
          company,
          location,
          hourly_rate,
          vetting_score,
          compliance_status,
          referral_link,
          website_name,
          page_slug,
          created_at,
          employment_type,
          country_code,
          is_remote,
          is_worldwide,
          salary_min,
          salary_max,
          salary_currency,
          salary_unit,
          company_website
        `)
        .eq('page_slug', slug)
        .eq('type', 'job')
        .single();

      if (error || !data) {
        console.error('❌ Job not found:', slug, error);
        return null;
      }

      return data as JobOpportunity;
    },
    ['job-detail', slug],
    {
      tags: ['opportunities', 'opportunities-jobs'],
      revalidate: false,
    }
  )();
};

// Generate static paths
export async function generateStaticParams() {
  const { data: jobs } = await supabase
    .from('opportunities')
    .select('page_slug')
    .eq('type', 'job')
    .eq('page_generated', true);

  return jobs?.map((job) => ({
    slug: job.page_slug,
  })) || [];
}

// Helper to render section content with bullet points
function renderSectionContent(section: string, sectionIndex: number) {
  const trimmed = section.trim();
  if (!trimmed) return null;
  
  const lines = trimmed.split('\n').map(line => line.trim()).filter(line => line);
  const hasBulletPoints = lines.some(line => line.startsWith('-'));
  
  if (hasBulletPoints) {
    return (
      <ul key={`section-${sectionIndex}`} className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300 mb-6">
        {lines.map((line, lineIndex) => {
          const content = line.replace(/^-\s*/, '');
          return <li key={`section-${sectionIndex}-line-${lineIndex}`}>{content}</li>;
        })}
      </ul>
    );
  }
  
  return (
    <div key={`section-${sectionIndex}`} className="text-text-light dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
      {trimmed}
    </div>
  );
}

// Helper function to render mixed content with bold titles and bullet points
function renderJobDescription(text: string) {
  if (!text) return null;
  
  const sections = text.split(/\*\*(.*?)\*\*\s*/);
  let currentSection = '';
  const renderedSections = [];
  let sectionIndex = 0;
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    if (i % 2 === 1) {
      if (currentSection) {
        renderedSections.push(renderSectionContent(currentSection, sectionIndex));
        currentSection = '';
        sectionIndex++;
      }
      
      const title = section.trim();
      renderedSections.push(
        <h3 key={`title-${sectionIndex}`} className="text-2xl font-bold text-primary mb-4 mt-6 first:mt-0">
          {title}
        </h3>
      );
      sectionIndex++;
    } else if (section.trim()) {
      currentSection += section;
    }
  }
  
  if (currentSection) {
    renderedSections.push(renderSectionContent(currentSection, sectionIndex));
  }
  
  return renderedSections;
}

// =============================
// Main Component - UPDATED with JobSchema
// =============================
export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // Fetch job data using cached function
  const job = await getJobBySlug(slug);

  // Handle job not found
  if (!job) {
    notFound();
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 🔥 NEW: Job Schema Injection */}
      <JobSchema job={job} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <div className="lg:w-3/4 min-w-0">
          <Link 
            href="/jobs" 
            className="flex items-center text-primary mb-4 text-sm font-medium hover:text-primary/80 transition"
          >
            <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
            <span>Back to All Jobs</span>
          </Link>

          <h1 className="text-4xl font-black tracking-tight text-text-light dark:text-white mb-8">
            {job.title}
          </h1>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-border-light dark:border-border-dark py-4 mb-8 text-center">
            <div className="border-r border-border-light dark:border-border-dark pr-4">
              <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">Vetting Score</p>
              <p className="text-2xl font-bold text-primary">{job.vetting_score}%</p>
            </div>
            <div className="border-r border-border-light dark:border-border-dark pr-4">
              <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">Hourly Rate</p>
              <p className="text-lg font-bold text-text-light dark:text-white">{job.hourly_rate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">Location</p>
              <p className="text-lg font-bold text-text-light dark:text-white">{job.location}</p>
            </div>
          </div>

          {/* Job Description - Mixed formatting */}
          <section className="mb-8">
            {renderJobDescription(job.description)}
          </section>
        </div>

        {/* Sidebar (Only Compliance Review) */}
        <aside className="lg:w-1/4 w-full lg:sticky lg:top-28 self-start">
          <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 border border-border-light dark:border-border-dark">
            <h3 className="text-xl font-bold mb-4 text-primary">Compliance Review</h3>
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <span className="material-symbols-outlined text-lg">verified</span>
              <p className="text-sm font-semibold">TalentVaults Vetted</p>
            </div>
            <p className="text-sm text-text-light dark:text-gray-300">
              {job.compliance_status || 'Fully compliant with international employment law.'}
            </p>
          </div>
        </aside>
      </div>

      {/* Large Apply Now Button Section at Bottom */}
      <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-light dark:text-white mb-4">
            Are you interested?
          </h2>
          
          <a
            href={job.referral_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-3xl mx-auto text-center py-4 rounded-xl font-bold text-xl text-white bg-primary hover:bg-primary/90 transition shadow-lg mb-4"
          >
            Apply Now
          </a>
          
          {/* Disclaimer Note */}
          <div className="mt-4">
            <p className="text-[10px] italic text-text-muted-light dark:text-gray-400 text-center">
              *Affiliate notice: This button takes you to the {job.website_name} website, which uses cookies for tracking to attribute referrals. TalentVaults earns a commission if you sign up and get hired for the job. For more information, see our privacy policy. *Affiliate-Hinweis: Diese Schaltfläche führt Sie zur Webseite von {job.website_name}, wo Cookies für Tracking zur Zuordnung von Empfehlungen verwendet werden. TalentVaults erhält eine Provision, erst wenn Sie sich anmelden und diesen Job erhalten. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}