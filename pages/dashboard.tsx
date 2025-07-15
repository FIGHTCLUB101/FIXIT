// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import Papa from 'papaparse';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface Report {
//   _id: string;
//   message: string;
//   image?: string;
//   status: string;
//   createdAt: string;
//   updatedAt?: string;
//   category?: string;
//   language?: string;
// }

//   const [reports, setReports] = useState<Report[]>([]);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [openImage, setOpenImage] = useState<string | null>(null);
//   const [category, setCategory] = useState<string>('All');
//   const pageSize = 5;

//   useEffect(() => {
//     const fetchReports = async () => {
//       setLoading(true);
//       const res = await axios.get(`/api/reports?page=${page}&pageSize=${pageSize}&category=${category}`);
//       setReports(res.data.reports);
//       setTotal(res.data.total);
//       setLoading(false);
//     };
//     fetchReports();
//   }, [page, category]);

//   // Analytics: Count by category and status
//   const categoryCounts = reports.reduce((acc, r) => {
//     const cat = r.category || 'Uncategorized';
//     acc[cat] = (acc[cat] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);
//   const statusCounts = reports.reduce((acc, r) => {
//     const s = r.status || 'Unknown';
//     acc[s] = (acc[s] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const chartData = {
//     labels: Object.keys(categoryCounts),
//     datasets: [
//       {
//         label: 'Reports by Category',
//         data: Object.values(categoryCounts),
//         backgroundColor: 'rgba(168, 85, 247, 0.7)',
//       },
//     ],
//   };

//   const totalPages = Math.ceil(total / pageSize);

//   return (
//     <div className="flex min-h-screen bg-[#0e1328] text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#1a203f] p-6 space-y-6 hidden md:block">
//         <div className="text-2xl font-bold text-purple-400">FIXIT</div>
//         <nav className="space-y-2">
//           <button className="block w-full text-left text-white hover:text-purple-400">Dashboard</button>
//           <button className="block w-full text-left text-white hover:text-purple-400">Reports</button>
//           <button className="block w-full text-left text-white hover:text-purple-400">Analytics</button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 space-y-8">
//         <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <h1 className="text-3xl font-semibold text-purple-300">Complaints Dashboard</h1>
//           <div className="flex items-center gap-4">
//             <label className="text-sm text-purple-200 font-semibold">Category:</label>
//             <select
//               className="rounded bg-[#232946] border border-[#2a2e4b] p-2 text-white"
//               value={category}
//               onChange={e => { setCategory(e.target.value); setPage(1); }}
//             >
//               <option value="All">All</option>
//               <option value="Hostel">Hostel</option>
//               <option value="Academic Block">Academic Block</option>
//               <option value="Garden">Garden</option>
//               <option value="Temple">Temple</option>
//               <option value="Road">Road</option>
//               <option value="Mess">Mess</option>
//               <option value="Other">Other</option>
//             </select>
//             <div className="text-sm text-gray-400">Page {page} of {totalPages || 1}</div>
//           </div>
//         </header>

//         {/* Chart */}
//         <div className="bg-[#1f2a48] rounded-2xl p-4 shadow">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <h2 className="text-xl font-bold text-purple-200 mb-4">Reports Overview</h2>
//             <button
//               className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold shadow transition mb-4 md:mb-0"
//               onClick={() => {
//                 const csv = Papa.unparse(reports.map(r => ({
//                   Message: r.message,
//                   Category: r.category,
//                   Status: r.status,
//                   CreatedAt: r.createdAt,
//                   UpdatedAt: r.updatedAt,
//                   Language: r.language,
//                 })));
//                 const blob = new Blob([csv], { type: 'text/csv' });
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement('a');
//                 a.href = url;
//                 a.download = 'reports.csv';
//                 a.click();
//                 URL.revokeObjectURL(url);
//               }}
//             >
//               Export CSV
//             </button>
//           </div>
//           <div className="w-full h-64 bg-[#101735] rounded-lg flex items-center justify-center">
//             <Bar data={chartData} options={{
//               responsive: true,
//               plugins: {
//                 legend: { display: false },
//                 title: { display: false },
//               },
//               scales: {
//                 x: { ticks: { color: '#a855f7' } },
//                 y: { ticks: { color: '#a855f7' } },
//               },
//             }} />
//           </div>
//         </div>

