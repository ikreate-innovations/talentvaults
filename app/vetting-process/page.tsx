import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Our Vetting Process: How TalentVaults Filters High-Quality Opportunities',
  description: 'Learn about our 5-Point Quality Protocol that ensures every remote job, survey, and tool meets senior professional standards. No spam, no scams.',
  alternates: {
    canonical: 'https://talentvaults.com/vetting-process',
  },
  openGraph: {
    title: 'The TalentVaults Quality Filter: Curated for Senior Professionals',
    description: 'Discover our automated 5-Point Quality Protocol that filters out noise and delivers premium opportunities.',
    url: 'https://talentvaults.com/vetting-process',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How TalentVaults Vets Opportunities for Senior Professionals',
    description: 'Our 5-step process ensures only high-quality remote work reaches you.',
  },
};

const vettingSteps = [
  {
    step: 1,
    icon: 'business',
    title: 'Real Companies',
    description: 'Reputable providers only. No Gmail recruiters. No Telegram contacts.',
  },
  {
    step: 2,
    icon: 'payments',
    title: 'Senior-Level Pay',
    description: '$80+/€75+/£65+ per hour minimum. No "equity only" or exposure roles.',
  },
  {
    step: 3,
    icon: 'security',
    title: 'Scam-Proof Screening',
    description: 'No upfront fees. No equipment purchases. No check-cashing schemes.',
  },
  {
    step: 4,
    icon: 'description',
    title: 'Clear Deliverables',
    description: 'Defined scope + timelines required. No vague "rockstar needed" postings.',
  },
  {
    step: 5,
    icon: 'grade',
    title: 'Quality Score 85+',
    description: 'Provider reputation + role clarity. Automated AI-based scoring (0-100 scale).',
  },
];

const researchIncluded = [
  'User interviews & expert panels',
  'B2B / medical research studies',
  '$100+ cash payments via trusted platforms',
  'Professional screener questions only',
];

const researchExcluded = [
  'Penny surveys ($0.50 for 20 mins)',
  'Infinite redirect loops',
  'Data harvesting disguised as research',
  'Non-cash rewards (gift cards only)',
];

