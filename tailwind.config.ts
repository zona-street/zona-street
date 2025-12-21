import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zona Street Brand Colors
        "orange-street": {
          DEFAULT: "#F57C00",
          50: "#FFE5CC",
          100: "#FFD9B3",
          200: "#FFC180",
          300: "#FFA94D",
          400: "#FF911A",
          500: "#F57C00",
          600: "#C26300",
          700: "#8F4A00",
          800: "#5C3100",
          900: "#291800",
        },
        "blue-street": {
          DEFAULT: "#2962FF",
          50: "#D6E4FF",
          100: "#C2D9FF",
          200: "#99C2FF",
          300: "#70ABFF",
          400: "#4787FF",
          500: "#2962FF",
          600: "#0043E6",
          700: "#0033B3",
          800: "#002380",
          900: "#00134D",
        },
        // Off-white background
        "off-white": "#F5F5F5",
        // ShadcnUI Base Colors (mantidas para compatibilidade)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontWeight: {
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      boxShadow: {
        // Neobrutalismo - sombras projetadas marcadas
        brutal: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-lg": "6px 6px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-xl": "8px 8px 0px 0px rgba(0, 0, 0, 1)",
        // Sombras coloridas para elementos especiais
        "brutal-orange": "4px 4px 0px 0px #F57C00",
        "brutal-blue": "4px 4px 0px 0px #2962FF",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
