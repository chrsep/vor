export default {
  primary: {
    userSelect: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    fontSize: 1,
    color: "onPrimary",
    bg: "primary",
    borderRadius: "default",
    fontFamily: "body",
    transition: "background-color 125ms cubic-bezier(0.0, 0.0, 0.2, 1)",
    py: 2,
    px: 3,
    whiteSpace: "nowrap",
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    touchAction: "manipulation",
    boxShadow:
      "rgba(27, 31, 35, 0.1) 0px 1px 0px 0px, rgba(255, 255, 255, 0.03) 0px 1px 0px 0px inset",
    borderColor: "border",
    borderStyle: "solid",
    borderWidth: 1,
    lineHeight: 1,
    "&:disabled": {
      opacity: 0.38,
      cursor: "auto",
    },
    "&:hover, &:focus": {
      backgroundColor: "primaryDark",
      "&:disabled": {
        backgroundColor: "primary",
      },
    },
  },
  primaryBig: {
    variant: "buttons.primary",
    py: 3,
  },
  secondary: {
    variant: "buttons.primary",
    color: "textPrimary",
    bg: "transparent",
    border: "none",
    flexShrink: 0,
    boxShadow: "none",
    "&:hover, &:focus": {
      backgroundColor: "primaryLighter",
      borderColor: "primary",
    },
  },
  outline: {
    variant: "buttons.primary",
    backgroundColor: "surface",
    color: "textPrimary",
    boxShadow: "none",
    flexShrink: 0,
    "&:hover, &:focus": {
      backgroundColor: "primaryLighter",
      borderColor: "primary",
      "&:disabled": {
        backgroundColor: "transparent",
        borderColor: "border",
      },
    },
  },
  outlineBig: {
    variant: "buttons.outline",
    py: 3,
  },
}
