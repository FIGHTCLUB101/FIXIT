import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

export default function ReportPage() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [status, setStatus] = useState('');
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCaptcha = (token: string | null) => {
    if (token) setCaptchaToken(token);
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
    if (typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setReportId('');
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
        captchaToken,
        lang,
      });
      if (res.data.success) {
        setStatus(t('submission_success'));
        setReportId(res.data.id);
        setMessage('');
        setImage(null);
        setCaptchaToken('');
      } else {
        setStatus(t('submission_error'));
      }
    } catch {
      setStatus(t('submission_error'));
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">{t('report_title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2"
          rows={4}
          placeholder={t('describe_issue')}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImage} className="w-full" />
        <select value={lang} onChange={handleLangChange} className="w-full border p-2">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
        <ReCAPTCHA
          sitekey="YOUR_RECAPTCHA_SITE_KEY" // replace with your real key
          onChange={handleCaptcha}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? t('submit') + '...' : t('submit')}
        </button>
      </form>
      {status && <p className="mt-2 text-green-700">{status}</p>}
      {reportId && (
        <p className="mt-2 text-green-700">
          Your report ID: <strong>{reportId}</strong>. Save this to check status later.
        </p>
      )}
    </div>
  );
}
