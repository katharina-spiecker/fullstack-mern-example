import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/App.tsx",
    "./src/Layout.tsx"
  ],
  plugins: [daisyui]
}