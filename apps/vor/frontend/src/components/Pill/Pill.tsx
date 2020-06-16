import React, { FC } from "react"
import { BoxProps, Box } from "theme-ui"
import Typography from "../Typography/Typography"

interface Props extends BoxProps {
  text: string
}
export const Pill: FC<Props> = ({ sx, color, text, ...props }) => {
  const borderProps = {
    borderColor: "border",
    borderWidth: 1,
    borderStyle: "solid",
  }
  return (
    <Box
      py={1}
      px={2}
      sx={{ ...borderProps, borderRadius: "circle", flexShrink: 0, ...sx }}
      {...props}
    >
      <Typography.Body
        color={color}
        sx={{
          fontSize: 0,
          lineHeight: "1em",
          textTransform: "capitalize",
        }}
      >
        {text}
      </Typography.Body>
    </Box>
  )
}

export default Pill
