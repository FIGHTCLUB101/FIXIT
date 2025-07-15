

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#181c2f] via-[#232946] to-[#1a1f36] flex items-center justify-center px-6 py-12">
      <section className="relative w-full max-w-3xl bg-[#232946] border border-[#2a2e4b] shadow-2xl rounded-3xl p-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold text-[#eebf3f] drop-shadow-lg mb-6 tracking-tight flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#eebf3f"/>
            <path d="M12 28L28 12" stroke="#232946" strokeWidth="3" strokeLinecap="round"/>
            <path d="M12 12L28 28" stroke="#232946" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          FIXIT
        </h1>
        <p className="text-lg md:text-xl text-[#b8bcd9] mb-10 leading-relaxed max-w-xl">
          Empowering citizens to report issues in government institutions and drive accountability. Upload photos, describe problems, and help improve your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold bg-[#eebf3f] text-[#232946] rounded-xl shadow-md hover:bg-[#ffd966] transition-all w-full sm:w-auto text-center"
              aria-label="Submit a new report"
            >
              Submit a Report
            </a>
          </Link>
          <Link href="/dashboard" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold border-2 border-[#eebf3f] text-[#eebf3f] rounded-xl shadow-md hover:bg-[#eebf3f]/10 transition-all w-full sm:w-auto text-center"
              aria-label="Go to the dashboard"
            >
              Dashboard
            </a>
          </Link>
        </div>
        <footer className="mt-10 text-[#b8bcd9] text-sm">
          &copy; {new Date().getFullYear()} Civic Report Platform. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
