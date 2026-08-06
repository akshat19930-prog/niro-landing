import type { Config } from "tailwindcss";

/**
 * Tailwind is mapped onto the Leo/Niro design tokens (CSS custom properties
 * defined in app/tokens.css). Utilities resolve to `var(--…)` so the token
 * files remain the single source of truth — no hard-coded hex/px here.
 * Dark surfaces are driven by the scoped `[data-theme="dark"]` block in
 * tokens.css (used only for the emergency story), so no `dark:` variants needed.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    // Replace defaults so only token-backed values are available.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",

      // Raw scales (escape hatches)
      forest: {
        950: "var(--forest-950)",
        900: "var(--forest-900)",
        800: "var(--forest-800)",
        700: "var(--forest-700)",
        600: "var(--forest-600)",
        500: "var(--forest-500)",
        400: "var(--forest-400)",
        300: "var(--forest-300)",
        200: "var(--forest-200)",
        100: "var(--forest-100)",
      },
      gold: {
        700: "var(--gold-700)",
        600: "var(--gold-600)",
        500: "var(--gold-500)",
        400: "var(--gold-400)",
        300: "var(--gold-300)",
        100: "var(--gold-100)",
      },
      ivory: "var(--ivory)",
      sand: {
        50: "var(--sand-50)",
        100: "var(--sand-100)",
        200: "var(--sand-200)",
        300: "var(--sand-300)",
      },
      ink: {
        900: "var(--ink-900)",
        700: "var(--ink-700)",
        500: "var(--ink-500)",
        400: "var(--ink-400)",
      },
      success: "var(--success)",
      danger: "var(--danger)",
      info: "var(--info)",
      wa: {
        bg: "var(--wa-bg)",
        in: "var(--wa-in)",
        out: "var(--wa-out)",
      },

      // Semantic aliases (theme-aware)
      page: "var(--bg-page)",
      inset: "var(--bg-inset)",
      surface: {
        card: "var(--surface-card)",
        raised: "var(--surface-raised)",
        brand: "var(--surface-brand)",
      },
      strong: "var(--text-strong)",
      body: "var(--text-body)",
      muted: "var(--text-muted)",
      "on-brand": "var(--text-on-brand)",
      "on-accent": "var(--text-on-accent)",
      brand: {
        DEFAULT: "var(--brand)",
        hover: "var(--brand-hover)",
        press: "var(--brand-press)",
        soft: "var(--brand-soft)",
      },
      accent: {
        DEFAULT: "var(--accent)",
        strong: "var(--accent-strong)",
        soft: "var(--accent-soft)",
      },
      border: {
        DEFAULT: "var(--border)",
        strong: "var(--border-strong)",
      },
    },
    fontFamily: {
      display: "var(--font-display)",
      sans: "var(--font-sans)",
    },
    fontSize: {
      xs: "var(--text-xs)",
      sm: "var(--text-sm)",
      base: "var(--text-base)",
      md: "var(--text-md)",
      lg: "var(--text-lg)",
      xl: "var(--text-xl)",
      "2xl": "var(--text-2xl)",
      "3xl": "var(--text-3xl)",
      "4xl": "var(--text-4xl)",
    },
    fontWeight: {
      regular: "var(--weight-regular)",
      medium: "var(--weight-medium)",
      semibold: "var(--weight-semibold)",
      bold: "var(--weight-bold)",
    },
    lineHeight: {
      tight: "var(--leading-tight)",
      snug: "var(--leading-snug)",
      body: "var(--leading-body)",
    },
    letterSpacing: {
      tight: "var(--tracking-tight)",
      normal: "var(--tracking-normal)",
      wide: "var(--tracking-wide)",
    },
    borderRadius: {
      none: "0",
      xs: "var(--radius-xs)",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      pill: "var(--radius-pill)",
      full: "9999px",
    },
    boxShadow: {
      1: "var(--shadow-1)",
      2: "var(--shadow-2)",
      3: "var(--shadow-3)",
      brand: "var(--shadow-brand)",
      inset: "var(--shadow-inset)",
      none: "none",
    },
    extend: {
      spacing: {
        s1: "var(--space-1)",
        s2: "var(--space-2)",
        s3: "var(--space-3)",
        s4: "var(--space-4)",
        s5: "var(--space-5)",
        s6: "var(--space-6)",
        s7: "var(--space-7)",
        s8: "var(--space-8)",
        s9: "var(--space-9)",
        gutter: "var(--gutter)",
      },
      maxWidth: {
        container: "var(--container)",
        "container-narrow": "var(--container-narrow)",
      },
      transitionTimingFunction: {
        calm: "var(--ease-calm)",
        inout: "var(--ease-inout)",
      },
      transitionDuration: {
        fast: "160ms",
        base: "240ms",
        slow: "320ms",
      },
      backgroundImage: {
        jaali: "var(--jaali)",
      },
    },
  },
  plugins: [],
};

export default config;
