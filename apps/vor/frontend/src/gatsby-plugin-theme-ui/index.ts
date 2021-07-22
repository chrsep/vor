import buttons from "./buttons"
import colors from "./colors"
import { fonts, fontSizes, fontWeights } from "./fonts"
import forms from "./forms"
import text from "./text"

const theme = {
  breakpoints: ["40em", "52em", "64em", "72em"],
  useColorSchemeMediaQuery: true,
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    avatar: 48,
    appbar: 57,
    sidebar: {
      mobile: 360,
      desktop: 230,
    },
    icon: 20,
    table: {
      row: 60,
      header: 70,
    },
    maxWidth: {
      xsm: 500,
      sm: 640,
      md: 700,
      lg: 900,
      xl: 1200,
    },
  },
  radii: {
    default: 6,
    circle: 99999,
  },
  shadows: {
    low: "rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.27) 0px 2px 4px -2px",
  },
  cards: {
    primary: {
      backgroundColor: "surface",
      borderRadius: "default",
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.27) 0px 2px 4px -2px",
    },
    responsive: {
      variant: "cards.primary",
      mx: [0, 3],
      borderRadius: [0, "default"],
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
  },
  colors,
  text,
  buttons,
  forms,
  fonts,
  fontSizes,
  fontWeights,
}

export type ObserfyTheme = typeof theme

export default theme
