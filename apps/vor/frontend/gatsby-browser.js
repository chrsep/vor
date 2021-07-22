import { redirectToPreferredLang } from "./src/i18n"
import { track } from "./src/analytics"
import { i18n } from "@lingui/core"
import { en, id } from "make-plural/plurals"
import { Severity } from "@sentry/gatsby"
import "./src/global.css"
import "./src/tailwind.css"

export const onServiceWorkerUpdateReady = () => {
  if (window.updateAvailable) {
    window.updateAvailable()
  }
}

export const onRouteUpdate = ({ location }) => {
  track("Loaded a page", {
    title: document.title,
    location: location.pathname,
  })

  if (typeof Sentry !== "undefined") {
    const breadcrumb = {
      category: "page",
      level: Severity.Info,
      data: {
        title: document.title,
        location: location.pathname,
      },
    }
    Sentry.addBreadcrumb(breadcrumb)
  }
}

// For redirecting user to preferred language
export const wrapPageElement = (params) => {
  i18n.loadLocaleData("en", { plurals: en })
  i18n.loadLocaleData("en", { plurals: id })

  redirectToPreferredLang(
    params.props.location,
    params.props.pageContext.originalPath
  )

  return params.element
}

export const onClientEntry = () => {
  if (typeof window !== "undefined" && window.mixpanel !== undefined) {
    mixpanel.init("470951a0c3bd38f4c305063090790dcb")
  }
}
