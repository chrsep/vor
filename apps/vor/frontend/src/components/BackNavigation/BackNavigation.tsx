import React, { FC } from "react"
import { Flex } from "theme-ui"
import { Link } from "../Link/Link"
import Icon from "../Icon/Icon"
import { ReactComponent as Arrow } from "../../icons/arrow-back.svg"
import Typography from "../Typography/Typography"

interface Props {
  to: string
  text: string
}
export const BackNavigation: FC<Props> = ({ to, text }) => (
  <Link to={to} state={{ preserveScroll: true }} style={{ display: "block" }}>
    <Flex sx={{ alignItems: "center" }} ml={-2}>
      <Icon as={Arrow} mr={1} size={24} sx={{ fill: "textMediumEmphasis" }} />
      <Typography.Body mb={0} color="textMediumEmphasis">
        {text}
      </Typography.Body>
    </Flex>
  </Link>
)

export default BackNavigation
