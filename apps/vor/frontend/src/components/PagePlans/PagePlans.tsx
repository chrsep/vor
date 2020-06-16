/** @jsx jsx */
import { FC, useState } from "react"
import { jsx, Button, Box, Flex, Card } from "theme-ui"
import dayjs from "../../dayjs"
import Typography from "../Typography/Typography"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"

import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import useGetPlans from "../../api/plans/useGetPlans"
import { Link } from "../Link/Link"
import { ALL_PLANS_URL, NEW_PLANS_URL, PLANS_DETAILS_URL } from "../../routes"

interface Props {
  date?: string
}
export const PagePlans: FC<Props> = ({ date }) => {
  const [selectedDate, setSelectedDate] = useState(date ? dayjs(date) : dayjs())
  const { data } = useGetPlans(selectedDate)

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <Flex sx={{ alignItems: "center" }} mx={3} my={3}>
        <Typography.Body sx={{ fontSize: 1 }}>
          {selectedDate.format("ddd, DD MMM 'YY")}
        </Typography.Body>
        <Button
          variant="outline"
          py={1}
          px={1}
          mr={1}
          ml="auto"
          aria-label="previous-date"
          onClick={() => {
            const newDate = selectedDate.add(-1, "day")
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState({}, "", ALL_PLANS_URL(newDate))
          }}
        >
          <Icon as={PrevIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          mr={2}
          py={1}
          px={1}
          aria-label="next-date"
          onClick={() => {
            const newDate = selectedDate.add(1, "day")
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState({}, "", ALL_PLANS_URL(newDate))
          }}
        >
          <Icon as={NextIcon} m={0} />
        </Button>
        <Button
          variant="outline"
          py={1}
          px={3}
          onClick={() => {
            const newDate = dayjs()
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState({}, "", ALL_PLANS_URL(newDate))
          }}
          disabled={selectedDate.isSame(dayjs(), "day")}
        >
          Today
        </Button>
      </Flex>
      {data?.map((plan) => {
        return (
          <Link
            to={PLANS_DETAILS_URL(plan.id)}
            sx={{ display: "block", mx: [0, 3], mb: [0, 2] }}
          >
            <Card p={3} sx={{ borderRadius: [0, "default"] }}>
              <Typography.Body
                sx={{
                  fontSize: 1,
                }}
              >
                {plan.title}
              </Typography.Body>
            </Card>
          </Link>
        )
      })}
      <Link
        to={NEW_PLANS_URL(selectedDate)}
        sx={{ display: "block", mx: [0, 3] }}
      >
        <Card
          px={3}
          py={2}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: [0, "default"],
          }}
        >
          <Icon as={PlusIcon} m={0} fill="primaryDark" />
          <Typography.Body
            ml={3}
            sx={{
              fontSize: 1,
            }}
            color="textMediumEmphasis"
          >
            Add plan
          </Typography.Body>
        </Card>
      </Link>
    </Box>
  )
}

export default PagePlans
