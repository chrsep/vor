import React, { FC } from "react"
import { BoxProps, Box } from "theme-ui"
import Typography from "../Typography/Typography"

interface Props extends BoxProps {
  text: string
  activeBackground: string
  isActive?: boolean
}
export const Chip: FC<Props> = ({
  isActive,
  activeBackground,
  text,
  sx,
  ...props
}) => (
  <Box
    {...props}
    backgroundColor={isActive ? activeBackground : "surface"}
    mr={2}
    mb={2}
    px={2}
    sx={{
      ...sx,
      userSelect: "none",
      cursor: "pointer",
      borderRadius: "default",
      borderColor: "border",
      borderWidth: 1,
      borderStyle: "solid",
      whiteSpace: "nowrap",
      "&:hover": {
        backgroundColor: isActive ? activeBackground : "primaryLightest",
      },
    }}
  >
    <Typography.Body
      sx={{
        fontSize: 1,
      }}
      color={isActive ? "onPrimary" : "text"}
    >
      {text}
    </Typography.Body>
  </Box>
)

export default Chip
