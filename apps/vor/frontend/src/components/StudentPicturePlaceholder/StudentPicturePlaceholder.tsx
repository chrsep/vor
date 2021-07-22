import { StaticImage } from "gatsby-plugin-image"
import { FC } from "react"
import { ThemeUIStyleObject } from "theme-ui"

export const StudentPicturePlaceholder: FC<{
  sx?: ThemeUIStyleObject
  className?: string
}> = ({ className = "" }) => (
  <StaticImage
    data-cy="profile-pic-placeholder"
    src="../../images/gradients/1.jpg"
    width={32}
    className={`rounded-full ${className}`}
    placeholder="blurred"
    alt=""
  />
)

export default StudentPicturePlaceholder
