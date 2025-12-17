import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo on the left */}
        <div className="flex flex-1 items-center">
          <Link className="flex items-center gap-3 p-2 rounded-lg bg-white" href="/">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] text-gray-900 bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #1A3D7C, #28A745)', color: 'transparent' }}>TalentVaults</h2>
          </Link>
        </div>

        {/* Navigation - Now on the very right side */}
        <nav className="flex items-center justify-end gap-6">
          <Link className="hidden md:inline text-base font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="/jobs">
            Remote Work
          </Link>
          <Link className="hidden md:inline text-base font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="/research">
            Surveys
          </Link>
          <Link className="hidden md:inline text-base font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="/tools">
            Digital Tools
          </Link>
          {/* NEW: Vetting Process Link */}
          <Link className="hidden md:inline text-base font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="/vetting-process">
            Vetting Process
          </Link>
        </nav>
      </div>
    </header>
  );
}