import React, { FC } from "react"
import { Box, Button, Flex } from "theme-ui"
import { Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { borderBottom } from "../../border"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import Markdown from "../Markdown/Markdown"

export interface MultilineDataBoxProps {
  label: string
  value: string
  onEditClick?: () => void
  placeholder: string
}
export const MultilineDataBox: FC<MultilineDataBoxProps> = ({
  label,
  value,
  onEditClick,
  placeholder,
}) => {
  const { i18n } = useLingui()

  return (
    <Box sx={{ alignItems: "flex-start" }}>
      <Flex sx={{ ...borderBottom, alignItems: "center" }}>
        <Typography.H6 m={3}>
          <Trans id={label} />
        </Typography.H6>
        <Button
          variant="outline"
          ml="auto"
          mr={3}
          p={2}
          onClick={onEditClick}
          aria-label={`edit-${label.toLowerCase()}`}
          data-cy={`edit-${label.toLowerCase()}`}
          sx={{ color: "textMediumEmphasis" }}
        >
          <Icon as={EditIcon} />
        </Button>
      </Flex>
      <Markdown markdown={value || i18n._(placeholder)} m={3} />
    </Box>
  )
}

export default MultilineDataBox
