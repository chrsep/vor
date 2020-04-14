import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import SEO from "../../../../components/seo"
import PageNewStudent from "../../../../components/PageNewStudent/PageNewStudent"

export const NEW_STUDENT_URL = "/dashboard/observe/students/new"

const NewStudent: FC<PageRendererProps> = ({ location }) => {
  return (
    <>
      <SEO title="Edit Student" />
      <PageNewStudent newGuardian={location.state?.guardian} />
    </>
  )
}
export default NewStudent
