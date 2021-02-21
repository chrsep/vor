/** @jsx jsx */
import { t, Trans } from "@lingui/macro"
import { FC, Fragment, useState } from "react"
import { jsx, Box, Button, Flex, ThemeUIStyleObject } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import usePostNewSubject from "../../hooks/api/curriculum/usePostNewSubject"
import { useGetArea } from "../../hooks/api/useGetArea"
import { Subject, useGetAreaSubjects } from "../../hooks/api/useGetAreaSubjects"
import { useMoveDraggableItem } from "../../hooks/useMoveDraggableItem"
import { useQueryString } from "../../hooks/useQueryString"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_URL,
  CURRICULUM_SUBJECT_URL,
} from "../../routes"
import DeleteAreaDialog from "../DeleteAreaDialog/DeleteAreaDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import DraggableListItem from "../DraggableListItem/DraggableListItem"
import EditAreaDialog from "../EditAreaDialog/EditAreaDialog"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { Link, navigate } from "../Link/Link"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

interface Props {
  id: string
  sx?: ThemeUIStyleObject
}
const PageCurriculumArea: FC<Props> = ({ id, sx }) => {
  const subjectId = useQueryString("subjectId")
  const area = useGetArea(id)
  const subjects = useGetAreaSubjects(id)
  const newSubject = useVisibilityState()
  const deleteArea = useVisibilityState()
  const editArea = useVisibilityState()

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "100%",
        overflow: "auto",
        height: ["auto", "auto", "100vh"],
        maxWidth: ["100%", "100%", 280],
        pb: 5,
        ...borderRight,
        ...sx,
      }}
    >
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ display: ["flex", "flex", "none"] }}
          breadcrumbs={[
            breadCrumb("Admin", ADMIN_URL),
            breadCrumb("Curriculum", ADMIN_CURRICULUM_URL),
            breadCrumb(`${area.data?.name}`),
          ]}
        />

        <Flex mx={3} py={3} sx={{ alignItems: "center" }}>
          <Typography.H6
            mr={3}
            sx={{
              lineHeight: 1.2,
              fontSize: [3, 3, 1],
            }}
          >
            {area.data?.name}
          </Typography.H6>
          <Button
            variant="outline"
            onClick={deleteArea.show}
            color="danger"
            sx={{ flexShrink: 0 }}
            px={2}
            ml="auto"
          >
            <Icon size={16} as={DeleteIcon} fill="danger" />
          </Button>
          <Button
            variant="outline"
            onClick={editArea.show}
            sx={{ flexShrink: 0 }}
            px={2}
            ml={2}
          >
            <Icon size={16} as={EditIcon} />
          </Button>
        </Flex>
      </TranslucentBar>

      <Typography.Body
        py={2}
        px={3}
        sx={{ fontWeight: "bold", ...borderBottom }}
      >
        <Trans>Subjects</Trans>
      </Typography.Body>

      <SubjectList
        key={subjects.data?.map((subject) => subject.id).join(",") ?? ""}
        areaId={id}
        subjects={subjects.data ?? []}
        currSubjectId={subjectId}
      />

      <Flex
        role="button"
        p={3}
        onClick={newSubject.show}
        sx={{
          alignItems: "center",
          cursor: "pointer",
          ...borderBottom,
        }}
      >
        <Icon as={PlusIcon} fill="textPrimary" />
        <Typography.Body ml={3} sx={{ color: "textMediumEmphasis" }}>
          <Trans>Add new subject</Trans>
        </Typography.Body>
      </Flex>

      {deleteArea.visible && (
        <DeleteAreaDialog
          name={area.data?.name ?? ""}
          onDismiss={deleteArea.hide}
          onDeleted={() => navigate(ADMIN_CURRICULUM_URL)}
          areaId={id}
        />
      )}

      {editArea.visible && area.data && (
        <EditAreaDialog
          areaId={id}
          originalName={area.data.name}
          onDismiss={editArea.hide}
          onSaved={async () => {
            await area.refetch()
            editArea.hide()
          }}
        />
      )}

      {newSubject.visible && (
        <NewSubjectDialog areaId={id} onDismiss={newSubject.hide} />
      )}
    </Box>
  )
}

const SubjectList: FC<{
  subjects: Subject[]
  areaId: string
  currSubjectId: string
}> = ({ currSubjectId, subjects, areaId }) => {
  const [cachedSubjects, moveItem] = useMoveDraggableItem(subjects)

  return (
    <Fragment>
      {cachedSubjects.map((subject) => (
        <SubjectListItem
          key={subject.id}
          currentSubjectId={currSubjectId}
          subject={subject}
          areaId={areaId}
          moveItem={moveItem}
        />
      ))}
    </Fragment>
  )
}

const SubjectListItem: FC<{
  subject: Subject
  areaId: string
  currentSubjectId: string
  moveItem: (currItem: Subject, newOrder: number) => void
}> = ({ areaId, subject, moveItem, currentSubjectId }) => {
  const selected = currentSubjectId === subject.id

  return (
    <Link
      to={CURRICULUM_SUBJECT_URL(areaId, subject.id)}
      sx={{ display: "block", maxWidth: "inherit" }}
    >
      <DraggableListItem
        item={subject}
        moveItem={moveItem}
        height={54}
        containerSx={{
          ...borderBottom,
          ...borderRight,
          borderRightColor: "textPrimary",
          borderRightWidth: 2,
          borderRightStyle: selected ? "solid" : "none",
          backgroundColor: selected ? "primaryLightest" : "background",
          color: selected ? "textPrimary" : "textMediumEmphasis",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "primaryLightest",
          },
        }}
      >
        <Typography.Body className="truncate" sx={{ color: "inherit" }}>
          {subject.name}
        </Typography.Body>
        <Icon as={NextIcon} mr={3} ml="auto" fill="currentColor" />
      </DraggableListItem>
    </Link>
  )
}

const NewSubjectDialog: FC<{ areaId: string; onDismiss: () => void }> = ({
  areaId,
  onDismiss,
}) => {
  const [name, setName] = useState("")
  const newSubject = usePostNewSubject(areaId)

  const handleSave = async () => {
    try {
      await newSubject.mutateAsync({ name })
      onDismiss()
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Dialog>
      <DialogHeader
        title={t`New Subject`}
        disableAccept={newSubject.isLoading}
        loading={newSubject.isLoading}
        onCancel={onDismiss}
        onAccept={handleSave}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input
          sx={{ width: "100%" }}
          label="Subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Box>
    </Dialog>
  )
}

export default PageCurriculumArea
