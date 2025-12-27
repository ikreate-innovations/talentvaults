// app/api/opportunities/[slug]/page.tsx - COMPLETE UPDATED VERSION
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import { notFound } from 'next/navigation';
import Icon from '@/app/components/Icon';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('*')
    .eq('page_slug', slug)
    .single();

  if (!opportunity) {
    return { title: 'Opportunity Not Found' };
  }

  return {
    title: `${opportunity.title} | TalentVaults`,
    description: opportunity.description.slice(0, 160),
  };
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params;

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('page_slug', slug)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link
        href="/opportunities"
        className="flex items-center text-primary mb-6 text-sm font-medium hover:underline"
      >
        <Icon name="arrow_back" size="lg" className="mr-1" />
        Back to All Opportunities
      </Link>

      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg p-6 sm:p-10 border border-border-light dark:border-border-dark">
        <span className="inline-block text-xs font-semibold uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4">
          {opportunity.category || 'Opportunity'}
        </span>

        <h1 className="text-3xl font-bold text-text-light dark:text-white mb-8">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-2 gap-4 border-y border-border-light dark:border-border-dark py-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">
              Reward
            </p>
            <p className="text-xl font-bold text-secondary">{opportunity.reward || 'TBD'}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-text-muted-light dark:text-gray-400">
              Est. Time
            </p>
            <p className="text-xl font-bold text-text-light dark:text-white">
              {opportunity.time_estimate || 'Varies'}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-3">About This Opportunity</h2>
            <p className="text-text-light dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </section>

          {opportunity.eligibility && opportunity.eligibility.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-3">Eligibility Requirements</h2>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300">
                {opportunity.eligibility.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-border-light dark:border-border-dark">
          <a
            href={opportunity.referral_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-3 rounded-xl font-bold text-lg text-white bg-secondary hover:bg-secondary/90 transition shadow-md"
          >
            Apply / Participate Now
          </a>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center mt-2">
            Redirecting to {opportunity.source === 'respondent' ? 'Respondent.io' : 'the platform'} with your referral code
          </p>
        </div>
      </div>
    </main>
  );
}