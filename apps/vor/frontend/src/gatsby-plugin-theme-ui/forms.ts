export default {
  input: {
    borderRadius: "default",
    fontFamily: "body",
    width: "auto",
    borderColor: "border",
    backgroundColor: "surface",
    fontSize: 2,
    p: 12,
    color: "text",
    "&:hover, &:focus": {
      borderColor: "primary",
    },
    "&::placeholder": {
      fontStyle: "italic",
    },
    "&:disabled": {
      opacity: 0.68,
      borderColor: "border",
      color: "textDisabled",
    },
  },
  select: {
    borderRadius: "default",
    color: "text",
    fontFamily: "body",
    borderColor: "border",
    backgroundColor: "surface",
    fontSize: 2,
    p: 12,
    "&:hover, &:focus": {
      borderColor: "primary",
    },
  },
  textarea: {
    borderRadius: "default",
    fontFamily: "body",
    borderColor: "border",
    backgroundColor: "surface",
    fontSize: 2,
    p: 3,
    height: 180,
    resize: "vertical",
    color: "text",
    "&:hover, &:focus": {
      borderColor: "primary",
    },
    "&::placeholder": {
      fontStyle: "italic",
      lineHeight: "2rem",
    },
  },
  label: {
    color: "textMediumEmphasis",
    fontFamily: "body",
    fontSize: 1,
    userSelect: "none",
  },
}
