import React, { FC } from "react"
import { Box } from "theme-ui"
import { getFirstName } from "../../domain/person"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { STUDENT_OVERVIEW_URL, STUDENTS_URL } from "../../routes"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import { ObservationsTable } from "./ObservationsTable"

interface Props {
  studentId: string
}
export const PageAllObservations: FC<Props> = ({ studentId }) => {
  const { data: student } = useGetStudent(studentId)

  return (
    <Box sx={{ maxWidth: "maxWidth.lg" }} mx="auto" pb={6}>
      <TopBar
        breadcrumbs={[
          breadCrumb("Students", STUDENTS_URL),
          breadCrumb(getFirstName(student), STUDENT_OVERVIEW_URL(studentId)),
          breadCrumb("Observations"),
        ]}
      />

      <ObservationsTable studentId={studentId} />
    </Box>
  )
}

export default PageAllObservations
