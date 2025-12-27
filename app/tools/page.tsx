// app/tools/page.tsx - COMPLETE UPDATED VERSION
import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';
import Icon from '@/app/components/Icon';

// =============================
// UPDATED: More Compelling Metadata
// =============================
export const metadata: Metadata = {
  title: 'Essential Digital Tools for Remote Professionals | TalentVaults',
  description: 'Curated list of essential digital tools, tax software, banking solutions, and productivity apps for remote professionals. Expert-vetted and tested.',
  keywords: 'digital tools, remote work tools, productivity software, tax software, banking solutions, professional tools',
  alternates: {
    canonical: 'https://talentvaults.com/tools',
  },
  openGraph: {
    title: 'Essential Digital Tools for Remote Professionals | TalentVaults',
    description: 'Curated list of essential digital tools, tax software, banking solutions, and productivity apps for remote professionals.',
    url: 'https://talentvaults.com/tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essential Digital Tools for Remote Professionals | TalentVaults',
    description: 'Curated list of essential digital tools, tax software, banking solutions, and productivity apps for remote professionals.',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DigitalToolsPage() {
  try {
    const { data: tools, error } = await supabase
      .from('opportunities')
      .select('id, title, icon, icon_color, bg_color, tool_description, page_slug')
      .eq('opportunity_type', 'tool')
      .eq('page_generated', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tools:', error);
      return (
        <main className="w-full flex-grow">
          <section className="py-24 sm:py-32">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark mb-4">
                Could not load tools
              </h1>
              <p className="text-text-muted-light dark:text-text-muted-dark">
                Please try again later.
              </p>
            </div>
          </section>
        </main>
      );
    }

    const toolsList = tools || [];

    return (
      <main className="w-full flex-grow">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            
            {/* Header Section (matching typography already applied) */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark">
                Curated Digital Tools for Professionals
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-text-muted-light dark:text-text-muted-dark">
                Equip yourself with the best tools to thrive in the digital economy. {toolsList.length} tools available.
              </p>
            </div>
            
            {/* Tools List */}
            {toolsList.length > 0 ? (
              <div className="flex flex-col gap-8">
                {toolsList.map((tool) => (
                  <div 
                    key={tool.id} 
                    className="flex flex-col sm:flex-row items-center gap-6 rounded-xl bg-card-light dark:bg-card-dark p-6 sm:p-8 border border-border-light dark:border-border-dark"
                  >
                    {/* Icon */}
                    <div className={`flex items-center justify-center size-16 rounded-lg ${tool.bg_color} ${tool.icon_color} flex-shrink-0`}>
                      <Icon 
                        name={tool.icon || 'settings'} 
                        className="h-10 w-10" 
                      />
                    </div>

                    {/* Text Content */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">
                        {tool.title}
                      </h3>
                      <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
                        {tool.tool_description}
                      </p>
                    </div>

                    {/* Button */}
                    <Link 
                      href={`/tools/${tool.page_slug}`}
                      className="mt-4 sm:mt-0 flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      <span className="truncate">Learn More</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Icon name="build" className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">No Tools Available Yet</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark max-w-md mx-auto">
                  We're currently curating essential digital tools for professionals. Check back soon.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error: any) {
    console.error('💥 Critical error in tools page:', error);
    return (
      <main className="w-full flex-grow">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl text-text-light dark:text-text-dark mb-4">
              Something went wrong
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Please try again later.
            </p>
          </div>
        </section>
      </main>
    );
  }
}