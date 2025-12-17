import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { unstable_cache } from 'next/cache';

// =============================
// UPDATED: More Compelling Metadata
// =============================
export const metadata: Metadata = {
  title: 'High-Paying Remote Jobs - Vetted & Verified | TalentVaults',
  description: 'Discover curated remote jobs with verified salaries ($80-$200/hr), company vetting scores (85-95%), and compliance reviews. No spam, just quality opportunities.',
  keywords: 'remote jobs, high salary, vetted opportunities, freelance, digital nomad, verified compensation',
  alternates: {
    canonical: 'https://talentvaults.com/jobs',
  },
  openGraph: {
    title: 'High-Paying Remote Jobs - Vetted & Verified | TalentVaults',
    description: 'Discover curated remote jobs with verified salaries ($80-$200/hr), company vetting scores (85-95%), and compliance reviews.',
    url: 'https://talentvaults.com/jobs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High-Paying Remote Jobs - Vetted & Verified | TalentVaults',
    description: 'Discover curated remote jobs with verified salaries ($80-$200/hr), company vetting scores (85-95%), and compliance reviews.',
  },
};

// Cached function for jobs listing
const getJobsList = async () => {
  return unstable_cache(
    async () => {
      console.log('🧠 [CACHE MISS] Fetching FRESH jobs list from Supabase...');
      
      const { data: jobs, error } = await supabase
        .from('opportunities')
        .select('id, title, company, location, hourly_rate, vetting_score, page_slug, created_at')
        .eq('type', 'job')
        .eq('page_generated', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching jobs:', error);
        return [];
      }

      return jobs || [];
    },
    ['jobs-list'],
    {
      tags: ['opportunities', 'opportunities-jobs'],
      revalidate: false,
    }
  )();
};

export default async function JobsIndexPage() {
  // Fetch data using cached function
  const jobsList = await getJobsList();

  // Handle the case where fetch might fail
  if (!jobsList) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark mb-4">
          Something went wrong
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark">
          Curated Remote Opportunities
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted-light dark:text-text-muted-dark">
          Showing {jobsList.length} vetted openings. Click to view details.
        </p>
      </div>

      {jobsList.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsList.map((job) => (
            <div 
              key={job.id} 
              className="flex flex-col h-full border border-border-light dark:border-border-dark rounded-xl p-6 bg-card-light dark:bg-card-dark hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl mb-1 line-clamp-2 min-h-[3rem] text-text-light dark:text-white">
                {job.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3">
                {job.company} • {job.location}
              </p>
              
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-primary text-xs px-2 py-1 rounded font-medium">
                  Score: {job.vetting_score || 90}%
                </span>
                <span className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded font-medium">
                  {job.hourly_rate || '$80-120/hour'}
                </span>
              </div>

              <div className="mt-auto pt-4">
                <Link 
                  href={`/jobs/${job.page_slug}`}
                  className="block w-full text-center py-2 rounded font-bold text-white bg-primary hover:bg-primary/90 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">work</span>
          </div>
          <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">No Jobs Available Yet</h3>
          <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto">
            We're currently sourcing high-quality remote job opportunities. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}