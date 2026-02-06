/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fira: ["var(--font-fira)"],
        vt: ["var(--font-vt)"],
        ibm: ["var(--font-ibm)"],
      },
    },
  },
  plugins: [],
}
