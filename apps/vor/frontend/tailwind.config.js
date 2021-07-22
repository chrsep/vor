module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Open Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        heading: [
          "Open Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        body: [
          "Open Sans",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "inherit",
            p: {
              opacity: 0.9,
            },
            strong: {
              color: "inherit",
            },
            h1: {
              color: "inherit",
            },
            h2: {
              color: "inherit",
            },
            h3: {
              color: "inherit",
            },
            h4: {
              color: "inherit",
            },
            h5: {
              color: "inherit",
            },
            h6: {
              color: "inherit",
            },
            a: {
              color: "inherit",
            },
            blockquote: {
              color: "inherit",
            },
          },
        },
        sm: {
          css: {
            h1: {
              fontSize: "1.4285714em",
              marginBottom: "0.8em",
              marginTop: "1.6em",
            },
            h2: {
              fontSize: "1.2857143em",
              marginBottom: "0.4444444em",
              marginTop: "0",
            },
            h3: {
              fontSize: "inherit",
              marginBottom: "0.5714286em",
              marginTop: "0",
            },
            h4: {
              fontSize: "inherit",
              fontWeight: "normal",
              marginBottom: 0,
            },
          },
        },
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
}
