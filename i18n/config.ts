// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import en from './locales/en/translation.json';
// import hi from './locales/hi/translation.json';

// i18n.use(initReactI18next).init({
//   resources: { en: { translation: en }, hi: { translation: hi } },
//   lng: 'en',
//   fallbackLng: 'en',
//   interpolation: { escapeValue: false },
// });

// export default i18n;
// // config.ts placeholder

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "report_title": "Report an Issue",
      "describe_issue": "Describe the problem you observed...",
      "submit": "Submit",
      "submission_success": "Report submitted successfully!",
      "submission_error": "Error submitting report."
    }
  },
  hi: {
    translation: {
      "report_title": "समस्या रिपोर्ट करें",
      "describe_issue": "आपने जो समस्या देखी उसका वर्णन करें...",
      "submit": "जमा करें",
      "submission_success": "रिपोर्ट सफलतापूर्वक सबमिट की गई!",
      "submission_error": "रिपोर्ट सबमिट करने में त्रुटि हुई।"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;