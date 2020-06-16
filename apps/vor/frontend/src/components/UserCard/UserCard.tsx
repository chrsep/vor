import React, { FC } from "react"
import { Flex, Card } from "theme-ui"
import Typography from "../Typography/Typography"
import Spacer from "../Spacer/Spacer"

import Pill from "../Pill/Pill"

interface Props {
  name: string
  email: string
  isCurrentUser: boolean
}
export const UserCard: FC<Props> = ({ email, name, isCurrentUser }) => (
  <Card p={3} mt={2}>
    <Flex sx={{ alignItems: "start" }}>
      <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
        <Typography.H6>{name}</Typography.H6>
        <Typography.Body
          sx={{
            fontSize: 1,
          }}
          color="textMediumEmphasis"
        >
          {email}
        </Typography.Body>
      </Flex>
      <Spacer />
      {isCurrentUser && (
        <Pill
          text="You"
          m={1}
          color="onPrimary"
          sx={{ backgroundColor: "primary" }}
        />
      )}
    </Flex>
  </Card>
)

export default UserCard
