declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    pale?: string;
  }
  interface TypeBackground {
    dark?: string;
    alt?: string;
    deep?: string;
  }
  interface Theme {
    custom: {
      subTitle: {
        height: string;
        widthXs: number;
        widthSm: number;
        widthMd: number;
        widthLg: number;
      };
      header: {
        height: {
          mobile: number;
          desktop: number;
        };
      };
      fonts: {
        display: string;
        body: string;
        italic: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      subTitle: {
        height: string;
        widthXs: number;
        widthSm: number;
        widthMd: number;
        widthLg: number;
      };
      header: {
        height: {
          mobile: number;
          desktop: number;
        };
      };
      fonts: {
        display: string;
        body: string;
        italic: string;
      };
    };
  }
}

// 飾Love デザインシステム (2026-05-13 策定)
// Phantom-inspired Western premium × Japanese-led × copper accent

// next/font の自動生成フォント名を CSS 変数経由で参照
// (layout.tsx で <html> に --font-* 変数を付与している前提)
const FONT_DISPLAY =
  'var(--font-inter-tight), var(--font-noto-jp), "Helvetica Neue", Arial, sans-serif';
const FONT_BODY =
  'var(--font-inter), var(--font-noto-jp), "Helvetica Neue", Arial, sans-serif';
const FONT_ITALIC = 'var(--font-cormorant), serif';

export const themeConstants = {
  palette: {
    primary: {
      pale: "#FEF3E2",      // accent-soft
      light: "#D97706",
      main: "#B45309",      // warm umber (copper accent)
      dark: "#8C3E07",
      contrastText: "#FFFFFF",
    },
    secondary: {
      pale: "#F6F6F4",      // bg-alt
      light: "#9A9A9A",
      main: "#2A2A2A",      // ink-soft
      dark: "#0A0A0A",      // ink (pure)
      contrastText: "#FFFFFF",
    },
    info: {
      pale: "#FFFFFF",
      light: "#E5E5E0",     // rule
      main: "#6B6B6B",      // gray
      dark: "#0A0A0A",
    },
    warning: {
      pale: "#FEF3E2",
      light: "#FBBF24",
      main: "#D97706",
      dark: "#8C3E07",
    },
    error: {
      pale: "#FEE2E2",
      light: "#FCA5A5",
      main: "#DC2626",
      dark: "#991B1B",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
      alt: "#F6F6F4",
      deep: "#EDEDE8",
      dark: "#0A0A0A",
    },
    text: {
      primary: "#0A0A0A",
      secondary: "#6B6B6B",
      disabled: "#9A9A9A",
    },
    divider: "#E5E5E0",
  },
  typography: {
    fontFamily: FONT_BODY,
    h1: {
      fontFamily: FONT_DISPLAY,
      fontSize: "clamp(56px, 7.2vw, 108px)",
      fontWeight: 800,
      lineHeight: 0.96,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontFamily: FONT_DISPLAY,
      fontSize: "clamp(40px, 4.6vw, 64px)",
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: "-0.035em",
    },
    h3: {
      fontFamily: FONT_DISPLAY,
      fontSize: "clamp(28px, 3vw, 44px)",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
    },
    h4: {
      fontFamily: FONT_DISPLAY,
      fontSize: "22px",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontFamily: FONT_DISPLAY,
      fontSize: "19px",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontFamily: FONT_DISPLAY,
      fontSize: "16px",
      fontWeight: 600,
    },
    body1: {
      fontSize: "15px",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "13.5px",
      lineHeight: 1.7,
    },
    button: {
      textTransform: "none" as const,
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
          padding: "12px 22px",
          fontWeight: 600,
          fontSize: "14px",
          boxShadow: "none",
          transition: "background-color 0.2s, transform 0.2s, border-color 0.2s, color 0.2s",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          backgroundColor: "#0A0A0A",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#B45309",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#E5E5E0",
          color: "#0A0A0A",
          "&:hover": {
            borderColor: "#0A0A0A",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backgroundColor: "#FFFFFF",
          color: "#0A0A0A",
          fontFamily: FONT_BODY,
        },
        "*, *::before, *::after": {
          boxSizing: "border-box",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          "@media (min-width:600px)": {
            paddingLeft: 40,
            paddingRight: 40,
          },
        },
      },
    },
  },
  custom: {
    header: {
      height: {
        mobile: 60,
        desktop: 72,
      },
    },
    subTitle: {
      height: "1rem",
      widthXs: 100,
      widthSm: 30,
      widthMd: 30,
      widthLg: 30,
    },
    fonts: {
      display: FONT_DISPLAY,
      body: FONT_BODY,
      italic: FONT_ITALIC,
    },
  },
};
