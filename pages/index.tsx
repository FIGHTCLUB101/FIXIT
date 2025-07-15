// import React from 'react';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import ReCAPTCHA from 'react-google-recaptcha';
// import axios from 'axios';

// export default function ReportPage() {
//   const { t, i18n } = useTranslation();
//   const [message, setMessage] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [captchaToken, setCaptchaToken] = useState('');
//   const [status, setStatus] = useState('');
//   const [reportId, setReportId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [lang, setLang] = useState(i18n.language);

//   const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleCaptcha = (token: string | null) => {
//     if (token) setCaptchaToken(token);
//   };

//   const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setLang(e.target.value);
//     if (typeof i18n.changeLanguage === 'function') {
//       i18n.changeLanguage(e.target.value);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus('');
//     setReportId('');
//     try {
//       let imageUrl = '';
//       if (image) {
//         const formData = new FormData();
//         formData.append('file', image);
//         const res = await axios.post('/api/image-upload', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         imageUrl = res.data.url;
//       }
//       const res = await axios.post('/api/submit-report', {
//         message,
//         image: imageUrl,
//         captchaToken,
//         lang,
//       });
//       if (res.data.success) {
//         setStatus(t('submission_success'));
//         setReportId(res.data.id);
//         setMessage('');
//         setImage(null);
//         setCaptchaToken('');
//       } else {
//         setStatus(t('submission_error'));
//       }
//     } catch {
//       setStatus(t('submission_error'));
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="p-4 max-w-lg mx-auto">
//       <h1 className="text-xl font-bold mb-4">{t('report_title')}</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <textarea
//           className="w-full border p-2"
//           rows={4}
//           placeholder={t('describe_issue')}
//           value={message}
//           onChange={e => setMessage(e.target.value)}
//           required
//         />
//         <input type="file" accept="image/*" onChange={handleImage} className="w-full" />
//         <select value={lang} onChange={handleLangChange} className="w-full border p-2">
//           <option value="en">English</option>
//           <option value="hi">हिन्दी</option>
//         </select>
//         <ReCAPTCHA
//           sitekey="YOUR_RECAPTCHA_SITE_KEY" // replace with your real key
//           onChange={handleCaptcha}
//           className="mb-4"
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? t('submit') + '...' : t('submit')}
//         </button>
//       </form>
//       {status && <p className="mt-2 text-green-700">{status}</p>}
//       {reportId && (
//         <p className="mt-2 text-green-700">
//           Your report ID: <strong>{reportId}</strong>. Save this to check status later.
//         </p>
//       )}
//     </div>
//   );
// }

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import '../i18n/config'; // Initialize i18n

export default function ReportPage() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Hostel');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [status, setStatus] = useState('');
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setStatus('Only image files are allowed.');
        setImage(null);
        setPreview(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStatus('File size must be less than 5MB.');
        setImage(null);
        setPreview(null);
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleCaptcha = (token: string | null) => {
    if (token) setCaptchaToken(token);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setReportId('');

    // Validation
    if (!message || !email || !category) {
      setStatus('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const res = await axios.post('/api/image-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = res.data.url;
      }

      const res = await axios.post('/api/submit-report', {
        message,
        image: imageUrl,
        language: lang,
        category,
        email,
        captchaToken,
      });

      if (res.data.success) {
        setStatus(t('submission_success'));
        setReportId(res.data.id);
        setMessage('');
        setEmail('');
        setImage(null);
        setPreview(null);
        setCaptchaToken('');
      } else {
        setStatus(t('submission_error'));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      setStatus(error?.response?.data?.message || t('submission_error'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {t('report_title')}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Your Email *
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Category *
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Description *
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder={t('describe_issue')}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
              {preview && (
                <div className="mt-3 flex justify-center">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-48 h-48 object-contain rounded-lg border border-gray-300 shadow"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Language
              </label>
              <select
                value={lang}
                onChange={handleLangChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>

            {process.env.NODE_ENV === 'production' && (
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={handleCaptcha}
                className="mb-4"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200"
              disabled={loading}
            >
              {loading ? t('submit') + '...' : t('submit')}
            </button>
          </form>

          {status && (
            <div className={`mt-6 p-4 rounded-lg ${
              status.includes('success') || status.includes('सफल')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {status}
            </div>
          )}

          {reportId && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
              <p className="font-semibold">
                Your report ID: <span className="font-mono">{reportId}</span>
              </p>
              <p className="text-sm mt-1">
                Save this ID to track your report status later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}