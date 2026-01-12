const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("tailwindcss-radix")()],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: "var(--terminal-black)", // Background: Cool Light Gray / Dark Mode: Deep Black
          panel: "var(--terminal-panel)", // Panel: Pure White / Dark Mode: Zinc 900
          surface: "var(--terminal-surface)", // Surface: Slightly darker gray / Dark Mode: Zinc 800
          highlight: "var(--terminal-highlight)", // Highlight: Hover gray / Dark Mode: Zinc 700
          border: "var(--terminal-border)", // Borders: Soft gray / Dark Mode: White 10%
          active: "var(--terminal-active)", // Active: Medium gray / Dark Mode: Zinc 600
          white: "var(--terminal-white)", // Text: Almost Black (Inverted) / Dark Mode: White
          dim: "var(--terminal-dim)", // Dim text: Cool Gray 500 / Dark Mode: Neutral 400
          tech: "var(--terminal-tech)", // Tech text: Cool Gray 400 / Dark Mode: Zinc 400
        },
        bronco: {
          black: "#111111", // Keeping explicit dark
          white: "#ffffff",
          yellow: "#FF5500",
          gray: "#F3F4F6",   // Mapped to light surface
          orange: "#FF5500",
        },
        grey: {
          0: "#FFFFFF",
          5: "#FAFAFA",
          10: "#F4F4F5",
          20: "#E4E4E7",
          30: "#D4D4D8",
          40: "#A1A1AA",
          50: "#71717A",
          60: "#52525B",
          70: "#3F3F46",
          80: "#27272A",
          90: "#18181B",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Nunito", "sans-serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",
        ],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #121212",
        "hard-sm": "2px 2px 0px 0px #121212",
        "hard-lg": "8px 8px 0px 0px #121212",
      },
      textShadow: {
        hard: "2px 2px 0 #121212",
        none: "none",
      },
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
    },
  },
}
