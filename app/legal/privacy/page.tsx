// app/legal/privacy/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TalentVaults',
  description: 'Our commitment to protecting your privacy and managing your data.',
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
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#cookies">Cookies Management</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#affiliate">Affiliate Links</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#google-services">Google Services</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#rights">Your Rights</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#complaints">Right to Complain</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#international">International Residents</a>
            <a className="px-3 py-2 text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg" href="#cookies-table">Cookie Table</a>
          </nav>
        </aside>

        {/* Policy Content */}
        <div className="flex-1 min-w-0">
          <article className="prose prose-slate dark:prose-invert max-w-none space-y-8"> 
          
            {/* PageHeading */}
            <div className="flex flex-col gap-2 border-b border-border-light dark:border-border-dark pb-6">
              <h1 className="text-text-light dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Privacy Policy</h1>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Last Updated: December 15, 2025</p>
            </div>
            
            {/* Overview Section */}
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
                  German Alonso Quintanilla Guandique (Member of the Management Board)
                </p>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                  <strong>Contact:</strong><br/>
                  Email: iknnovating@gmail.com
                </p>
              </div>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mt-4">
                <strong>Note on Jurisdiction:</strong> We adhere to the General Data Protection Regulation (GDPR) and all relevant applicable data protection laws.
              </p>
            </section>
            
            {/* Data Collection Section */}
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
                <li><strong>Data Processing Agreement (DPA):</strong> We maintain a DPA with Netlify that includes Standard Contractual Clauses (SCCs) to ensure GDPR compliance. For details on how Netlify handles your data, see Netlify's privacy policy: <a href="https://www.netlify.com/privacy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.netlify.com/privacy/</a></li>
              </ul>
            </section>
            
            {/* Database Hosting Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="database-hosting">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">3. Database Hosting (Supabase)</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We use Supabase as our backend database provider for content management and delivery.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Provider:</strong> Supabase, Inc., 970 Toa Payoh North #07-04, Singapore 318992.</li>
                <li><strong>Purpose:</strong> Hosting database content and delivering public data to the website. We do not currently use Supabase for user authentication or login sessions.</li>
                <li><strong>Data Transfer & Safeguards:</strong> Supabase hosts our primary database in West EU (Ireland) on Amazon Web Services (AWS). However, supporting infrastructure (logs, analytics) may involve processing in the US or Singapore. We have conducted a Transfer Impact Assessment (TIA) and determined that appropriate safeguards are in place, including:
                  <ul className="list-circle list-outside pl-5 space-y-1 mt-2">
                    <li>Standard Contractual Clauses (Module Two).</li>
                    <li>Encryption in transit (TLS 1.2) and at rest (AES-256).</li>
                    <li>Adherence to the EU-US Data Privacy Framework principles.</li>
                  </ul>
                </li>
                <li><strong>Privacy Policy:</strong> <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a></li>
              </ul>
            </section>
            
            {/* Cookies Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="cookies">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">4. Cookies and Consent Management</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Our website utilizes cookies—small text files stored on your device—to ensure functionality and analyze traffic.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Consent Management Platform (CMP)</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                To manage your consent preferences transparently, we use Cookiebot. Cookiebot scans our site to control cookies and may collect technical data about your device to display the correct consent options.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Function:</strong> Cookiebot automatically blocks all non-essential cookies (such as those for Statistics) until you grant explicit consent.</li>
                <li><strong>Legal Basis:</strong> Art. 6(1)(c) GDPR (Legal Obligation to obtain valid consent).</li>
                <li><strong>Your Choice:</strong> You can manage or withdraw your consent at any time by clicking the "Cookie Settings" link in the footer of every page. Changes take effect immediately.</li>
              </ul>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Categories of Cookies</h3>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Strictly Necessary:</strong> Required for the site to function (e.g., saving your consent preference, session security). No consent is required for these.</li>
                <li><strong>Statistics:</strong> Used to track behavior anonymously (e.g., Google Analytics). Consent is required.</li>
              </ul>
            </section>
            
            {/* Affiliate Links Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="affiliate">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">5. Affiliate Links and Partner Redirection</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Our website features tools and platforms from third-party partners.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Affiliate Link Disclosure</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Buttons marked with "Apply Now", "Participate Now", "Visit Website", or similar calls to action are embedded with our unique referral identifiers.
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
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Legal Basis (Art. 6(1)(f) GDPR)</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We rely on our legitimate interest in financing our free services through affiliate commissions. The processing of the redirect data is limited to the absolute minimum necessary to attribute the referral.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Your Choice</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Interaction with these affiliate links is entirely voluntary. If you do not wish for this referral attribution to occur, please visit the partner websites directly without clicking the links on our platform.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Specific Partners:</h3>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li>Respondent.io: <a href="www.respondent.io/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.respondent.io/privacy-policy</a></li>
                <li>Mercor.com: <a href="www.mercor.com/data-privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">www.mercor.com/data-privacy-policy</a></li>
              </ul>
            </section>
            
            {/* Google Services Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="google-services">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">6. Google Services</h2>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Google Analytics 4 (GA4)</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                If you have given your explicit consent via our cookie banner, we use Google Analytics to analyze website usage and improve our content.
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Provider:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland.</li>
                <li><strong>Anonymization:</strong> We utilize IP anonymization. Your IP address is shortened before being transmitted to Google servers.</li>
                <li><strong>Legal Basis:</strong> Art. 6(1)(a) GDPR (Consent).</li>
              </ul>
            </section>
            
            {/* Your Rights Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="rights">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">7. Your Rights (GDPR)</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-outside pl-5 space-y-2 text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li><strong>Right to Access (Art. 15 GDPR):</strong> Request a copy of your data.</li>
                <li><strong>Right to Rectification (Art. 16 GDPR):</strong> Correct inaccurate data.</li>
                <li><strong>Right to Erasure (Art. 17 GDPR):</strong> Request the deletion of your data.</li>
                <li><strong>Right to Restrict Processing (Art. 18 GDPR).</strong></li>
                <li><strong>Right to Data Portability (Art. 20 GDPR).</strong></li>
                <li><strong>Right to Object (Art. 21 GDPR):</strong> Object to processing based on legitimate interest.</li>
              </ul>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                To exercise these rights, please contact us at: <a href="mailto:iknnovating@gmail.com" className="text-primary hover:underline">iknnovating@gmail.com</a>
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                We do not use automated decision-making or profiling (Art. 22 GDPR) that has legal effects on you.
              </p>
            </section>
            
            {/* Right to Complain Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="complaints">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">8. Right to Complain</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                If you believe our processing of your data violates data protection law, you have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or the place of the alleged infringement (Art. 77 GDPR).
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">Lead Supervisory Authority (for iKreate Innovations OÜ):</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon)<br/>
                Tatari 39, 10134 Tallinn, Estonia<br/>
                Email: <a href="mailto:info@aki.ee" className="text-primary hover:underline">info@aki.ee</a>
              </p>
            </section>
            
            {/* International Residents Section */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="international">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">9. International Residents</h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <strong>For Residents of US States (CCPA/CPRA/VCDPA):</strong> We do not currently sell or share personal information as defined under these laws. You have rights to access, delete, and opt-out of data sales, which you can exercise by emailing <a href="mailto:iknnovating@gmail.com" className="text-primary hover:underline">iknnovating@gmail.com</a>.
              </p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <strong>For UK Residents:</strong> UK GDPR applies; your rights are as described in the GDPR section above.
              </p>
            </section>
            
            {/* Integrated Cookie Policy */}
            <section className="space-y-4 pt-6 scroll-mt-24" id="cookies-table">
              <h2 className="text-text-light dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">Integrated Cookie Policy</h2>
              <p className="text-text-light dark:text-text-dark text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">Last Updated: December 15, 2025</p>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                This Cookie Policy is an integrated part of our Privacy Policy.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">What are Cookies?</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Cookies are small text files stored by your web browser used to enhance functionality, manage preferences, or track anonymous usage behavior.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-4">How We Use Cookies</h3>
              
              {/* Cookie Table */}
              <div className="overflow-x-auto mt-6">
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
                        CookieConsent
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Cookiebot
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Stores your specific consent status
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        1 Year
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Necessary
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        __cf_bm, __cflb
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Supabase
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Security and Traffic Management
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        30 min / 1 day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Necessary
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        _ga
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Google
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Distinguishes users for Analytics (if consented)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        2 Years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Statistics
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light dark:text-text-dark">
                        _gid
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        Google
                      </td>
                      <td className="px-6 py-4 text-sm text-text-light dark:text-text-dark">
                        Distinguishes users for Analytics (if consented)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light dark:text-text-dark">
                        24 Hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Statistics
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-text-light dark:text-text-dark text-sm mt-4 text-gray-500 dark:text-gray-400">
                <strong>Note:</strong> For a dynamic, real-time list, please utilize the automated "Cookie Declaration" script provided by Cookiebot on this page, as it will accurately reflect every cookie found during the last scan.
              </p>
              
              <h3 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] pt-6">Managing Cookies</h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                You can withdraw consent for Statistics cookies at any time via the "Cookie Settings" link in our footer. You can also disable cookies entirely in your browser settings; however, this may impair the basic functionality of the website.
              </p>
            </section>
            
          </article>
        </div>
      </div>
    </div>
  );
}