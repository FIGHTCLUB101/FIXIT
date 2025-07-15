import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const [category, setCategory] = useState('Hostel');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        setImage(null);
        setPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setImage(null);
        setPreview(null);
        return;
      }
    }
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!message || !image || !category || !email) {
      setError('Please provide your email, a description, select a category, and select an image.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      // 1. Upload image to your /api/image-upload endpoint
      const formData = new FormData();
      formData.append('file', image);

      const uploadRes = await axios.post('/api/image-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      // 2. Submit report with image URL
      const res = await axios.post('/api/submit-report', {
        message,
        image: uploadRes.data.url,
        language,
        category,
        email,
      });

      setSuccess(`Report submitted successfully! Your Report ID: ${res.data.id}`);
      setMessage('');
      setImage(null);
      setPreview(null);
      setEmail('');
      setProgress(0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit report.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1328] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a203f] p-6 space-y-6 hidden md:block">
        <div className="text-2xl font-bold text-purple-400">YoraUI</div>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block w-full text-left text-white hover:text-purple-400">Dashboard</Link>
          <Link href="/submit-report" className="block w-full text-left text-purple-400 font-semibold">Submit Report</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg bg-[#1f2a48] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-purple-300 mb-6 text-center">Submit a Report</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Your Email</label>
              <input
                type="email"
                className="w-full rounded-lg bg-[#232946] border border-[#2a2e4b] p-3 text-white mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
              <label className="block text-sm font-semibold mb-2 text-purple-200">Category</label>
              <select
                className="w-full rounded-lg bg-[#232946] border border-[#2a2e4b] p-3 text-white mb-4"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="Hostel">Hostel</option>
                <option value="Academic Block">Academic Block</option>
                <option value="Garden">Garden</option>
                <option value="Temple">Temple</option>
                <option value="Road">Road</option>
                <option value="Mess">Mess</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Description</label>
              <textarea
                className="w-full rounded-lg bg-[#232946] border border-[#2a2e4b] p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe the issue..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-white"
                onChange={handleImageChange}
                required
                disabled={loading}
              />
              {preview && (
                <div className="mt-3 flex flex-col items-center">
                  <img src={preview} alt="Preview" className="w-40 h-40 object-contain rounded-lg border border-purple-500 shadow" />
                  {loading && (
                    <div className="w-full mt-2">
                      <div className="h-2 bg-[#232946] rounded">
                        <div
                          className="h-2 bg-purple-500 rounded transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-purple-300 mt-1 text-center">Uploading: {progress}%</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-purple-200">Language</label>
              <select
                className="w-full rounded-lg bg-[#232946] border border-[#2a2e4b] p-3 text-white"
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
            {error && <div className="text-red-400 text-center">{error}</div>}
            {success && <div className="text-green-400 text-center">{success}</div>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-bold text-lg shadow transition"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}