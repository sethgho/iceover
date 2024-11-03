import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        logoBlue: "#049BDF",
        iceBlue: "#A0D8E1", // Soft ice blue
        snowWhite: "#FFFFFF", // Bright white like fresh snow
        frostGray: "#B0C4DE", // Light gray for frosty feel
        rinkBlue: "#3C8DA5", // Deeper blue reminiscent of rink markings
        skateBlack: "#1C1C1C", // Dark color for contrast
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
