/** @jsx jsx */
import { FC, useState } from "react"
import { jsx, Button, Flex, Box } from "theme-ui"
import Input from "../Input/Input"
import BackNavigation from "../BackNavigation/BackNavigation"
import { ALL_PLANS_URL } from "../../routes"
import { Typography } from "../Typography/Typography"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import Chip from "../Chip/Chip"
import TextArea from "../TextArea/TextArea"
import DateInput from "../DateInput/DateInput"
import usePostNewPlan from "../../api/plans/usePostNewPlan"
import dayjs from "../../dayjs"
import { navigate } from "../Link/Link"
import EmptyClassDataPlaceholder from "../EmptyClassDataPlaceholder/EmptyClassDataPlaceholder"

interface Props {
  chosenDate: string
}

export const PageNewPlan: FC<Props> = ({ chosenDate }) => {
  const classes = useGetSchoolClasses()
  const [mutate] = usePostNewPlan()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [classId, setClassId] = useState("")
  const [date, setDate] = useState(chosenDate ? dayjs(chosenDate) : dayjs())

  // Repetition data
  const [repetition, setRepetition] = useState(0)
  const [endDate, setEndDate] = useState(date)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={ALL_PLANS_URL(date)} text="All plans" />
      <Typography.H5 m={3}>New Plan</Typography.H5>

      <Box mx={3}>
        <DateInput
          label="Date"
          value={date.toDate()}
          onChange={(value) => setDate(dayjs(value))}
          mb={2}
        />
        <Input
          label="Title"
          sx={{ width: "100%" }}
          mb={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextArea
          label="Description"
          mb={3}
          value={description}
          sx={{ width: "100%" }}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </Box>

      {classes.status === "success" && classes.data.length === 0 ? (
        <Box mb={3}>
          <EmptyClassDataPlaceholder />
        </Box>
      ) : (
        <Box mx={3}>
          <Typography.H6 mb={2}>Class</Typography.H6>
          <Flex mb={3}>
            {classes.data?.map(({ id, name }) => (
              <Chip
                key={id}
                text={name}
                activeBackground="primary"
                onClick={() => setClassId(id)}
                isActive={id === classId}
              />
            ))}
          </Flex>
        </Box>
      )}

      <Box mx={3}>
        <Typography.H6 mb={2}>Repetition</Typography.H6>
        <Flex>
          <Chip
            text="None"
            activeBackground="primary"
            onClick={() => setRepetition(0)}
            isActive={repetition === 0}
          />
          <Chip
            text="Daily"
            activeBackground="primary"
            onClick={() => setRepetition(1)}
            isActive={repetition === 1}
          />
          <Chip
            text="Weekly"
            activeBackground="primary"
            onClick={() => setRepetition(2)}
            isActive={repetition === 2}
          />
        </Flex>
        {repetition > 0 && (
          <Box mt={1}>
            <DateInput
              label="Repeat Until"
              value={endDate.toDate()}
              onChange={(value) => setEndDate(dayjs(value))}
              mb={2}
            />
          </Box>
        )}
      </Box>

      <Box mx={3} mb={4}>
        <Button
          disabled={classId === "" || title === ""}
          mt={3}
          onClick={async () => {
            const result = await mutate({
              title,
              description,
              classId,
              date,
            })
            if (result.ok) {
              await navigate(ALL_PLANS_URL(date))
            }
          }}
          sx={{ width: "100%" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default PageNewPlan
