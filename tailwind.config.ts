import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "tertiary-fixed-dim": "#ffafd3",
        tertiary: "#a12e70",
        "on-secondary-fixed": "#001a42",
        outline: "#7e7385",
        error: "#ba1a1a",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "surface-bright": "#f8f9ff",
        "on-tertiary-fixed-variant": "#85145a",
        "on-surface-variant": "#4d4354",
        "primary-fixed-dim": "#ddb7ff",
        "surface-container": "#e5eeff",
        "on-secondary-fixed-variant": "#004395",
        "tertiary-container": "#c0488a",
        "on-background": "#0b1c30",
        "secondary-fixed-dim": "#adc6ff",
        "on-primary-fixed": "#2c0051",
        "tertiary-fixed": "#ffd8e7",
        "on-primary-container": "#fffbff",
        surface: "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-container-low": "#eff4ff",
        "primary-container": "#9c48ea",
        background: "#f8f9ff",
        "on-primary-fixed-variant": "#6900b3",
        secondary: "#0058be",
        primary: "#8127cf",
        "outline-variant": "#cfc2d6",
        "on-surface": "#0b1c30",
        "on-error": "#ffffff",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "secondary-container": "#2170e4",
        "surface-container-lowest": "#ffffff",
        "primary-fixed": "#f0dbff",
        "surface-container-high": "#dce9ff",
        "on-primary": "#ffffff",
        "surface-variant": "#d3e4fe",
        "inverse-primary": "#ddb7ff",
        "secondary-fixed": "#d8e2ff",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "error-container": "#ffdad6",
        "surface-tint": "#842bd2",
        "on-tertiary-fixed": "#3d0026",
        "surface-container-highest": "#d3e4fe",
        "on-secondary-container": "#fefcff"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        sm: "12px",
        gutter: "16px",
        "margin-desktop": "32px",
        base: "8px",
        md: "24px",
        xs: "4px",
        lg: "40px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "headline-lg": ["var(--font-plus-jakarta-sans)"],
        "label-sm": ["var(--font-plus-jakarta-sans)"],
        "body-md": ["var(--font-plus-jakarta-sans)"],
        "headline-md": ["var(--font-plus-jakarta-sans)"],
        "display-xl": ["var(--font-plus-jakarta-sans)"],
        "body-lg": ["var(--font-plus-jakarta-sans)"]
      },
      fontSize: {
        "headline-lg": [
          "32px",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }
        ],
        "label-sm": ["12px", { lineHeight: "1", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
        "display-xl": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }
        ],
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "500" }]
      },
      boxShadow: {
        glass: "0 8px 32px rgba(168,85,247,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
