/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "cards-bg": "var(--color-cards-bg)",
        "cards-hover-bg": "var(--color-cards-hover-bg)",
        accent: "var(--color-accent)",
        "accent-secondary": "var(--color-accent-secondary)",
        text: "var(--color-text)",
        "login-bg": "var(--color-login-bg)",
        "login-card-bg": "var(--color-login-card-bg)",
      },
    },
  },
  plugins: [],
};
