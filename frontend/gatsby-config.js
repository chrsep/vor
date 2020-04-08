/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-var-requires,global-require */
const { createProxyMiddleware } = require("http-proxy-middleware")
require("dotenv").config({
  path: `.env`,
})

// Conditionally load guess js
const guessJsPlugin =
  process.env.GA_PRIVATE_KEY && process.env.GA_CLIENT_EMAIL
    ? [
        {
          resolve: "gatsby-plugin-guess-js",
          options: {
            // Find the view id in the GA admin in a section labeled "views"
            GAViewID: `211863061`,
            // Add a JWT to get data from GA
            jwt: {
              private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
              client_email: process.env.GA_CLIENT_EMAIL,
            },
            minimumThreshold: 0.03,
            // The "period" for fetching analytic data.
            period: {
              startDate: new Date("2020-1-1"),
              endDate: new Date(),
            },
          },
        },
      ]
    : []

module.exports = {
  siteMetadata: {
    title: `Obserfy`,
    description: `Obserfy`,
    author: `@chrsep`,
  },
  plugins: [
    `gatsby-plugin-layout`,
    `gatsby-plugin-typescript`,
    "gatsby-plugin-theme-ui",
    `gatsby-plugin-react-helmet-async`,
    // `gatsby-plugin-preact`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Obserfy`,
        short_name: `Obserfy`,
        start_url: `/`,
        background_color: `#121212`,
        theme_color: `#121212`,
        display: `standalone`,
        icon: `src/images/logo-standalone.svg`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-offline`,
    // `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-remove-trailing-slashes`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-portal`,
    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        // your segment write key for your production environment
        // when process.env.NODE_ENV === 'production'
        // required; non-empty string
        // TODO: Do not hardcode this, use env variables.
        prodKey: `a2pLn3x1wfkoSpgCxAb1sHiMRPraq6hW`,

        devKey: `mmWAsCJqhsbHOArCtFhRCUvtAkr8WkzR`,
        // boolean (defaults to false) on whether you want
        // to include analytics.page() automatically
        // if false, see below on how to track pageviews manually
        trackPage: true,

        // boolean (defaults to false); whether to delay load Segment
        // ADVANCED FEATURE: only use if you leverage client-side routing (ie, Gatsby <Link>)
        // This feature will force Segment to load _after_ either a page routing change
        // or user scroll, whichever comes first. This delay time is controlled by
        // `delayLoadTime` setting. This feature is used to help improve your website's
        // TTI (for SEO, UX, etc).  See links below for more info.
        // NOTE: But if you are using server-side routing and enable this feature,
        // Segment will never load (because although client-side routing does not do
        // a full page refresh, server-side routing does, thereby preventing Segment
        // from ever loading).
        // See here for more context:
        // GIF: https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19#issuecomment-559569483
        // TTI: https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md#performance
        // Problem/solution: https://marketingexamples.com/seo/performance
        delayLoad: true,

        // number (default to 1000); time to wait after scroll or route change
        // To be used when `delayLoad` is set to `true`
        delayLoadTime: 1000,
      },
    },
    // {
    //   resolve: "gatsby-plugin-crisp-chat",
    //   options: {
    //     websiteId: "d46cf62a-1614-4ccc-88b8-ef616bbc8fcd",
    //     enableDuringDevelop: false, // Optional. Disables Crisp Chat during gatsby develop. Defaults to true.
    //     defer: true, // Optional. Sets the Crisp loading script to defer instead of async. Defaults to false.
    //   },
    // },
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
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Open Sans`,
            variants: [`300`, `400`],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-intl3`,
      options: {
        // language JSON resource path
        path: `${__dirname}/src/intl`,
        // supported language
        languages: [`en`],
        // language file path
        defaultLanguage: `en`,
        // option to redirect to `/ko` when connecting `/`
        redirect: false,
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://obserfy.com`,
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
      resolve: "gatsby-plugin-sentry",
      options: {
        dsn: "https://05a5ecaa1d8c4c01b96d2a7993fa9337@sentry.io/1852524",
        // Optional settings, see https://docs.sentry.io/clients/node/config/#optional-settings
        environment: process.env.NODE_ENV,
        release: require("git-rev-sync").short(),
        enabled: (() =>
          ["production", "test"].indexOf(process.env.NODE_ENV) !== -1)(),
      },
    },
    ...guessJsPlugin,
    // DEVTOOLS ================================================================
    {
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      options: {
        analyzerPort: 3000,
      },
    },
  ],
  developMiddleware: (app) => {
    app.use("/api", createProxyMiddleware({ target: "http://localhost:8000" }))
    app.use("/auth", createProxyMiddleware({ target: "http://localhost:8000" }))
  },
}
