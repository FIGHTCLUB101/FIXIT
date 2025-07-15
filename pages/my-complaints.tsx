import { useState } from 'react';
import axios from 'axios';

interface Report {
  _id: string;
  message: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  language?: string;
  department?: string;
  priority?: string;
  slaDue?: string;
  isOverdue?: boolean;
}

export default function MyComplaints() {
  const [email, setEmail] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/reports?email=${encodeURIComponent(email)}`);
      setReports(res.data.reports);
    } catch (err: any) {
      setError('Failed to fetch complaints.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1328] text-white flex flex-col items-center p-8">
      <div className="w-full max-w-lg bg-[#1f2a48] rounded-2xl shadow-2xl p-8 mt-8">
        <h1 className="text-2xl font-bold text-purple-300 mb-6 text-center">My Complaints</h1>
        <div className="mb-4">
          <input
            type="email"
            className="w-full rounded-lg bg-[#232946] border border-[#2a2e4b] p-3 text-white mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email to view your complaints"
          />
          <button
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold text-lg shadow transition"
            onClick={fetchComplaints}
            disabled={loading || !email}
          >
            {loading ? 'Loading...' : 'View My Complaints'}
          </button>
        </div>
        {error && <div className="text-red-400 text-center mb-2">{error}</div>}
        <ul className="divide-y divide-[#2d3652]">
          {reports.map(report => (
            <li key={report._id} className="py-4">
              <div className="font-semibold text-gray-100">{report.message}</div>
              <div className="text-xs text-purple-300 font-semibold">{report.category || 'Uncategorized'}</div>
              <div className="text-xs text-blue-300 font-semibold">{report.department || 'N/A'}</div>
              <div className="text-xs text-yellow-300 font-semibold">{report.priority || 'N/A'}</div>
              <div className="text-xs text-gray-400">Status: {report.status}</div>
              {report.isOverdue && <div className="text-xs text-red-400 font-bold">Overdue!</div>}
              {report.slaDue && !report.isOverdue && report.status !== 'Resolved' && (
                <div className="text-xs text-gray-400">SLA: {new Date(report.slaDue).toLocaleString()}</div>
              )}
              <div className="text-xs text-gray-500">Submitted: {new Date(report.createdAt).toLocaleString()}</div>
              {report.image && (
                <img src={report.image} alt="Report" className="w-32 mt-2 rounded border border-purple-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