export default function VettingProcessPage() {
  return (
    <>
      {/* JSON-LD Schema Markup */}
      <Script
        id="vetting-process-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://talentvaults.com/#organization",
                "name": "TalentVaults",
                "url": "https://talentvaults.com",
                "logo": "https://talentvaults.com/og-main.png",
                "description": "Curated platform for high-quality remote jobs, professional research surveys, and digital tools for senior professionals worldwide.",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "Customer Support",
                  "email": "privacy@talentvaults.com",
                  "availableLanguage": ["English", "German"]
                },
                "sameAs": [
                  "https://www.linkedin.com/company/ikreate-innovations",
                  "https://twitter.com/talentvaults"
                ],
                "knowsAbout": [
                  "Remote work quality assessment",
                  "Professional freelance opportunities", 
                  "High-value research surveys",
                  "Digital tools for remote professionals"
                ]
              },
              {
                "@type": "HowTo",
                "@id": "https://talentvaults.com/#quality-protocol",
                "name": "TalentVaults 5-Point Quality Protocol for Remote Opportunities",
                "description": "Automated quality filtering process that vets remote jobs, professional surveys, and digital tools for senior professionals globally.",
                "publisher": {
                  "@id": "https://talentvaults.com/#organization"
                },
                "estimatedCost": {
                  "@type": "MonetaryAmount",
                  "currency": "USD",
                  "value": "0"
                },
                "step": vettingSteps.map((step) => ({
                  "@type": "HowToStep",
                  "name": step.title,
                  "text": step.description,
                  "position": step.step
                })),
                "totalTime": "PT5M",
                "supply": {
                  "@type": "HowToSupply",
                  "name": "Senior Professionals with 5+ years experience"
                },
                "tool": [
                  {
                    "@type": "SoftwareApplication",
                    "name": "Automated Scam Detection",
                    "url": "https://talentvaults.com"
                  }
                ]
              }
            ]
          }, null, 2)
        }}
        strategy="afterInteractive"
      />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-card-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="material-symbols-outlined text-base">verified</span>
              Our Quality Promise
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-text-light dark:text-white">
              The TalentVaults <span className="text-primary">Quality Filter</span>
            </h1>
            
            <p className="mt-6 text-xl sm:text-2xl font-medium text-text-muted-light dark:text-text-muted-dark">
              Curated for Senior Professionals – No Spam, No Scams
            </p>
            
            <p className="mt-4 text-lg text-text-muted-light dark:text-text-muted-dark">
              Every opportunity passes our automated 5-Point Quality Protocol before reaching you.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </section>

      {/* 5-Step Vetting Process - Clean Vertical Timeline */}
      <section className="py-20 sm:py-28 bg-white dark:bg-background-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-white">
              Our 5-Point Quality Protocol
            </h2>
            <p className="mt-4 text-lg text-text-muted-light dark:text-text-muted-dark">
              A rigorous filtering process that ensures only premium opportunities reach our community
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 md:left-1/2 md:-translate-x-1/2"></div>
            
            {vettingSteps.map((step, index) => (
              <div key={step.step} className="relative mb-12 last:mb-0">
                {/* Step Connector Dot */}
                <div className="absolute left-6 top-6 size-4 bg-primary rounded-full border-4 border-white dark:border-background-dark md:left-1/2 md:-translate-x-1/2"></div>
                
                {/* Step Content - Alternates left/right on desktop */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 
                    ? 'md:pr-16 md:text-right' 
                    : 'md:ml-auto md:pl-16 md:text-left'
                }`}>
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center size-10 bg-primary text-white rounded-full font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  
                  {/* Step Card */}
                  <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary">
                          <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-text-light dark:text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-text-muted-light dark:text-text-muted-dark">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Process Outcome */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-3 bg-primary/5 dark:bg-primary/10 px-6 py-4 rounded-2xl border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
              <div>
                <p className="text-lg font-semibold text-text-light dark:text-white">
                  The result? A curated collection of opportunities worthy of your expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Research Standards */}
      <section className="py-20 sm:py-28 bg-background-light dark:bg-card-dark">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-white">
              Professional Research Standards
            </h2>
            <p className="mt-4 text-lg text-text-muted-light dark:text-text-muted-dark">
              $100+ cash payments via trusted platforms only
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Included */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">✓ Included</h3>
              </div>
              
              <ul className="space-y-4">
                {researchIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-500 dark:text-green-400 mt-0.5">check</span>
                    <span className="text-green-800 dark:text-green-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Excluded */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center size-12 rounded-lg bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined text-2xl">cancel</span>
                </div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-300">✗ Excluded</h3>
              </div>
              
              <ul className="space-y-4">
                {researchExcluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 dark:text-red-400 mt-0.5">close</span>
                    <span className="text-red-800 dark:text-red-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quality Assurance Note */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-8 border border-primary/20 dark:border-primary/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center size-16 rounded-xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold text-text-light dark:text-white mb-2">
                  Continuous Quality Assurance
                </h4>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Our vetting process doesn't end with initial approval. We maintain ongoing monitoring of all opportunities and partner platforms to ensure they continue meeting our standards throughout their lifecycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-light dark:text-white mb-6">
            Experience the Difference
          </h2>
          
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark mb-8">
            Join senior professionals who trust TalentVaults to filter out the noise and deliver premium opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="material-symbols-outlined">work</span>
              Browse Vetted Opportunities
            </a>
            
            <a
              href="/research"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-card-dark text-text-light dark:text-white font-bold rounded-xl border border-border-light dark:border-border-dark hover:border-primary transition-colors shadow-lg hover:shadow-xl"
            >
              <span className="material-symbols-outlined">search</span>
              View Research Studies
            </a>
          </div>
        </div>
      </section>
    </>
  );
}