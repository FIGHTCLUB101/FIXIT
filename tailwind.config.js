module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",   // Add this line for Next.js pages
    "./components/**/*.{js,ts,jsx,tsx}", // If you have a components folder
    "./app/**/*.{js,ts,jsx,tsx}", // For Next.js 13+ app directory (optional)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};