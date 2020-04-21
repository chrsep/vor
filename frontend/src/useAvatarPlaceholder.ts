import { graphql, useStaticQuery } from "gatsby"
import { FixedObject } from "gatsby-image"

export const useAvatarPlaceholder = (): FixedObject | undefined => {
  const data = useStaticQuery(graphql`
    query AvatarPlaceholder {
      file: file(relativePath: { eq: "avatar.png" }) {
        childImageSharp {
          fixed(width: 32, height: 32) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)
  if (data && data.file && data.file.childImageSharp) {
    return data.file.childImageSharp.fixed as FixedObject
  }
  return undefined
}
