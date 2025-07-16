import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#181c2f] via-[#232946] to-[#1a1f36] flex items-center justify-center px-6 py-12">
      <section className="relative w-full max-w-3xl bg-[#232946] border border-[#2a2e4b] shadow-2xl rounded-3xl p-10 flex flex-col items-center text-center">
        {/* Animated Hero Icon */}
        <div className="mb-6 animate-bounce">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="30" fill="#eebf3f" />
            <path d="M18 42L42 18" stroke="#232946" strokeWidth="4" strokeLinecap="round" />
            <path d="M18 18L42 42" stroke="#2a304fff" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-[#eebf3f] drop-shadow-lg mb-4 tracking-tight flex items-center gap-3">
          FIXIT
        </h1>
        <p className="text-lg md:text-xl text-[#b8bcd9] mb-8 leading-relaxed max-w-xl">
          Empowering students to report issues in educational institutions and drive accountability.<br />
          <span className="text-purple-300 font-semibold">Upload photos, describe problems, and help improve our college.</span>
        </p>
        {/* Modern Button Group */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-6">
          <Link href="/submit-report" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#eebf3f] to-[#ffd966] text-[#232946] rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all w-full sm:w-auto text-center"
              aria-label="Submit a new report"
            >
              Submit a Report
            </a>
          </Link>
          <Link href="/dashboard" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold border-2 border-[#eebf3f] text-[#eebf3f] rounded-xl shadow-md hover:bg-[#eebf3f]/10 hover:scale-105 transition-all w-full sm:w-auto text-center"
              aria-label="Go to the dashboard"
            >
              Dashboard
            </a>
          </Link>
          <Link href="/my-complaints" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold border-2 border-[#a855f7] text-[#a855f7] rounded-xl shadow-md hover:bg-[#a855f7]/10 hover:scale-105 transition-all w-full sm:w-auto text-center"
              aria-label="View my complaints"
            >
              My Complaints
            </a>
          </Link>
          <Link href="/track-report" legacyBehavior>
            <a
              className="px-8 py-3 text-lg font-semibold border-2 border-[#38bdf8] text-[#38bdf8] rounded-xl shadow-md hover:bg-[#38bdf8]/10 hover:scale-105 transition-all w-full sm:w-auto text-center"
              aria-label="Track a report"
            >
              Track Report
            </a>
          </Link>
        </div>
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          <div className="bg-[#181c2f] rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2 text-[#eebf3f]">📸</span>
            <span className="text-lg text-purple-200 font-semibold">Photo Evidence</span>
            <span className="text-sm text-[#b8bcd9] mt-2">Attach images to your reports for better clarity.</span>
          </div>
          <div className="bg-[#181c2f] rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2 text-[#38bdf8]">⏱️</span>
            <span className="text-lg text-purple-200 font-semibold">Track Progress</span>
            <span className="text-sm text-[#b8bcd9] mt-2">Monitor status and resolution time for every complaint.</span>
          </div>
          <div className="bg-[#181c2f] rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2 text-[#a855f7]">🗂️</span>
            <span className="text-lg text-purple-200 font-semibold">Department Routing</span>
            <span className="text-sm text-[#b8bcd9] mt-2">Complaints are auto-assigned to relevant departments.</span>
          </div>
          <div className="bg-[#181c2f] rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-3xl mb-2 text-[#ef4444]">⚡</span>
            <span className="text-lg text-purple-200 font-semibold">SLA Alerts</span>
            <span className="text-sm text-[#b8bcd9] mt-2">Overdue complaints are flagged for quick action.</span>
          </div>
        </div>
        <footer className="mt-10 text-[#b8bcd9] text-sm">
          &copy; {new Date().getFullYear()} Civic Report Platform. All rights reserved.
        </footer>
      </section>
    </main>
  );
}
