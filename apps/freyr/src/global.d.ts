// TODO: stub gatsby-theme-i18n until proper typing is released.
declare module "gatsby-theme-i18n" {
  import { Link } from "gatsby"
  type LocalizedLink<T> = Link<T>

  const LocalizedLink
  export { LocalizedLink }
}

declare module "*.svg" {
  export default string
}

declare module "*.css" {
  export default string
}