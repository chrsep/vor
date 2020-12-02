/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { Trans } from "@lingui/macro"
import Header from "./header"
import "./global.css"

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto">
        <main>{children}</main>
        <footer className="px-3 text-center my-3 flex items-center pt-8 text-gray-700">
          <div>© {new Date().getFullYear()} Obserfy</div>
          <Link to="/privacy-policy" className="ml-3 underline">
            <Trans>Privacy Policy</Trans>
          </Link>
        </footer>
      </div>
    </>
  )
}

export default Layout
