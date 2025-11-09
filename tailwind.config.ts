/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        // Override Tailwind's red palette so all red-* classes use the requested hex
        red: {
          50:  '#B91C1C',
          100: '#B91C1C',
          200: '#B91C1C',
          300: '#B91C1C',
          400: '#B91C1C',
          500: '#B91C1C',
          600: '#B91C1C',
          700: '#B91C1C',
          800: '#B91C1C',
          900: '#B91C1C',
        },
      },
    },
  },
  plugins: [],
};
export default config;
