/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1A3D7C",
        "secondary": "#28A745",
        "background-light": "#F8F9FA",
        "background-dark": "#101822",
        "text-light": "#212529",
        "text-dark": "#E9ECEF",
        "text-muted-light": "#6c757d",
        "text-muted-dark": "#adb5bd",
        "border-light": "#E9ECEF",
        "border-dark": "#343a40",
        "card-light": "#FFFFFF",
        "card-dark": "#18212c",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}