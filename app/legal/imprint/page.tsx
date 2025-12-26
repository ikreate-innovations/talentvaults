import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Imprint | TalentVaults',
  description: 'Legal information about the provider of the TalentVaults platform.',
};

export default function ImprintPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full md:w-64 lg:w-72 md:sticky md:top-28 self-start mb-12 md:mb-0 hidden lg:block">
          <nav className="flex flex-col space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase text-text-muted-light dark:text-gray-400">On this page</h3>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-white bg-primary dark:bg-primary/20" href="#provider">1. Service Provider</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#nature">2. Nature of Service</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#commercial">3. Commercial Register</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#responsible">4. Responsible for Content</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#liability-content">5. Liability for Content</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#liability-links">6. Liability for Links</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#affiliate">7. Affiliate Disclosure</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#ip">8. Intellectual Property</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#data">9. Data Protection</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#jurisdiction">10. Applicable Law</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#language">11. Language Information</a>
            <a className="rounded-md px-3 py-2 text-sm font-medium text-text-light dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" href="#changes">12. Changes</a>
          </nav>
        </aside>

        {/* Imprint Content */}
        <div className="flex-1 min-w-0">
          
          {/* Page Heading */}
          <div className="pb-8 border-b border-border-light dark:border-border-dark">
            <div className="flex flex-col gap-2">
              <h1 className="text-text-light dark:text-white text-4xl font-black tracking-tighter">Imprint</h1>
              <p className="text-text-muted-light dark:text-gray-400 text-base font-normal">Last Updated: December 26, 2025</p>
              <p className="text-text-light dark:text-gray-300 text-base font-normal mt-2">
                Legal information according to § 5 DDG (Digitale-Dienste-Gesetz) and EU regulations.
              </p>
            </div>
          </div>

          <article className="prose prose-base dark:prose-invert max-w-none pt-8 space-y-8">
            
            {/* 1. Service Provider */}
            <section id="provider" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">1. Service Provider (Diensteanbieter / Provider Identification)</h2>
              
              <div className="pl-4 border-l-2 border-primary mt-6">
                <p className="text-text-light dark:text-gray-300 leading-relaxed">
                  <strong>iKreate Innovations OÜ</strong><br/>
                  Registry Code: 16848376<br/>
                  Registered Address: Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551, Estonia
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">Represented by:</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                German Alonso Quintanilla Guandique (Member of the Management Board)
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">Contact:</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Email: iknnovating@gmail.com<br/>
                Website: www.talentvaults.com
              </p>
            </section>
            
            {/* 2. Nature of Service */}
            <section id="nature" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">2. Nature of Service</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                TalentVaults is an informational platform that curates, compares, and presents opportunities from third‑party providers (such as remote work platforms, research participation platforms, and financial service tools). The website is operated for commercial purposes, primarily financed via affiliate and referral commissions.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                TalentVaults does not itself offer employment, financial services, or recruitment services; it acts as an information provider and marketing intermediary only. Any contractual relationship for jobs, gigs, or financial products is concluded exclusively between users and the respective third‑party provider.
              </p>
            </section>
            
            {/* 3. Commercial Register and Supervisory Information */}
            <section id="commercial" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">3. Commercial Register and Supervisory Information</h2>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">Legal Form:</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Private limited company (osaühing, OÜ) under Estonian law.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">Commercial Register:</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Registered in the Estonian Commercial Register (Äriregister) under Registry Code 16848376.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 text-text-light dark:text-white">Supervisory Authority for Company Registration:</h3>
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-2">
                Estonian Commercial Register / Centre of Registers and Information Systems.
              </p>
            </section>
            
            {/* 4. Responsible for Content */}
            <section id="responsible" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">4. Responsible for Content</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Responsible for the content on this website in the sense of applicable EU and Estonian law is:
              </p>
              
              <div className="pl-4 border-l-2 border-primary mt-4">
                <p className="text-text-light dark:text-gray-300 leading-relaxed">
                  <strong>iKreate Innovations OÜ</strong><br/>
                  Attn: German Alonso Quintanilla Guandique<br/>
                  Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551, Estonia<br/>
                  Email: iknnovating@gmail.com
                </p>
              </div>
            </section>
            
            {/* 5. Liability for Content */}
            <section id="liability-content" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">5. Liability for Content</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                The contents of this website are created with great care. Nevertheless, no guarantee is given for the correctness, completeness, or currentness of the information provided.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                As a service provider, TalentVaults is responsible for its own content on these pages in accordance with applicable laws. However, there is no obligation to monitor transmitted or stored information from third parties or to investigate circumstances that indicate illegal activity, except where required by mandatory law.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Obligations to remove or block the use of information in accordance with general laws remain unaffected. Any liability in this respect is only possible from the time of knowledge of a specific legal infringement. Upon becoming aware of such infringements, the relevant content will be removed without undue delay.
              </p>
            </section>
            
            {/* 6. Liability for Links */}
            <section id="liability-links" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">6. Liability for Links</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                This website contains links to external third‑party websites over whose content TalentVaults has no influence. Therefore, no liability is assumed for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognizable at that time. However, constant monitoring of the content of linked pages is not reasonable without concrete evidence of a violation of the law. Upon notification of violations, such links will be removed without undue delay.
              </p>
            </section>
            
            {/* 7. Affiliate and Advertising Disclosure */}
            <section id="affiliate" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">7. Affiliate and Advertising Disclosure</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                TalentVaults participates in affiliate and referral programs. Buttons or links with labels such as "Apply Now", "Participate", "Visit Website", or similar may be embedded with a generic partner or referral ID that identifies TalentVaults as the referrer.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                If you click such links and subsequently register, apply, or purchase services on a third‑party website (for example, Respondent.io, Mercor, Wise or other partners), TalentVaults may receive a commission from the respective provider. This does not increase the price you pay and does not affect the contractual relationship between you and the third‑party provider.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Any tracking cookies or technologies used for referral attribution are set and controlled exclusively by the respective third‑party provider, under their own privacy policies. TalentVaults does not set its own affiliate tracking cookies on your device.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Further details on data processing, cookies, and affiliate tracking are described in the <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link> and Cookie Policy of TalentVaults.
              </p>
            </section>
            
            {/* 8. Intellectual Property / Copyright */}
            <section id="ip" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">8. Intellectual Property / Copyright</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                All texts, images, logos, graphics, and other content on this website are protected by copyright and related intellectual property laws, unless explicitly stated otherwise.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Any reproduction, editing, distribution, or any kind of exploitation outside the limits of copyright law requires the prior written consent of iKreate Innovations OÜ or the respective rights holder. Downloads and copies of this site are only permitted for private, non‑commercial use, unless explicitly stated otherwise.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Where third‑party content (e.g. logos or screenshots of partner platforms) is used, such use is based on applicable statutory permissions, cooperation agreements, or fair use principles, and the copyrights of third parties are respected. If you nevertheless become aware of a copyright infringement, please notify us; such content will be removed without undue delay upon confirmation of infringement.
              </p>
            </section>
            
            {/* 9. Data Protection */}
            <section id="data" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">9. Data Protection</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                Information about the processing of personal data, use of cookies, tracking technologies, and your rights as a data subject (GDPR, UK GDPR, CCPA/CPRA/VCDPA, where applicable) can be found in the Privacy Policy and integrated Cookie Policy of TalentVaults, available at:
              </p>
              
              <div className="pl-4 mt-2">
                <Link href="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                These documents form an integral part of the legal information for this website.
              </p>
            </section>
            
            {/* 10. Applicable Law and Jurisdiction */}
            <section id="jurisdiction" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">10. Applicable Law and Jurisdiction (Information note)</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                The operation of this website is subject to the laws of the Republic of Estonia, without prejudice to mandatory consumer protection regulations of the country in which you habitually reside within the EU/EEA.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                For business users, the competent courts of Tallinn, Estonia, are agreed as the exclusive place of jurisdiction, to the extent permitted by law. This information is provided for transparency and does not limit mandatory rights of consumers under EU law.
              </p>
            </section>
            
            {/* 11. Language Information */}
            <section id="language" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">11. Language Information (Estonian Language Act Note)</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                iKreate Innovations OÜ is registered in Estonia. If this website is provided primarily in English and/or German, users are informed that the core service and customer communication are provided in these languages.
              </p>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                In accordance with Estonian language requirements for Estonian‑registered entities with foreign‑language websites, a short Estonian summary of the company's field of activity may be provided on a separate page or within this imprint. For example:
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border-l-4 border-primary">
                <p className="text-text-light dark:text-gray-300 italic leading-relaxed">
                  iKreate Innovations OÜ on veebiplatvorm, mis koondab ja tutvustab erinevaid kolmandate isikute poolt pakutavaid töö- ja teenimisvõimalusi ning finantsteenuseid. Ettevõte ei osuta ise töövahendus- ega finantsteenuseid, vaid tegutseb teabe- ja turundusvahendajana.
                </p>
                <p className="text-text-muted-light dark:text-gray-400 text-sm mt-2">
                  (Translation: iKreate Innovations OÜ is a web platform that aggregates and introduces various work and earning opportunities as well as financial services offered by third parties. The company does not provide employment agency or financial services itself, but acts as an information and marketing intermediary.)
                </p>
              </div>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                This short Estonian text helps meet Estonian language‑law expectations for publicly accessible websites of Estonian entities.
              </p>
            </section>
            
            {/* 12. Changes to this Imprint */}
            <section id="changes" className="scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-text-light dark:text-white">12. Changes to this Imprint</h2>
              
              <p className="text-text-light dark:text-gray-300 leading-relaxed mt-4">
                This imprint may be updated from time to time to reflect changes in legal requirements or in the company's details. The "Last Updated" date indicates the current version.
              </p>
              
              <div className="pl-4 border-l-2 border-primary mt-4">
                <p className="text-text-light dark:text-gray-300 leading-relaxed">
                  <strong>Last Updated:</strong> December 26, 2025
                </p>
              </div>
            </section>
            
          </article>
        </div>
      </div>
    </div>
  );
}