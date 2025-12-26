import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | TalentVaults',
  description: 'The terms and conditions that govern the use of the TalentVaults platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full md:w-64 lg:w-72 md:sticky md:top-28 self-start mb-12 md:mb-0 hidden lg:block">
          <nav className="flex flex-col space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase text-text-muted-light dark:text-gray-400">On this page</h3>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-white bg-primary dark:bg-primary/20" href="#scope">1. Scope and Provider</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#nature">2. Nature of Services</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#disclaimer">3. Disclaimer of Warranties</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#affiliate">4. Affiliate Disclosure</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#obligations">5. User Obligations</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#liability">6. Limitation of Liability</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#third-party">7. Third-Party Links</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#ip">8. Intellectual Property</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#data">9. Data Protection</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#final">10. Final Provisions</a>
          </nav>
        </aside>

        {/* Terms of Service Content */}
        <div className="flex-1 min-w-0">
          
          {/* Page Heading */}
          <div className="pb-8 border-b border-border-light dark:border-border-dark">
            <div className="flex flex-col gap-2">
              <h1 className="text-text-light dark:text-white text-4xl font-black tracking-tighter">Terms of Service</h1>
              <p className="text-text-muted-light dark:text-gray-400 text-base font-normal">Last Updated: December 26, 2025</p>
            </div>
          </div>

          <article className="prose prose-base dark:prose-invert max-w-none pt-8 space-y-8">
            
            {/* 1. Scope and Provider */}
            <section id="scope" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">1. Scope and Provider</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">1.1. Terms of Service and Provider Information</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                These Terms of Service ("Terms") govern the use of the website www.talentvaults.com ("Website"), operated by:
              </p>
              
              <div className="pl-4 border-l-2 border-primary mt-4">
                <p className="text-text-light dark:text-gray-300 leading-relaxed">
                  <strong>iKreate Innovations OÜ</strong><br/>
                  Registry Code: 16848376<br/>
                  Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551, Estonia<br/>
                  <strong>Represented by:</strong> German Alonso Quintanilla Guandique (Member of the Management Board)<br/>
                  <strong>Contact:</strong> iknnovating@gmail.com
                </p>
              </div>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-6">
                (hereinafter referred to as "TalentVaults", "we", or "us").
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">1.2. Agreement to Terms</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                By accessing or using our Website, you ("User") agree to be bound by these Terms. If you do not agree, you must not use our Website.
              </p>
            </section>
            
            {/* 2. Nature of Services */}
            <section id="nature" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">2. Nature of Services</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">2.1. Informational Purpose Only</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                TalentVaults provides information, reviews, and comparisons regarding remote work platforms, gig economy opportunities, and financial tools. We act solely as an information aggregator and publisher.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">2.2. Intermediary Role</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                We are not a recruitment agency, an employer, or a financial institution. We do not hire users, nor do we process payments for work performed.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">2.3. No Contractual Relationship regarding Third-Party Services</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Any contract for work, services, or financial products entered into via links on our site is solely between you and the third-party provider (e.g., Respondent.io, Mercor, Wise). TalentVaults is not a party to these agreements and accepts no liability for their performance, payment, or legality.
              </p>
            </section>
            
            {/* 3. Disclaimer of Warranties */}
            <section id="disclaimer" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">3. Disclaimer of Warranties</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">3.1. Accuracy of Information</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                While we strive to keep information regarding third-party pay rates, requirements, and availability current, these factors change frequently. We do not guarantee that the information on our site is error-free, complete, or up-to-date at the moment of your visit.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">3.2. No Earnings Guarantee</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Any examples of earnings (e.g., "Earn $100/hour") are illustrative based on historical data or provider claims. We do not guarantee that you will achieve any specific income level. Your success depends on your skills, market demand, and the third-party provider's acceptance criteria.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">3.3. No Professional Financial or Legal Advice</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Content on TalentVaults does not constitute professional financial or legal advice.
              </p>
            </section>
            
            {/* 4. Affiliate Disclosure and Commercial Content */}
            <section id="affiliate" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">4. Affiliate Disclosure and Commercial Content</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">4.1. Commercial Relationship</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                You acknowledge that TalentVaults is a commercial project funded through affiliate marketing.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">4.2. Commissions</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                When you click links marked with "Apply Now," "Visit Website," or similar, and subsequently perform an action (such as signing up or completing a task), we may receive a commission from the third-party provider. This comes at no extra cost to you.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">4.3. Editorial Independence</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Despite these commercial relationships, we strive to provide objective information. However, the presence of an affiliate link may influence the placement or prominence of a provider on our Website.
              </p>
            </section>
            
            {/* 5. User Obligations */}
            <section id="obligations" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">5. User Obligations</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">5.1. Permitted Use</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                You agree to use this Website only for lawful purposes.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">5.2. Prohibited Conduct</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                You must not:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300 leading-relaxed mt-2">
                <li>Attempt to compromise the security of the Website (e.g., hacking, introducing viruses).</li>
                <li>Use automated systems (bots, scrapers) to extract data from our Website without written permission.</li>
                <li>Misrepresent your identity or qualifications when applying to partners linked through our site.</li>
              </ul>
            </section>
            
            {/* 6. Limitation of Liability */}
            <section id="liability" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">6. Limitation of Liability</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">6.1. Unlimited Liability</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                We are liable without limitation for damages caused by intent (fraud) or gross negligence, as well as for damages resulting from injury to life, body, or health.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">6.2. Limited Liability</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                In cases of slight negligence, we are only liable for the breach of a material contractual obligation (a duty whose fulfillment is essential for the proper execution of the contract and on which you regularly rely). In such cases, liability is limited to typical, foreseeable damages.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">6.3. Exclusion of Further Liability</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Any further liability is excluded. This applies in particular to:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-gray-300 leading-relaxed mt-2">
                <li>Lost profits or indirect damages.</li>
                <li>Damages resulting from your interactions with third-party websites (e.g., non-payment by a gig platform).</li>
                <li>Data loss resulting from technical issues beyond our control (e.g., hosting failures).</li>
              </ul>
            </section>
            
            {/* 7. Third-Party Links and Content */}
            <section id="third-party" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">7. Third-Party Links and Content</h2>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Our Website contains links to external third-party websites. We have no influence on the contents of those websites. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.
              </p>
            </section>
            
            {/* 8. Intellectual Property */}
            <section id="ip" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">8. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">8.1. Copyright Protection</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                All content published on this Website (texts, logos, designs, database structures) is subject to copyright law.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">8.2. Usage Restrictions</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Reproduction, processing, distribution, or any form of commercialization of such material beyond the scope of the copyright law requires the prior written consent of the respective author or creator (iKreate Innovations OÜ).
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">8.3. Reservation against Text and Data Mining</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                We expressly reserve the right to use our content for commercial text and data mining purposes within the meaning of § 44b UrhG (German Copyright Act) and Article 4 of the EU Directive on Copyright in the Digital Single Market. Automated reading of our Website (scraping) for AI training or commercial data aggregation is prohibited without a license.
              </p>
            </section>
            
            {/* 9. Data Protection */}
            <section id="data" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">9. Data Protection</h2>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Your use of our website is also governed by our <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how we collect and process your personal data in accordance with the GDPR.
              </p>
            </section>
            
            {/* 10. Final Provisions */}
            <section id="final" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">10. Final Provisions</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">10.1. Governing Law</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                These Terms shall be governed by the laws of the Republic of Estonia, excluding the UN Convention on Contracts for the International Sale of Goods (CISG).
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">10.2. Consumer Protection Exception</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                If you are a consumer within the EU, mandatory statutory consumer protection regulations of the country in which you habitually reside (e.g., Germany) remain unaffected by this choice of law.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">10.3. Jurisdiction</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                If the user is a merchant, a legal entity under public law, or has no general place of jurisdiction in the EU, the exclusive place of jurisdiction for all disputes is Tallinn, Estonia.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">10.4. Severability</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Should individual provisions of these Terms be or become invalid, this shall not affect the validity of the remaining provisions.
              </p>
            </section>
            
          </article>
        </div>
      </div>
    </div>
  );
}