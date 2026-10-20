/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        primary: '#1363DF',
        secondary: '#0F172A',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Giữ false để không xung đột với Bootstrap hiện có
  },
}

