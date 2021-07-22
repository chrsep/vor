import { Global } from "@emotion/react"
import { FC } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { Box, useColorMode } from "theme-ui"
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary"
import Layout from "../components/Layout/Layout"

const queryClient = new QueryClient()

// Used by gatsby-plugin-layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LayoutManager: FC<any> = ({ children, pageContext }) => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <GlobalStyle />
      {pageContext.layout === "open" ? (
        <Box sx={{ backgroundColor: "background" }}>{children}</Box>
      ) : (
        <Layout>{children}</Layout>
      )}
    </ErrorBoundary>
  </QueryClientProvider>
)

const GlobalStyle: FC = () => {
  const [mode] = useColorMode()
  const isDarkMode = mode === "dark"

  return (
    <Global
      styles={({ colors }) => ({
        body: {
          backgroundColor: colors.background,
          minHeight: "100vh",
          top: 0,
        },

        "@media (min-width: 52em)": {
          // scrollbarColor: isDarkMode ? "dark" : "light",

          "::-webkit-scrollbar": isDarkMode
            ? { width: 8, height: 8, backgroundColor: "#1c1c1c" }
            : "inherit",

          "::-webkit-scrollbar-thumb": isDarkMode
            ? { backgroundColor: "#3e3e3e", borderRadius: 9999 }
            : "inherit",
        },
      })}
    />
  )
}

export default LayoutManager
