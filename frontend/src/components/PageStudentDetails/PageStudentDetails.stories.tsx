import React, { FC } from "react"
import PageStudentDetails from "./PageStudentDetails"

export default {
  title: "Core|PageStudentDetails",
  component: PageStudentDetails,
  parameters: {
    componentSubtitle: "Just a simple PageStudentDetails",
  },
}

export const Basic: FC = () => <PageStudentDetails id="asdfadsf" />
