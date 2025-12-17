import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';

// =============================
// UPDATED: More Compelling Metadata
// =============================
export const metadata: Metadata = {
  title: 'High-Paid Professional Surveys - Earn $50-$200+ per Study | TalentVaults',
  description: 'Access exclusive high-compensation research studies, surveys, and user interviews for professionals. Earn $50-$200+ per completed study. Expert-vetted opportunities.',
  keywords: 'paid surveys, professional research studies, user interviews, high compensation, market research, paid research',
  alternates: {
    canonical: 'https://talentvaults.com/research',
  },
  openGraph: {
    title: 'High-Paid Professional Surveys - Earn $50-$200+ per Study | TalentVaults',
    description: 'Access exclusive high-compensation research studies, surveys, and user interviews for professionals. Earn $50-$200+ per completed study.',
    url: 'https://talentvaults.com/research',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High-Paid Professional Surveys - Earn $50-$200+ per Study | TalentVaults',
    description: 'Access exclusive high-compensation research studies, surveys, and user interviews for professionals. Earn $50-$200+ per completed study.',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResearchIndexPage() {
  try {
    const { data: surveys, error } = await supabase
      .from('opportunities')
      .select('id, title, category, reward, time_estimate, page_slug, created_at')
      .eq('opportunity_type', 'survey')
      .eq('page_generated', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching surveys:', error);
      return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark mb-4">
            Could not load surveys
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Please try again later.
          </p>
        </div>
      );
    }

    const surveysList = surveys || [];
    
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark">
            High-Paid Professional Surveys
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-muted-light dark:text-text-muted-dark">
            Get compensated for your expertise. Showing {surveysList.length} active {surveysList.length === 1 ? 'survey' : 'surveys'}.
          </p>
        </div>

        {surveysList.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveysList.map((survey) => (
              <div 
                key={survey.id} 
                className="flex flex-col h-full rounded-xl p-6 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-md hover:shadow-lg transition"
              >
                <span className="text-xs font-semibold uppercase text-secondary bg-secondary/10 px-2 py-1 rounded-full inline-block w-fit">
                  {survey.category || 'Research'}
                </span>
                
                <h3 className="text-xl font-bold mt-3 mb-2 text-text-light dark:text-white line-clamp-2 min-h-[3.5rem]">
                  {survey.title}
                </h3>
                
                <div className="space-y-1 text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
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

                <div className="mt-auto pt-4">
                  <Link 
                    href={`/research/${survey.page_slug}`}
                    className="block w-full text-center py-2 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition"
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
              <span className="material-symbols-outlined text-3xl">search</span>
            </div>
            <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">No Surveys Available Yet</h3>
            <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto">
              We're currently curating high-quality research opportunities. Check back soon.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    console.error('💥 Critical error in research page:', error);
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark mb-4">
          Something went wrong
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          Please try again later.
        </p>
      </div>
    );
  }
}