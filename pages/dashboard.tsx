import { useEffect, useState } from 'react';
import axios from 'axios';

interface Report {
  _id: string;
  message: string;
  image?: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const pageSize = 5;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const res = await axios.get(`/api/reports?page=${page}&pageSize=${pageSize}`);
      setReports(res.data.reports);
      setTotal(res.data.total);
      setLoading(false);
    };
    fetchReports();
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex min-h-screen bg-[#0e1328] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a203f] p-6 space-y-6 hidden md:block">
        <div className="text-2xl font-bold text-purple-400">FIXIT</div>
        <nav className="space-y-2">
          <button className="block w-full text-left text-white hover:text-purple-400">Dashboard</button>
          <button className="block w-full text-left text-white hover:text-purple-400">Reports</button>
          <button className="block w-full text-left text-white hover:text-purple-400">Analytics</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-purple-300">Complaints Dashboard</h1>
          <div className="text-sm text-gray-400">Page {page} of {totalPages || 1}</div>
        </header>

        {/* Chart */}
        <div className="bg-[#1f2a48] rounded-2xl p-4 shadow">
          <h2 className="text-xl font-bold text-purple-200 mb-4">Reports Overview</h2>
          <div className="w-full h-48 bg-[#101735] rounded-lg flex items-center justify-center text-purple-500">
            [ Chart Placeholder ]
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-[#1f2a48] rounded-2xl p-6 shadow space-y-6">
          {loading ? (
            <div className="text-center text-purple-300 font-semibold">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-gray-400">No complaints found.</div>
          ) : (
            <ul className="divide-y divide-[#2d3652]">
              {reports.map((report) => (
                <li key={report._id} className="py-6">
                  <div className="text-lg font-semibold text-gray-100 mb-1">{report.message}</div>
                  <div className="text-sm text-gray-400">
                    Status: <span className={report.status === 'flagged' ? 'text-red-400' : 'text-green-400'}>{report.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">Submitted: {new Date(report.createdAt).toLocaleString()}</div>
                  {report.image && (
                    <div className="mt-4">
                      <button
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold shadow transition"
                        onClick={() => setOpenImage(openImage === report._id ? null : report._id)}
                      >
                        {openImage === report._id ? 'Hide Image' : 'Click here to see the image'}
                      </button>
                      {openImage === report._id && (
                        <div className="mt-3">
                          <img
                            src={report.image}
                            alt="Report"
                            className="w-64 max-w-full h-auto object-contain rounded-xl border border-purple-500 shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-300"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-purple-300 font-semibold">Page {page} of {totalPages || 1}</span>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-300"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}