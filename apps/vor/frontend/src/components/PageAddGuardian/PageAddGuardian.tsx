import { t, Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import { Box, Flex } from "theme-ui"
import { usePostGuardianRelation } from "../../api/guardians/usePostGuardianRelation"
import { usePostNewGuardian } from "../../api/guardians/usePostNewGuardian"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import { useGetStudent } from "../../api/useGetStudent"
import { getFirstName } from "../../domain/person"
import {
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../routes"
import Chip from "../Chip/Chip"
import GuardianRelationshipSelector from "../GuardianRelationshipSelector/GuardianRelationshipSelector"
import { navigate } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import NewGuardianForm, {
  useNewGuardianFormState,
} from "../NewGuardianForm/NewGuardianForm"
import SimpleGuardiansSelector from "../SimpleGuardiansSelector/SimpleGuardiansSelector"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"
import { Typography } from "../Typography/Typography"

enum Mode {
  NEW,
  EXISTING,
}

interface Props {
  id: string
}

export const PageAddGuardian: FC<Props> = ({ id: studentId }) => {
  const { data: student } = useGetStudent(studentId)
  const [postNewGuardian, { isLoading }] = usePostNewGuardian(studentId)

  const [mode, setMode] = useState(Mode.NEW)
  const [relation, setRelation] = useState(GuardianRelationship.Mother)
  const [newGuardian, setNewGuardian] = useNewGuardianFormState()
  const [guardianId, setGuardianId] = useState("")
  const [postNewGuardianRelation] = usePostGuardianRelation(
    { id: guardianId },
    studentId
  )

  const isFormValid =
    mode === Mode.NEW ? newGuardian.name !== "" : guardianId !== ""

  const createNewGuardian = async () => {
    const result = await postNewGuardian({
      ...newGuardian,
      studentId,
      relationship: relation,
    })
    if (result?.status === 201) await navigate(STUDENT_PROFILE_URL(studentId))
  }

  const createNewGuardianRelation = async () => {
    const result = await postNewGuardianRelation(relation)
    if (result?.status === 201) await navigate(STUDENT_PROFILE_URL(studentId))
  }

  return (
    <>
      <TopBarWithAction
        disableAction={!isFormValid}
        onActionClick={async () => {
          if (mode === Mode.NEW) await createNewGuardian()
          else await createNewGuardianRelation()
        }}
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(
            getFirstName(student),
            STUDENT_OVERVIEW_PAGE_URL(studentId)
          ),
          breadCrumb(t`Profile`, STUDENT_PROFILE_URL(studentId)),
          breadCrumb(t`Add Guardian`),
        ]}
        buttonContent={
          <>
            {isLoading && <LoadingIndicator color="onPrimary" />}
            <Trans>Add</Trans>
          </>
        }
      />

      <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
        <Typography.H5 mx={3} mt={4} mb={2}>
          <Trans>Add Guardian</Trans>
        </Typography.H5>

        <ModeSelector mode={mode} onClick={setMode} />

        <GuardianRelationshipSelector
          value={relation}
          onChange={(e) => setRelation(parseInt(e.target.value, 10))}
        />

        {mode === Mode.NEW && (
          <NewGuardianForm
            newGuardian={newGuardian}
            onChange={setNewGuardian}
          />
        )}
        {mode === Mode.EXISTING && (
          <SimpleGuardiansSelector
            onChange={setGuardianId}
            selectedId={guardianId}
            currentGuardianIds={student?.guardians.map(({ id }) => id)}
          />
        )}
      </Box>
    </>
  )
}

const ModeSelector: FC<{
  mode: Mode
  onClick: (mode: Mode) => void
}> = ({ mode, onClick }) => (
  <Flex mb={3}>
    <Chip
      text="Create new"
      ml={3}
      isActive={mode === Mode.NEW}
      onClick={() => onClick(Mode.NEW)}
    />
    <Chip
      text="From existing"
      ml={2}
      isActive={mode === Mode.EXISTING}
      onClick={() => onClick(Mode.EXISTING)}
    />
  </Flex>
)

export default PageAddGuardian