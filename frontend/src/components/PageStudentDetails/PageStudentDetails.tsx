import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { FormattedDate, FormattedRelativeTime, Link } from "gatsby-plugin-intl3"
import isSameDay from "date-fns/isSameDay"
import startOfDay from "date-fns/startOfDay"
import differenceInDays from "date-fns/differenceInDays"
import differenceInCalendarDays from "date-fns/differenceInCalendarDays"
import { useGetStudent } from "../../api/useGetStudent"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import Typography, { TextProps } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import Button from "../Button/Button"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import { BackNavigation } from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Observation, useGetObservations } from "../../api/useGetObservations"
import EditObservationDialog from "../EditObservationDialog/EditObservationDialog"
import DeleteObservationDialog from "../DeleteObservationDialog/DeleteObservationDialog"
import ObservationCard from "../ObservationCard/ObservationCard"
import Spacer from "../Spacer/Spacer"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { ALL_OBSERVATIONS_PAGE_URL } from "../../pages/dashboard/observe/students/observations/all"

interface Props {
  id: string
}
export const PageStudentDetails: FC<Props> = ({ id }) => {
  const [isEditingObservation, setIsEditingObservation] = useState(false)
  const [isDeletingObservation, setIsDeletingObservation] = useState(false)
  const [targetObservation, setTargetObservation] = useState<Observation>()
  const [selectedDate, setSelectedDate] = useState(0)
  const student = useGetStudent(id)
  const observations = useGetObservations(id)

  const dates = [
    ...new Set(
      observations.data?.map(({ createdDate }) =>
        startOfDay(Date.parse(createdDate ?? "")).toISOString()
      )
    ),
  ]?.sort((a, b) => differenceInDays(Date.parse(b), Date.parse(a)))

  const selectedDateDifference = differenceInCalendarDays(
    Date.parse(dates?.[selectedDate] ?? ""),
    Date.now()
  )

  const listOfObservations = observations.data
    ?.filter((observation) =>
      isSameDay(
        Date.parse(observation.createdDate ?? ""),
        Date.parse(dates[selectedDate])
      )
    )
    ?.map((observation) => (
      <ObservationCard
        key={observation.id}
        observation={observation}
        onDelete={(value) => {
          setTargetObservation(value)
          setIsDeletingObservation(true)
        }}
        onEdit={(value) => {
          setTargetObservation(value)
          setIsEditingObservation(true)
        }}
      />
    ))

  const emptyObservationPlaceholder = observations.status !== "loading" &&
    (observations.data ?? []).length === 0 && (
      <EmptyListPlaceholder
        mx={[0, 3]}
        borderRadius={[0, "default"]}
        text="No observation have been added yet"
        callToActionText="new observation"
        onActionClick={() =>
          navigate(
            `/dashboard/observe/students/observations/new?studentId=${id}`
          )
        }
      />
    )

  const dateSelector = (observations.data?.length ?? 0) > 0 && (
    <Flex alignItems="center" px={3} mb={3}>
      <Button
        disabled={selectedDate >= dates.length - 1}
        onClick={() => setSelectedDate(selectedDate + 1)}
        variant="outline"
        py={1}
        px={2}
      >
        <Icon as={PrevIcon} m={0} />
      </Button>
      <Typography.Body
        flex={1}
        textAlign="center"
        fontSize={1}
        color="textMediumEmphasis"
        sx={{ textTransform: "capitalize" }}
      >
        {selectedDateDifference > -3 ? (
          <FormattedRelativeTime
            value={selectedDateDifference}
            unit="day"
            numeric="auto"
          />
        ) : (
          <FormattedDate
            value={dates?.[selectedDate]}
            month="short"
            year="numeric"
            weekday="short"
            day="2-digit"
          />
        )}
      </Typography.Body>
      <Button
        disabled={selectedDate < 1}
        onClick={() => setSelectedDate(selectedDate - 1)}
        variant="outline"
        py={1}
        px={2}
      >
        <Icon as={NextIcon} m={0} />
      </Button>
    </Flex>
  )

  return (
    <>
      <Box maxWidth="maxWidth.sm" margin="auto" pb={5}>
        <BackNavigation text="Home" to="/dashboard/observe" />
        <Flex alignItems="start" mx={3} mb={4} mt={0}>
          <Typography.H3 sx={{ wordWrap: "break-word" }}>
            {student.data?.name || (
              <LoadingPlaceholder width="24rem" height={60} />
            )}
          </Typography.H3>
          <Spacer />
          <Button
            data-cy="edit"
            mt={11}
            ml={3}
            minWidth={43}
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/observe/students/edit?id=${id}`)
            }
          >
            <Icon minWidth={20} as={EditIcon} m={0} />
          </Button>
        </Flex>
        <Box m={3} mb={2}>
          <Link
            to={`/dashboard/observe/students/observations/new?studentId=${id}`}
          >
            <Button width="100%">
              <Icon as={PlusIcon} m={0} mr={2} fill="onPrimary" />
              Add Observation
            </Button>
          </Link>
        </Box>
        <Flex pt={4} px={3} mb={3} alignItems="center">
          <SectionHeader mr="auto" lineHeight={1}>
            OBSERVATIONS
          </SectionHeader>
          <Link to={ALL_OBSERVATIONS_PAGE_URL(id)}>
            <Button variant="outline">All</Button>
          </Link>
        </Flex>
        {emptyObservationPlaceholder}
        {dateSelector}
        <Box mx={[0, 3]} mb={3}>
          {listOfObservations}
          {observations.status === "loading" && !observations.data && (
            <ObservationLoadingPlaceholder />
          )}
        </Box>
        <Box py={3} mb={1}>
          <SectionHeader m={3}>PROGRESS</SectionHeader>
          <StudentProgressSummaryCard studentId={id} />
        </Box>
      </Box>
      {isEditingObservation && (
        <EditObservationDialog
          defaultValue={targetObservation}
          onDismiss={() => setIsEditingObservation(false)}
          onSaved={async () => {
            await observations.refetch()
            setIsEditingObservation(false)
          }}
        />
      )}
      {isDeletingObservation && targetObservation && (
        <DeleteObservationDialog
          observationId={targetObservation.id ?? ""}
          shortDesc={targetObservation?.shortDesc}
          onDismiss={() => setIsDeletingObservation(false)}
          onDeleted={async () => {
            await observations.refetch()
            setIsDeletingObservation(false)
          }}
        />
      )}
    </>
  )
}

const SectionHeader: FC<TextProps> = (props) => (
  <Typography.H5
    fontWeight="normal"
    color="textMediumEmphasis"
    letterSpacing={3}
    {...props}
  />
)

const ObservationLoadingPlaceholder: FC = () => (
  <Box>
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
    <LoadingPlaceholder
      width="100%"
      height={116}
      mb={2}
      sx={{ borderRadius: [0, "default"] }}
    />
  </Box>
)

export default PageStudentDetails
