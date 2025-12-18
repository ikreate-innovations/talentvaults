import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
          
          {/* Logo, Copyright, and Contact - Left Side */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-12 gap-6">
              {/* Logo and Copyright */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-8 text-white">
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white">TalentVaults</span>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    © 2025 TalentVaults. All rights reserved.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Curated opportunities for senior professionals.
                  </p>
                </div>
              </div>
              
              {/* Contact Section - Beside logo */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base mb-4 pb-1 border-b border-gray-800 w-fit">
                  Contact
                </h3>
                <div className="flex flex-col gap-3">
                  <p className="text-gray-300 text-xs mb-1">
                    Have questions or need support?
                  </p>
                  <a 
                    href="mailto:iknnovating@gmail.com"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 group text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="font-medium">iknnovating@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legal Links - Right Side (Fixed with responsive alignment) */}
          <div className="flex flex-col lg:col-span-2">
            <div className="w-full max-w-[200px] lg:ml-auto">
              <h3 className="text-white font-semibold text-base mb-4 pb-1 border-b border-gray-800 w-fit">
                Legal
              </h3>
              <div className="flex flex-col gap-2">
                <Link 
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-1 hover:translate-x-1 transform text-sm"
                  href="/legal/terms"
                >
                  Terms of Service
                </Link>
                <Link 
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-1 hover:translate-x-1 transform text-sm"
                  href="/legal/privacy"
                >
                  Privacy Policy
                </Link>
                <Link 
                  className="text-gray-300 hover:text-white transition-colors duration-200 py-1 hover:translate-x-1 transform text-sm"
                  href="/legal/imprint"
                >
                  Imprint
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}