//         {/* Reports List */}
//         <div className="bg-[#1f2a48] rounded-2xl p-6 shadow space-y-6">
//           {loading ? (
//             <div className="text-center text-purple-300 font-semibold">Loading...</div>
//           ) : reports.length === 0 ? (
//             <div className="text-center text-gray-400">No complaints found.</div>
//           ) : (
//             <ul className="divide-y divide-[#2d3652]">
//               {reports.map((report) => (
//                 <li key={report._id} className="py-6">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
//                     <div className="text-lg font-semibold text-gray-100">{report.message}</div>
//                     <div className="text-xs text-purple-300 font-semibold">{report.category || 'Uncategorized'}</div>
//                   </div>
//                   <div className="text-sm text-gray-400 flex items-center gap-2">
//                     Status:
//                     <select
//                       className="rounded bg-[#232946] border border-[#2a2e4b] p-1 text-white text-xs"
//                       value={report.status}
//                       onChange={async (e) => {
//                         const newStatus = e.target.value;
//                         await axios.put(`/api/reports`, { id: report._id, status: newStatus });
//                         setReports(reports => reports.map(r => r._id === report._id ? { ...r, status: newStatus } : r));
//                       }}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Resolved">Resolved</option>
//                     </select>
//                   </div>
//                   <div className="text-xs text-gray-500">Submitted: {new Date(report.createdAt).toLocaleString()}</div>
//                   {report.image && (
//                     <div className="mt-4">
//                       <button
//                         className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold shadow transition"
//                         onClick={() => setOpenImage(openImage === report._id ? null : report._id)}
//                       >
//                         {openImage === report._id ? 'Hide Image' : 'Click here to see the image'}
//                       </button>
//                       {openImage === report._id && (
//                         <div className="mt-3">
//                           <img
//                             src={report.image}
//                             alt="Report"
//                             className="w-64 max-w-full h-auto object-contain rounded-xl border border-purple-500 shadow-lg"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <button
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-300"
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//           >
//             Previous
//           </button>
//           <span className="text-purple-300 font-semibold">Page {page} of {totalPages || 1}</span>
//           <button
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-300"
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages || totalPages === 0}
//           >
//             Next
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Papa from 'papaparse';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Report {
  _id: string;
  message: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  language?: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('All');
  const pageSize = 5;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const res = await axios.get(`/api/reports?page=${page}&pageSize=${pageSize}&category=${category}`);
      setReports(res.data.reports);
      setTotal(res.data.total);
      setLoading(false);
    };
    fetchReports();
  }, [page, category]);

  // Analytics: Count by category and status
  const categoryCounts = reports.reduce((acc, r) => {
    const cat = r.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusCounts = reports.reduce((acc, r) => {
    const s = r.status || 'Unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Reports by Category',
        data: Object.values(categoryCounts),
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
      },
    ],
  };

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
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-3xl font-semibold text-purple-300">Complaints Dashboard</h1>
          <div className="flex items-center gap-4">
            <label className="text-sm text-purple-200 font-semibold">Category:</label>
            <select
              className="rounded bg-[#232946] border border-[#2a2e4b] p-2 text-white"
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="All">All</option>
              <option value="Hostel">Hostel</option>
              <option value="Academic Block">Academic Block</option>
              <option value="Garden">Garden</option>
              <option value="Temple">Temple</option>
              <option value="Road">Road</option>
              <option value="Mess">Mess</option>
              <option value="Other">Other</option>
            </select>
            <div className="text-sm text-gray-400">Page {page} of {totalPages || 1}</div>
          </div>
        </header>

        {/* Chart */}
        <div className="bg-[#1f2a48] rounded-2xl p-4 shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-purple-200 mb-4">Reports Overview</h2>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold shadow transition mb-4 md:mb-0"
              onClick={() => {
                const csv = Papa.unparse(reports.map(r => ({
                  Message: r.message,
                  Category: r.category,
                  Status: r.status,
                  CreatedAt: r.createdAt,
                  UpdatedAt: r.updatedAt,
                  Language: r.language,
                })));
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'reports.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>
          <div className="w-full h-64 bg-[#101735] rounded-lg flex items-center justify-center">
            <Bar data={chartData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                x: { ticks: { color: '#a855f7' } },
                y: { ticks: { color: '#a855f7' } },
              },
            }} />
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                    <div className="text-lg font-semibold text-gray-100">{report.message}</div>
                    <div className="text-xs text-purple-300 font-semibold">{report.category || 'Uncategorized'}</div>
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    Status:
                    <select
                      className="rounded bg-[#232946] border border-[#2a2e4b] p-1 text-white text-xs"
                      value={report.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await axios.put(`/api/reports`, { id: report._id, status: newStatus });
                        setReports(reports => reports.map(r => r._id === report._id ? { ...r, status: newStatus } : r));
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
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