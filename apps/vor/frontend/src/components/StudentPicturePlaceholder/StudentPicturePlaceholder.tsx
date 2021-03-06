import { StaticImage } from "gatsby-plugin-image"
import { FC } from "react"

export const StudentPicturePlaceholder: FC = () => (
  <StaticImage
    data-cy="profile-pic-placeholder"
    src="../../images/gradients/1.jpg"
    alt="empty student photo"
    width={32}
    className="rounded-full"
    placeholder="blurred"
  />
)

export default StudentPicturePlaceholder
