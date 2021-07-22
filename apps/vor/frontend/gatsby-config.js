const plugins = [
  `gatsby-plugin-layout`,
  "gatsby-plugin-theme-ui",
  `gatsby-plugin-react-helmet`,
  `gatsby-plugin-postcss`,
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: `${__dirname}/src/images`,
    },
  },
  `gatsby-plugin-image`,
  `gatsby-transformer-sharp`,
  `gatsby-plugin-sharp`,
  `gatsby-plugin-remove-trailing-slashes`,
  {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Obserfy`,
      short_name: `Obserfy`,
      start_url: `/dashboard/students`,
      background_color: `#121212`,
      theme_color: `#121212`,
      display: `standalone`,
      icon: `src/images/logo-transparent.png`, // This path is relative to the root of the site.
      icon_options: {
        // For all the options available, please see the additional resources below.
        purpose: `any maskable`,
      },
    },
  },
  // `gatsby-plugin-offline`,
  `gatsby-plugin-remove-serviceworker`,
  `gatsby-plugin-portal`,
  {
    resolve: "gatsby-plugin-svgr",
    options: {
      prettier: true, // use prettier to format JS code output (default)
      svgo: true, // use svgo to optimize SVGs (default)
      svgoConfig: {
        removeViewBox: true, // remove viewBox when possible (default)
        cleanupIDs: true, // remove unused IDs and minify remaining IDs (default)
      },
    },
  },
  {
    resolve: `gatsby-plugin-canonical-urls`,
    options: {
      siteUrl: `https://app.obserfy.com`,
    },
  },
  {
    resolve: `gatsby-plugin-nprogress`,
    options: {
      // Setting a color is optional.
      color: `#00a06d`,
      // Disable the loading spinner.
      showSpinner: false,
    },
  },
  {
    resolve: `gatsby-theme-i18n`,
    options: {
      defaultLang: `en`,
      configPath: require.resolve(`./i18n/config.json`),
    },
  },
  {
    resolve: `gatsby-theme-i18n-lingui`,
    options: {
      localeDir: `./i18n/lingui`,
    },
  },
  // DEVTOOLS ================================================================
  // {
  //   resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
  //   options: {
  //     analyzerPort: 3300,
  //   },
  // },
  {
    resolve: `gatsby-plugin-typegen`,
    options: {
      emitSchema: {
        "src/__generated__/gatsby-schema.graphql": true,
      },
    },
  },
]

// this disables plugins for dev.
if (process.env.NODE_ENV === "production") {
  plugins.push(`gatsby-plugin-preact`)
  plugins.push({
    resolve: "@sentry/gatsby",
    options: {
      dsn: "https://05a5ecaa1d8c4c01b96d2a7993fa9337@sentry.io/1852524",
      release: require("fs").readFileSync("../../../VERSION", "utf8"),
      tracesSampleRate: 0.1,
    },
  })
}

/**
 * Proxy all network calls to /api and /auth routes to our golang backend.
 * */
const developMiddleware = (app) => {
  app.use(
    "/api",
    require("http-proxy-middleware").createProxyMiddleware({
      secure: false,
      target: "https://localhost:8000",
    })
  )
  app.use(
    "/auth",
    require("http-proxy-middleware").createProxyMiddleware({
      secure: false,
      target: "https://localhost:8000",
    })
  )
}

module.exports = {
  flags: {
    FAST_DEV: true,
    DEV_WEBPACK_CACHE: true,
    PARALLEL_SOURCING: true,
  },
  siteMetadata: {
    title: `Obserfy for Teachers`,
    description: `Record keeping tool for montessori schools.`,
    author: `@chrsep`,
    siteUrl: `https://app.obserfy.com`,
  },
  plugins,
  developMiddleware,
}
