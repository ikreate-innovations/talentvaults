import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { createWebhookCache, CACHE_TAGS } from '@/lib/cache';
import { Metadata } from 'next';

// >>>>>>> REMOVED: export const dynamic = 'force-dynamic';
// >>>>>>> REMOVED: export const revalidate = 0;

// =============================
// OPTIMIZED METADATA: BRUTAL SEO FIXES APPLIED
// =============================
export const metadata: Metadata = {
  // ✅ OPTIMIZED: Concise, keyword-rich, under 60 chars
  title: 'TalentVaults: High-Paying Remote Jobs & Freelance Surveys',
  
  // ✅ OPTIMIZED: Action-oriented, front-loaded value, under 160 chars
  description: 'Find curated remote jobs ($80-$300/hr) and paid professional surveys. Join TalentVaults for vetted freelance opportunities and digital tools.',
  
  // ✅ CLEANUP: Keywords tag removed (useless dead weight)
  
  alternates: {
    canonical: 'https://talentvaults.com',
  },
  openGraph: {
    title: 'High-Paying Remote Jobs ($80-$300/hr) - TalentVaults',
    description: 'Stop digging. Start earning. Access curated, high-compensation remote jobs and premium research surveys for professionals.',
    url: 'https://talentvaults.com',
    siteName: 'TalentVaults',
    type: 'website',
    // ✅ UPDATED: Using 1200×630 png (correct case)
    images: [
      {
        url: 'https://talentvaults.com/og-main.png', 
        width: 1200,
        height: 630,
        alt: 'TalentVaults Remote Opportunities Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High-Paying Remote Jobs ($80-$300/hr)',
    description: 'Access curated, high-compensation remote jobs and premium research surveys.',
    // ✅ UPDATED: Using 1200×630 png (correct case)
    images: ['https://talentvaults.com/og-main.png'], 
  },
};

// 1. Create CACHED function to fetch homepage jobs
const getHomepageJobs = createWebhookCache(
  async () => {
    console.log('🧠 [CACHE MISS] Fetching FRESH jobs data from Supabase...');
    const { data: jobs, error: jobsError } = await supabase
      .from('opportunities')
      .select('id, title, company, location, hourly_rate, vetting_score, page_slug')
      .eq('type', 'job')
      .eq('page_generated', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      return [];
    }
    return jobs || [];
  },
  ['homepage-jobs'],
  [CACHE_TAGS.OPPORTUNITIES, CACHE_TAGS.JOBS]
);

// 2. Create CACHED function to fetch homepage surveys
const getHomepageSurveys = createWebhookCache(
  async () => {
    console.log('🧠 [CACHE MISS] Fetching FRESH survey data from Supabase...');
    const { data: surveys, error: surveysError } = await supabase
      .from('opportunities')
      .select('id, title, category, reward, time_estimate, page_slug')
      .eq('type', 'survey')
      .eq('page_generated', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (surveysError) {
      console.error('Error fetching surveys:', surveysError);
      return [];
    }
    return surveys || [];
  },
  ['homepage-surveys'],
  [CACHE_TAGS.OPPORTUNITIES, CACHE_TAGS.SURVEYS]
);

export default async function Home() {
  // 3. Fetch data using the CACHED functions
  const [homepageJobs, homepageSurveys] = await Promise.all([
    getHomepageJobs(),
    getHomepageSurveys(),
  ]);

  // ✅ ENHANCED JSON-LD: WebSite + Organization schema (WITHOUT social links)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://talentvaults.com/#organization",
        "name": "TalentVaults",
        "url": "https://talentvaults.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://talentvaults.com/logo.png"
        },
        "description": "A curated platform for high-quality remote jobs and professional research surveys."
        // ✅ REMOVED: sameAs array (no social links)
      },
      {
        "@type": "WebSite",
        "@id": "https://talentvaults.com/#website",
        "url": "https://talentvaults.com",
        "name": "TalentVaults",
        "description": "High-Paying Remote Jobs & Professional Surveys",
        "publisher": {
          "@id": "https://talentvaults.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://talentvaults.com/jobs?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      {/* ============================= */}
      {/* FIXED: Enhanced JSON-LD Script Tag */}
      {/* ============================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
      />

      <section className="relative py-24 sm:py-32 lg:py-40 bg-white dark:bg-background-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex max-w-3xl flex-col gap-6">
            <h1 className="text-text-light dark:text-text-dark text-5xl font-black leading-tight tracking-tighter md:text-6xl lg:text-7xl">High-Quality Remote Digital Work for Professionals</h1>
            <h2 className="text-lg font-normal leading-relaxed text-text-muted-light dark:text-text-muted-dark md:text-xl">Access a curated collection of high-compensation remote jobs and premium professional research surveys. Get paid for your expertise, now.</h2>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-background-light dark:bg-card-dark border-y border-border-light dark:border-border-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-text-light dark:text-text-dark">More Signal, Less Noise</h2>
            <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">Our rigorous vetting process saves you time and connects you with opportunities worthy of your expertise.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col items-start text-left gap-4 rounded-xl bg-card-light dark:bg-background-dark p-8 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>verified_user</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold leading-tight text-text-light dark:text-text-dark">Rigorous Vetting</h3>
                <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">Every opportunity is manually reviewed against our quality scorecard for compensation, company reputation, and role clarity.</p>
              </div>
            </div>
            <div className="flex flex-col items-start text-left gap-4 rounded-xl bg-card-light dark:bg-background-dark p-8 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>hub</span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold leading-tight text-text-light dark:text-text-dark">Professional Focus</h3>
                <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">TalentVaults is exclusively for experienced professionals. No entry-level gigs, no survey sites, no distractions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Curated Jobs Section - NOW CACHED */}
      <section className="py-16 sm:py-24 bg-white dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 text-left mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-text-light dark:text-text-dark">Curated Remote Work Opportunities</h2>
            <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">Explore roles with our unique vetting and insights. This is not just a job board.</p>
          </div>
          
          {homepageJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {homepageJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex flex-col h-full rounded-xl p-6 bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:shadow-lg transition-all duration-300 ease-in-out hover:border-primary/50 dark:hover:border-primary/50"
                  >
                    <div className="min-h-[5.5rem] mb-4">
                      <h3 className="font-bold text-xl line-clamp-2 text-text-light dark:text-white">{job.title}</h3>
                      <p className="text-text-muted-light dark:text-text-muted-dark mt-1">
                        {job.location || 'Remote (Global)'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="bg-blue-100 text-primary text-xs px-2 py-1 rounded font-medium">
                        Score: {job.vetting_score || 90}%
                      </span>
                      <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded font-medium">
                        {job.hourly_rate || '$80-120/hour'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <span className="material-symbols-outlined !text-base text-secondary">check_circle</span>
                        <span>Vetting Scorecard: {job.vetting_score || 90}/100</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <span className="material-symbols-outlined !text-base text-secondary">check_circle</span>
                        <span>Hourly Rate: {job.hourly_rate ? 'Top Tier' : 'Competitive'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                        <span className="material-symbols-outlined !text-base text-secondary">check_circle</span>
                        <span>Compliance: Fully Vetted</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <Link 
                  href="/jobs"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">View All Opportunities</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">work</span>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">No Jobs Available Yet</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto mb-6">
                We're currently sourcing high-quality remote job opportunities. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Curated Survey Opportunities Section - NOW CACHED */}
      <section className="py-16 sm:py-24 bg-background-light dark:bg-card-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 text-left mb-12">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-text-light dark:text-text-dark">Curated Survey Opportunities</h2>
            <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">High-value, paid research survey opportunities. Trustworthy and professional.</p>
          </div>
          
          {homepageSurveys.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {homepageSurveys.map((survey) => (
                  <div 
                    key={survey.id} 
                    className="flex flex-col h-full rounded-xl p-6 bg-card-light dark:bg-background-dark border border-border-light dark:border-border-dark shadow-md hover:shadow-lg transition"
                  >
                    <div className="min-h-[6rem] mb-4">
                      <span className="text-xs font-semibold uppercase text-secondary bg-secondary/10 px-2 py-1 rounded-full inline-block w-fit">
                        {survey.category || 'Research'}
                      </span>
                      
                      <h3 className="text-xl font-bold mt-3 text-text-light dark:text-white line-clamp-2">
                        {survey.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-text-muted-light dark:text-text-muted-dark">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary flex-shrink-0">paid</span>
                        <span className="truncate">
                          Reward: <span className="font-semibold text-text-light dark:text-white">{survey.reward || 'Varies'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary flex-shrink-0">schedule</span>
                        <span className="truncate">Est. Time: {survey.time_estimate || 'Varies'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <Link 
                  href="/research"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">See All Surveys</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">search</span>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">No Surveys Available Yet</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto mb-6">
                We're currently curating high-quality research opportunities. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* FIXED: Digital Tools Section with mobile responsiveness */}
      <section className="py-16 sm:py-24 bg-white dark:bg-background-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
            <div className="md:w-1/2">
              {/* FIX 1: Button/text alignment - centered on mobile, left on desktop */}
              <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark sm:text-4xl">Digital Tools for the Modern Professional</h2>
                <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">Equip yourself with the knowledge and tools to thrive in the current digital economy. From expert resources to productivity software, we provide curated resources to enhance your professional toolkit.</p>
                <Link 
                  href="/tools"
                  className="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Explore Tools</span>
                </Link>
              </div>
            </div>
            
            {/* FIX 2: Grid layout - 1 column on mobile, 2 columns on small screens and up */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-6 md:w-1/2">
              <div className="flex flex-col items-start gap-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark p-6 h-full">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Banking & Crypto</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Navigate the evolving financial landscape where traditional banking meets innovative cryptocurrency opportunities.</p>
              </div>

              <div className="flex flex-col items-start gap-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark p-6 h-full">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Skill Learning</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Master emerging professional competencies through targeted training and development.</p>
              </div>

              <div className="flex flex-col items-start gap-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark p-6 h-full">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                </div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Health and Wellbeing</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Achieve complete physical, mental, and social well-being for sustained professional performance.</p>
              </div>

              <div className="flex flex-col items-start gap-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark p-6 h-full">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">trending_up</span>
                </div>
                <h3 className="font-bold text-text-light dark:text-text-dark">Productivity</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Streamline workflows and enhance efficiency with strategies that reduce stress and improve outcomes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-24 bg-background-light dark:bg-card-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-text-light dark:text-text-dark">From Professionals, For Professionals</h2>
            <p className="max-w-2xl text-lg text-text-muted-light dark:text-text-muted-dark">Our members trust us to filter out the noise and surface career-defining opportunities.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-background-dark p-6">
              <p className="text-text-muted-light dark:text-text-muted-dark">"Finally, a platform that respects senior talent. The quality of opportunities and the insights on TalentVaults are unmatched. It's the first place I look."</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border-light dark:border-border-dark pt-4">
                <Image alt="Photo of Anna Kowalski" width={40} height={40} className="size-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQQan7V0UJnBw1m62mCbwwFzVekgoOTZiWLXjNAXL4Tn2lGZQ5jY6N1l4sMYw8mcANRu8Sq2j22x-UOvQOGIKl5-_Zfq7iByINEt61sLvoFLcm3dqBQRs6TboIBq_B9N7xX0K1-Lu1MnoQO1yjAjcSYopSo8U4YHH1XFq5eVw2CzuHA1JxnIeS2R18sbc1BYsKDIHKjGc1aBjYtGxbV0lgDkLkBi-OFTy1AOg2OcPUx_87416R8kKWpbL4nW3MzlGCgZuI-8s2Oo4" unoptimized={true} />
                <div>
                  <p className="font-semibold text-text-light dark:text-text-dark">Katarina V.</p>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Software Architect, Berlin</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-background-dark p-6">
              <p className="text-text-muted-light dark:text-text-muted-dark">"I used to spend hours scrolling through generic job boards. TalentVaults saved me so much time. The compliance info alone is worth its weight in gold for a freelancer like me."</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border-light dark:border-border-dark pt-4">
                <Image alt="Photo of Javier Moreno" width={40} height={40} className="size-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj249ErbAlulx12JQa3eH9--yz7qNv6MB6dtocJJO6Clt3VdH_raRynRhynL_Gtr2O6Q4x6kTZJGFV3gG3VrLmZOQHIUlbs_2gT1NfndY9vr_0AdgDhhV-3vn9jM7zIY5XrkHjmENYq_sXBW7YC6lHuFrCbeSawAEbQu-oeNISdkdwWUqmcA5OzXZGiK1Ccax6bKoxcKKWIqN1V1BbV06J6SmHMt3JFHbeCMMOsc2j9jIV4svuGcFAE99tvwgWq3AYxox7Bv_ywhk" unoptimized={true} />
                <div>
                  <p className="font-semibold text-text-light dark:text-text-dark">Javier M.</p>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Freelance Consultant, Madrid</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-background-dark p-6">
              <p className="text-text-muted-light dark:text-text-muted-dark">"The vetting process is clearly visible in the quality of the listings. I landed a fantastic remote role at a company I'd never have found otherwise. Highly recommended."</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border-light dark:border-border-dark pt-4">
                <Image alt="Photo of Sofia Rossi" width={40} height={40} className="size-10 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsv8PGwmzkVre0E-TXdyNwf9OcBvMR1ZY3s2RaUPEoqiZ8DAVp_lPJ_s3RN-a5PFfaY0vWC_C9zhll5Hu9EFLvx1AqmFihgvWRaNtJU5hZtVg-qz1Pw866MtNyfasD2xROxrvGgVH4AzXQYFNodn-K4r4mG-uRLjuhDhDm2cJoHO0vVVumxgZTJDCA3VBsVTVTdUmb_wTFBMiIQMX26ef5IdKvQwUXKZlH6V5iLJCv4Mx37GIP6nwv3QRpi7G9jOVmYooh_LeBXh8" unoptimized={true} />
                <div>
                  <p className="font-semibold text-text-light dark:text-text-dark">Chloé D.</p>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Marketing Director, Paris</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}