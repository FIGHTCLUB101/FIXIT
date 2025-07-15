import { useState } from 'react';
import axios from 'axios';

export default function TrackReport() {
  const [id, setId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReport(null);
    setLoading(true);
    try {
      const res = await axios.get(`/api/track-report?id=${id}`);
      setReport(res.data.report);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e1328] text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-purple-300">Track Your Report</h1>
      <form onSubmit={handleTrack} className="space-y-4 w-full max-w-md bg-[#1f2a48] p-6 rounded-xl shadow">
        <input
          className="w-full p-3 rounded bg-[#232946] border border-[#2a2e4b] text-white"
          placeholder="Enter your Report ID"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 rounded bg-purple-600 hover:bg-purple-700 font-bold text-lg shadow transition"
          disabled={loading}
        >
          {loading ? 'Tracking...' : 'Track Report'}
        </button>
      </form>
      {error && <div className="text-red-400 mt-4">{error}</div>}
      {report && (
        <div className="mt-6 bg-[#232946] p-6 rounded-xl shadow w-full max-w-md">
          <div className="mb-2"><span className="font-semibold text-purple-200">Status:</span> {report.status}</div>
          <div className="mb-2"><span className="font-semibold text-purple-200">Category:</span> {report.category}</div>
          <div className="mb-2"><span className="font-semibold text-purple-200">Message:</span> {report.message}</div>
          <div className="mb-2"><span className="font-semibold text-purple-200">Created At:</span> {new Date(report.createdAt).toLocaleString()}</div>
          {report.image && <img src={report.image} alt="Report" className="mt-4 w-40 h-40 object-contain rounded border border-purple-500" />}
        </div>
      )}
    </div>
  );
}
