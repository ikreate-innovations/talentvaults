// app/legal/privacy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TalentVaults',
  description: 'Our commitment to protecting your privacy and managing your data responsibly.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-28 self-start hidden lg:block">
          <nav className="flex flex-col gap-1">
            <h4 className="px-3 pb-2 text-sm font-bold text-text-light dark:text-white uppercase tracking-wider">On this page</h4>
            <a className="px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg" href="#overview">Overview</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#data-collection">Data Collection</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#database-hosting">Database Hosting</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#cookies">Cookies</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#affiliate">Affiliate Links</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#retention">Data Retention</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#rights">Your Rights</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#subprocessors">Sub-Processors</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#breaches">Breach Notification</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#complaints">Right to Complain</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#international">International Residents</a>
          </nav>
        </aside>

        {/* Policy Content - COMPLETELY UPDATED */}
        <div className="flex-1 min-w-0">
          <article className="prose prose-slate dark:prose-invert max-w-none space-y-8"> 
          
            {/* Page Heading */}
            <div className="flex flex-col gap-2 border-b border-border-light dark:border-border-dark pb-6">
              <h1 className="text-text-light dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Privacy Policy</h1>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Last Updated: December 28, 2025</p>
            </div>
            
            {/* 1. Overview Section - UPDATED EMAIL */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="overview">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">1. Overview and Responsible Body</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We take the protection of your personal data very seriously. This Privacy Policy explains how we collect, use, and protect your data when you visit our website www.talentvaults.com.
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <strong>Responsible Controller (Data Controller) according to Art. 4(7) GDPR:</strong>
              </p>
              <div className="pl-4 border-l-2 border-primary">
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  <strong>iKreate Innovations OÜ</strong><br/>
                  Registry Code: 16848376<br/>
                  Harju maakond, Tallinn, Kesklinna linnaosa, Ahtri tn 12, 15551<br/>
                  Estonia
                </p>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                  <strong>Represented by:</strong><br/>
                  German Guandique (Member of the Management Board)
                </p>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                  <strong>Contact:</strong><br/>
                  Email: info@talentvaults.com<br/>
                  For privacy-specific inquiries: info@talentvaults.com
                </p>
              </div>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>Note on Jurisdiction:</strong> We adhere to the General Data Protection Regulation (GDPR) and all relevant applicable data protection laws.
              </p>
            </section>
            
            {/* 2. Data Collection Section - UPDATED CLOUDFLARE DETAILS */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="data-collection">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">2. General Data Collection (Server Log Files)</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                When you visit our website, our hosting provider automatically collects and stores information in "server log files." This processing is strictly necessary for the technical operation and security of the website.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Provider:</strong> Netlify, Inc., 2325 3rd Street, Suite 296, San Francisco, California 94107, USA.</li>
                <li><strong>Data Collected:</strong> Full IP addresses, browser type/version, operating system, referrer URL, and time of request.</li>
                <li><strong>Retention:</strong> IP addresses are retained by Netlify for a maximum of 90 days to detect and prevent fraud and unauthorized access, after which they are rotated or deleted.</li>
                <li><strong>Legal Basis:</strong> Art. 6(1)(f) GDPR (Legitimate Interest in website security, fraud prevention, and ensuring service functionality). You have the right to object to this processing under Article 21 GDPR.</li>
                <li><strong>Data Processing Agreement (DPA):</strong> We maintain a DPA with Netlify that includes Standard Contractual Clauses (SCCs) to ensure GDPR compliance.</li>
                <li><strong>Netlify Privacy Policy:</strong> <a href="https://www.netlify.com/privacy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.netlify.com/privacy/</a></li>
              </ul>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Cloudflare Security & DPA Details</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We use Cloudflare for security and performance optimization. Cloudflare sets essential security cookies and processes your IP address for security purposes.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Provider:</strong> Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA.</li>
                <li><strong>Cloudflare Data Processing Agreement:</strong>
                  <ul className="list-circle list-outside pl-5 space-y-1 mt-1">
                    <li><strong>DPA Version:</strong> Cloudflare Data Processing Addendum v6.3 (effective June 19, 2025)</li>
                    <li><strong>Transfer Mechanism:</strong> EU-US Data Privacy Framework (Cloudflare is certified)</li>
                    <li><strong>Alternative Safeguards:</strong> Standard Contractual Clauses (Module Two)</li>
                    <li><strong>Data Processed:</strong> IP address for security and bot protection</li>
                    <li><strong>Location:</strong> Your IP is processed in Cloudflare's global network including US servers</li>
                  </ul>
                </li>
                <li><strong>Cloudflare Privacy Policy:</strong> <a href="https://www.cloudflare.com/privacypolicy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.cloudflare.com/privacypolicy/</a></li>
              </ul>
            </section>
            
            {/* 3. Database Hosting Section - UPDATED WITH SUB-PROCESSORS */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="database-hosting">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">3. Database Hosting (Supabase)</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We use Supabase as our backend database provider for content management and delivery.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Provider:</strong> Supabase, Inc., 970 Toa Payoh North #07-04, Singapore 318992.</li>
                <li><strong>Purpose:</strong> Hosting database content and delivering public data to the website. We do not currently use Supabase for user authentication or login sessions.</li>
                <li><strong>Primary Location:</strong> AWS Ireland (eu-west-1) — EU-adequate</li>
                <li><strong>Supabase Transfer Safeguards Detail:</strong>
                  <ul className="list-circle list-outside pl-5 space-y-2 mt-2">
                    <li><strong>Primary Database:</strong> AWS Ireland (eu-west-1) — EU-adequate, no transfer needed</li>
                    <li><strong>Logs & Monitoring:</strong> AWS CloudWatch may process logs in US — requires transfer safeguards</li>
                    <li><strong>Transfer Mechanism:</strong> Standard Contractual Clauses (Module Two) + Encryption (AES-256 at rest, TLS 1.2 in transit)</li>
                    <li><strong>Schrems II Assessment:</strong>
                      <ul className="list-none pl-5 space-y-1 mt-1">
                        <li>✓ Essential functions test: Data transfer is essential to service provision</li>
                        <li>✓ Supplementary measures: AES-256 encryption at rest, TLS encryption in transit</li>
                        <li>✓ Adequacy assessment: No mass surveillance risks identified specific to Supabase infrastructure</li>
                      </ul>
                    </li>
                    <li><strong>Sub-processors:</strong> See <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a> for complete list</li>
                  </ul>
                </li>
                <li><strong>Supabase Privacy Policy:</strong> <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a></li>
              </ul>
            </section>
            
            {/* 4. Cookies Section - COMPLETELY REWRITTEN */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="cookies">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">4. Cookies</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Our website utilizes only essential cookies—small text files stored on your device—that are required for the site to function properly and securely.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Essential Cookies We Use</h3>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Cookie Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Provider
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-border-light dark:divide-border-dark">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        __cf_bm
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Cloudflare
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Bot protection & security
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        30 minutes
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Essential
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        __cflb
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Cloudflare
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Load balancing & security
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        1 day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Essential
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        cv_cookie
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        TalentVaults
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Stores your cookie preference acknowledgment
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        1 year
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Essential
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-6">Informational Banner</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We display a simple informational banner to notify you about our use of essential cookies. This banner does not require consent as the cookies used are strictly necessary for the website's operation and security.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Managing Your Cookies</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Since we only use essential cookies, no consent management is required. However, you can disable cookies entirely in your browser settings:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-2">
                <strong>Note:</strong> Disabling essential cookies may impair website functionality and security features.
              </p>
            </section>
            
            {/* 5. Affiliate Links Section - UPDATED WITH DISCLOSURE & LEGAL BASIS */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="affiliate">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">5. Affiliate Links and Partner Redirection</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Our website features tools and platforms from third-party partners. <strong>All affiliate buttons are clearly labeled with a partner identifier.</strong> Compensation details for each partner are disclosed below.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Affiliate Link Disclosure</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Buttons marked with "Apply Now", "Participate Now", "Visit Website", or similar calls to action are embedded with our unique referral identifiers and are visibly marked as partner links.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Respondent.io:</strong> If you sign up through this button, successfully pass the screener for a survey, and complete the study, Respondent.io pays TalentVaults a commission.</li>
                <li><strong>Mercor:</strong> If you apply through this button, successfully pass Mercor's application process, and complete the minimum required paid work, Mercor pays TalentVaults a commission.</li>
                <li><strong>Wise:</strong> If you sign up through this button and use or purchase the relevant service, the provider pays TalentVaults a commission.</li>
              </ul>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Tracking Mechanism</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                When you click one of these buttons, you are redirected to the partner's domain. The URL contains a generic partner ID that identifies TalentVaults as the referrer. This ID allows the partner to attribute the commission to us. We do not generate or pass any unique user-ID, pseudonymized profile data, or personal contact details to these partners during this redirect.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Affiliate Partner ID Tracking - Legal Basis Analysis</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <strong>Legal Basis:</strong> Article 6(1)(f) GDPR (Legitimate Interest)
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  <strong>1. Purpose:</strong> Finance free website and content production; sustainable operation without advertising or subscriptions; partner programs offer users value (discounts, opportunities).
                </p>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-2">
                  <strong>2. Necessity:</strong> Generic partner ID is necessary to attribute referral; no personal data is passed to partners; minimal data: URL-based identifier + timestamp; users voluntarily click affiliate links.
                </p>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-2">
                  <strong>3. Balancing Test:</strong> Our interest (sustainable business model for free services) vs. data subject expectation (low expectation of privacy for publicly-shared links). Risk to data subject is minimal - partners only know a generic ID linked to visitor. Fully transparent with user control options.
                </p>
              </div>
              
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>Conclusion:</strong> Legitimate interest is justified. Privacy impact is minimal and proportionate to benefit.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Your Choice & Right to Object</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Interaction with these affiliate links is entirely voluntary. If you do not wish for this referral attribution to occur, please visit the partner websites directly without clicking the links on our platform.
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <strong>Your Right to Object (Art. 21 GDPR):</strong> You may object to affiliate partner ID tracking. Submit objections to info@talentvaults.com. We will respond within 30 days.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Partner Privacy Policies:</h3>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li>Respondent.io: <a href="https://www.respondent.io/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.respondent.io/privacy-policy</a></li>
                <li>Mercor: <a href="https://www.mercor.com/data-privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.mercor.com/data-privacy-policy</a></li>
                <li>Wise: <a href="https://wise.com/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://wise.com/privacy-policy</a></li>
              </ul>
            </section>
            
            {/* 6. Data Retention Section - NEW */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="retention">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">6. Data Retention Schedule</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We retain personal data only as long as necessary for the purposes outlined in this policy, in accordance with GDPR Art. 5(1)(e).
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Data Type
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Processor
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Retention Period
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Legal Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-border-light dark:divide-border-dark">
                    <tr>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Server log files (IP, User-Agent)
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Netlify
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        90 days maximum
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Legitimate interest (security)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Cloudflare security cookies
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Cloudflare
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        30 min (__cf_bm), 1 day (__cflb)
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Essential for security
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Cookie preference (cv_cookie)
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        TalentVaults
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        1 year
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Legitimate interest
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Supabase database content
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Supabase
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        As long as necessary for service; deleted on request
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        User consent / contract
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Affiliate redirect logs
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Partner services
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Per partner policy (typically 90-365 days)
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Legitimate interest (commission tracking)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>Data subjects can request early deletion</strong> of their data by contacting info@talentvaults.com. We will process deletion requests within 30 days.
              </p>
            </section>
            
            {/* 7. Your Rights Section - UPDATED */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="rights">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">7. Your Rights (GDPR)</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                You have the following rights regarding your personal data under the General Data Protection Regulation:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Right to Access (Art. 15 GDPR):</strong> Request a copy of your personal data we process.</li>
                <li><strong>Right to Rectification (Art. 16 GDPR):</strong> Correct inaccurate or incomplete personal data.</li>
                <li><strong>Right to Erasure (Art. 17 GDPR):</strong> Request deletion of your personal data ("right to be forgotten").</li>
                <li><strong>Right to Restrict Processing (Art. 18 GDPR):</strong> Request temporary restriction of processing in certain circumstances.</li>
                <li><strong>Right to Data Portability (Art. 20 GDPR):</strong> Receive your data in a structured, machine-readable format.</li>
                <li><strong>Right to Object (Art. 21 GDPR):</strong> Object to processing based on legitimate interest, including affiliate tracking. Submit objections to info@talentvaults.com.</li>
                <li><strong>Right to Withdraw Consent (Art. 7(3) GDPR):</strong> Withdraw previously given consent at any time.</li>
              </ul>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                To exercise these rights, please contact us at: <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a>
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We will respond to all legitimate requests within 30 days. We may request specific information to verify your identity before processing your request.
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We do not use automated decision-making or profiling (Art. 22 GDPR) that has legal effects on you.
              </p>
            </section>
            
            {/* 8. Sub-Processors Section - NEW */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="subprocessors">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">8. Sub-Processors & Change Notifications</h2>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Current Sub-Processors</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We use the following service providers who may process personal data on our behalf:
              </p>
              
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Processor
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Sub-Processors
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-border-light dark:divide-border-dark">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-text-light dark:text-text-dark">
                        Netlify, Inc.
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Website hosting & CDN
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        AWS, Fastly, etc.
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        USA (with EU safeguards)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-text-light dark:text-text-dark">
                        Supabase, Inc.
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Database hosting
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        AWS, CloudWatch
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Ireland (primary), USA (logs)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-text-light dark:text-text-dark">
                        Cloudflare, Inc.
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Security & performance
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Various infrastructure partners
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light dark:text-text-dark">
                        Global (with DPF certification)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-6">Sub-Processor Change Notification Process</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                When our service providers add or change sub-processors, they notify us in advance.
              </p>

              <h4 className="text-text-light dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4">Material vs Non-Material Changes</h4>
              <ul className="list-disc list-outside pl-5 space-y-1 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Material</strong> (notified via email): Location changes, new data types, security downgrades</li>
                <li><strong>Non-Material</strong> (policy update only): Sub-processor name changes, address updates</li>
              </ul>

              <h4 className="text-text-light dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pt-4">Notification Method</h4>
              <ol className="list-decimal list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Review the change</strong> for data protection compliance</li>
                <li><strong>Update this privacy policy</strong> within 30 days (published on website, highlighted as "UPDATED [DATE]")</li>
                <li><strong>Notify registered users</strong> via email for material changes (if applicable)</li>
                <li><strong>Allow objections</strong> by request to info@talentvaults.com (object within 30 days; we respond within 30 days)</li>
              </ol>
              
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>Current Sub-Processor Lists:</strong>
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li>Netlify: <a href="https://www.netlify.com/gdpr/subprocessors/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.netlify.com/gdpr/subprocessors/</a></li>
                <li>Supabase: <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a></li>
                <li>Cloudflare: <a href="https://www.cloudflare.com/gdpr/subprocessors/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.cloudflare.com/gdpr/subprocessors/</a></li>
              </ul>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-2">
                Users can request the full current sub-processor list by emailing info@talentvaults.com.
              </p>
            </section>
            
            {/* 9. Breach Notification Section - NEW */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="breaches">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">9. Data Breach Notification Procedure</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                In accordance with GDPR Articles 33-34, we have established procedures for data breach notification.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Our Commitment</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                If a personal data breach occurs that is likely to result in a risk to individuals' rights and freedoms, we will:
              </p>
              <ol className="list-decimal list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Notify the Estonian Data Protection Inspectorate (DPA)</strong> within 72 hours of becoming aware of the breach (Art. 33 GDPR)</li>
                <li><strong>Notify affected data subjects</strong> without undue delay if the breach poses a high risk to their rights and freedoms (Art. 34 GDPR)</li>
              </ol>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Notification Contents</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Breach notifications will include:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li>Nature and scope of the personal data breach</li>
                <li>Likely consequences for data subjects</li>
                <li>Measures taken or proposed to address the breach</li>
                <li>Contact details for further information</li>
              </ul>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Reporting Security Incidents</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                If you suspect a security incident or data breach involving our services, please report it immediately to: <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a>
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-text-light dark:text-text-dark text-sm font-medium">
                  <strong>Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)</strong><br/>
                  Tatari 39, 10134 Tallinn, Estonia<br/>
                  Email: <a href="mailto:info@aki.ee" className="text-primary hover:underline">info@aki.ee</a><br/>
                  Website: <a href="https://www.aki.ee" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.aki.ee</a>
                </p>
              </div>
            </section>
            
            {/* 10. Right to Complain Section - UPDATED */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="complaints">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">10. Right to Complain</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                If you believe our processing of your personal data violates data protection law, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or the place of the alleged infringement (Art. 77 GDPR).
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Lead Supervisory Authority</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                For iKreate Innovations OÜ, the lead supervisory authority is:
              </p>
              <div className="pl-4 border-l-2 border-primary mt-2">
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  <strong>Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)</strong><br/>
                  Tatari 39, 10134 Tallinn, Estonia<br/>
                  Phone: +372 627 4135<br/>
                  Email: <a href="mailto:info@aki.ee" className="text-primary hover:underline">info@aki.ee</a><br/>
                  Website: <a href="https://www.aki.ee" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.aki.ee</a>
                </p>
              </div>
              
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                We encourage you to contact us first at <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a> to resolve any concerns before approaching a supervisory authority.
              </p>
            </section>
            
            {/* 11. International Residents Section - UPDATED */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="international">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">11. International Residents</h2>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">For California Residents (CCPA/CPRA)</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-1 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Know:</strong> Access all personal data we collect (Right to Know)</li>
                <li><strong>Delete:</strong> Request deletion of your data (Right to Delete)</li>
                <li><strong>Correct:</strong> Request correction of inaccurate data (CPRA only)</li>
                <li><strong>Opt-Out of Sale:</strong> We do NOT currently sell personal information</li>
                <li><strong>Opt-Out of Sharing:</strong> We do NOT currently share personal information for targeted advertising</li>
              </ul>

              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>How to Exercise Your Rights:</strong><br/>
                Email: <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a><br/>
                Subject: "CCPA [Right Name] Request"<br/>
                Include: Your name, email, specific request
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                <p className="text-text-light dark:text-text-dark text-sm font-normal leading-relaxed">
                  <strong>Our Timeline:</strong> We will respond within 45 calendar days (may extend 45 additional days if complex)<br/>
                  <strong>Verification:</strong> We may request additional information to verify your identity<br/>
                  <strong>Non-Discrimination:</strong> We will not discriminate against you for exercising your rights
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                <h4 className="text-text-light dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">California "Do Not Sell My Information"</h4>
                <p className="text-text-light dark:text-text-dark text-sm font-normal leading-relaxed">
                  We do not sell your personal information as defined under CCPA/CPRA. To exercise your California privacy rights or request confirmation that we do not sell your data, email: <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a>
                </p>
              </div>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-6">UK Residents</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                The UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018 apply to our processing of UK residents' personal data. Your rights are as described in Section 7 (Your Rights) above.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Switzerland Residents</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                The Swiss Federal Act on Data Protection (FADP) applies. We process Swiss residents' data with equivalent protections to GDPR.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Other International Users</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                By using our website, you consent to the processing of your personal data in Estonia and other locations where our service providers operate, with appropriate safeguards as described in this policy.
              </p>
            </section>
            
            {/* Final Notes */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 mt-8">
              <p className="text-text-light dark:text-text-dark text-sm font-normal leading-relaxed">
                <strong>Policy Updates:</strong> We may update this privacy policy periodically. Material changes will be highlighted with "UPDATED [DATE]" markers and communicated to registered users via email if applicable.
              </p>
              <p className="text-text-light dark:text-text-dark text-sm font-normal leading-relaxed mt-2">
                <strong>Contact:</strong> For questions about this privacy policy or our data practices, contact us at <a href="mailto:info@talentvaults.com" className="text-primary hover:underline">info@talentvaults.com</a>.
              </p>
            </div>
            
          </article>
        </div>
      </div>
    </div>
  );
}