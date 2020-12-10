/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import { useGetGuardian } from "../../api/guardians/useGetGuardian"
import { usePatchGuardian } from "../../api/guardians/usePatchGuardian"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Dialog from "../Dialog/Dialog"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import DialogHeader from "../DialogHeader/DialogHeader"

interface Props {
  guardianId: string
}
export const PageGuardianProfile: FC<Props> = ({ guardianId }) => {
  const { data, status } = useGetGuardian(guardianId)

  if (status === "loading") {
    return (
      <Box>
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: "10em" }} mb={3} />
      </Box>
    )
  }

  return (
    <Card sx={{ borderRadius: [0, "default"] }} mb={3} mx={[0, 3]}>
      <NameDataBox
        value={data?.name}
        key={`name${data?.name}`}
        guardianId={guardianId}
      />
      <EmailDataBox
        value={data?.email}
        key={`email${data?.email}`}
        guardianId={guardianId}
      />
      <PhoneDataBox
        value={data?.phone}
        key={`phone${data?.phone}`}
        guardianId={guardianId}
      />
      <NoteDataBox
        value={data?.note}
        key={`note${data?.note}`}
        guardianId={guardianId}
      />
    </Card>
  )
}

const NameDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [name, setName] = useState(value)
  const saveName = async () => {
    await mutate({ name })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Name`}
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Name`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveName}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Name`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const EmailDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [email, setEmail] = useState(value)
  const saveEmail = async () => {
    await mutate({ email })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Email`}
        value={value || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Email`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveEmail}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Email`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              value={email}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const PhoneDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [phone, setPhone] = useState(value)
  const savePhone = async () => {
    await mutate({ phone })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Phone`}
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Phone`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={savePhone}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Phone`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setPhone(e.target.value)
              }}
              value={phone}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const NoteDataBox: FC<{ value?: string; guardianId: string }> = ({
  value,
  guardianId,
}) => {
  const [mutate, { status }] = usePatchGuardian(guardianId)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [note, setNote] = useState(value)
  const saveNote = async () => {
    await mutate({ note })
    setShowEditDialog(false)
  }
  return (
    <Fragment>
      <DataBox
        label={t`Note`}
        value={value || "-"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Note`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={saveNote}
            loading={status === "loading"}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={t`Note`}
              sx={{ width: "100%" }}
              onChange={(e) => {
                setNote(e.target.value)
              }}
              value={note}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const DataBox: FC<{
  label: string
  value: string
  onEditClick?: () => void
}> = ({ label, value, onEditClick }) => (
  <Flex px={3} py={3} sx={{ alignItems: "center" }}>
    <Box>
      <Typography.Body
        sx={{ fontSize: 0, lineHeight: 1.4 }}
        mb={1}
        color="textMediumEmphasis"
      >
        <Trans id={label} />
      </Typography.Body>
      <Typography.Body sx={{ lineHeight: 1.6 }}>{value}</Typography.Body>
    </Box>
    <Button
      variant="outline"
      ml="auto"
      px={2}
      onClick={onEditClick}
      aria-label={`edit-${label.toLowerCase()}`}
    >
      <Icon as={EditIcon} />
    </Button>
  </Flex>
)

export default PageGuardianProfile
