declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    pale?: string;
  }
  interface TypeBackground {
    dark?: string;
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
    };
  }
}

export const themeConstants = {
  palette: {
    primary: {
      pale: "#FFF5F0",      // 薄いオレンジ
      light: "#FF8A65",     // ライトオレンジ
      main: "#FF5722",      // メインオレンジ（アクセント）
      dark: "#E64A19",      // ダークオレンジ
      contrastText: "#FFFFFF",
    },
    secondary: {
      pale: "#F5F5F5",      // ライトグレー
      light: "#BDBDBD",     // グレー
      main: "#424242",      // ダークグレー（テキスト）
      dark: "#212121",      // ほぼ黒
      contrastText: "#FFFFFF",
    },
    info: {
      pale: "#FFFFFF",
      light: "#E0E0E0",     // ボーダー用グレー
      main: "#757575",      // サブテキスト
      dark: "#333333",      // メインテキスト
    },
    warning: {
      pale: "#FFF8E1",
      light: "#FFE082",
      main: "#FFA726",
      dark: "#F57C00",
    },
    error: {
      pale: "#FFEBEE",
      light: "#EF9A9A",
      main: "#EF5350",
      dark: "#C62828",
    },
    background: {
      default: "#FFFFFF",   // 白ベース
      paper: "#FFFFFF",
      dark: "#333333",      // フッター用ダーク
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
  },
  custom: {
    header: {
      height: {
        mobile: 56,
        desktop: 64,
      },
    },
    subTitle: {
      height: "1rem",
      widthXs: 100,
      widthSm: 30,
      widthMd: 30,
      widthLg: 30,
    },
  },
};
