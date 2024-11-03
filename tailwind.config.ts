import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        logoBlue: "#049BDF",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        ice: ['"Iceberg"', "sans-serif"], // Custom ice-themed font (install if necessary)
      },
      spacing: {
        "18": "4.5rem", // Add a custom spacing value if needed
      },
    },
  },
  variants: {},
  plugins: [],
} satisfies Config;
