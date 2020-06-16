import React, { FC } from "react"
import { Flex, Button } from "theme-ui"
import { navigate } from "../Link/Link"
import Typography from "../Typography/Typography"

import Spacer from "../Spacer/Spacer"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import Dialog from "../Dialog/Dialog"
import useDeleteClass from "../../api/classes/useDeleteClass"
import { CLASS_SETTINGS_URL } from "../../routes"

interface Props {
  onDismiss: () => void
  classId: string
  name: string
}
export const DeleteClassDialog: FC<Props> = ({ classId, onDismiss, name }) => {
  const [mutate, { status }] = useDeleteClass(classId)

  async function deleteClass(): Promise<void> {
    const result = await mutate()
    if (result) {
      await navigate(CLASS_SETTINGS_URL)
    }
  }

  const header = (
    <Flex
      backgroundColor="surface"
      sx={{
        alignItems: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Typography.H6
        sx={{
          width: "100%",
          position: "absolute",
          pointerEvents: "none",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        Delete Class?
      </Typography.H6>
      <Button
        variant="outline"
        m={2}
        onClick={onDismiss}
        sx={{ flexShrink: 0 }}
      >
        Cancel
      </Button>
      <Spacer />
      <Button m={2} backgroundColor="danger" onClick={deleteClass}>
        {status === "loading" && <LoadingIndicator />}
        Yes
      </Button>
    </Flex>
  )

  return (
    <Dialog sx={{ maxWidth: ["", "maxWidth.xsm"] }}>
      {header}
      <Typography.Body
        p={3}
        sx={{
          borderBottomColor: "border",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <i>&quot;{name}&quot;</i> and student data related to it will be
        permanently deleted. Are you sure?
      </Typography.Body>
    </Dialog>
  )
}

export default DeleteClassDialog
