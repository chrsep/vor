import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, BoxProps, Text } from "theme-ui"
import { borderFull } from "../../border"

interface Props extends Omit<BoxProps, "css"> {
  text?: string
}
export const Pill: FC<Props> = ({ sx, color, text, ...props }) => (
  <Box
    py={1}
    px={2}
    sx={{
      ...borderFull,
      borderRadius: "circle",
      flexShrink: 0,
      display: "inline-block",
      ...sx,
    }}
    {...props}
  >
    <Text
      color={color}
      sx={{
        display: "block",
        fontSize: 0,
        textTransform: "capitalize",
      }}
    >
      <Trans id={text} />
    </Text>
  </Box>
)

export default Pill
