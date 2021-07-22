import { FC, PropsWithoutRef } from "react"
import { Heading, HeadingProps, Text, TextProps } from "theme-ui"

/** @deprecated use Text from theme-ui */
export const Typography: {
  H1: FC<HeadingProps>
  H2: FC<HeadingProps>
  H3: FC<HeadingProps>
  H4: FC<HeadingProps>
  H5: FC<HeadingProps>
  H6: FC<HeadingProps>
  Body: FC<PropsWithoutRef<TextProps>>
} = {
  /** @deprecated use Text from theme-ui */
  H1: (props) => <Heading as="h1" variant="h1" {...props} />,
  /** @deprecated use Text from theme-ui */
  H2: (props) => <Heading as="h2" variant="h2" {...props} />,
  /** @deprecated use Text from theme-ui */
  H3: (props) => <Heading as="h3" variant="h3" {...props} />,
  /** @deprecated use Text from theme-ui */
  H4: (props) => <Heading as="h4" variant="h4" {...props} />,
  /** @deprecated use Text from theme-ui */
  H5: (props) => <Heading as="h5" variant="h5" {...props} />,
  /** @deprecated use Text from theme-ui */
  H6: (props) => <Heading as="h6" variant="h6" {...props} />,
  /** @deprecated use Text from theme-ui */
  Body: (props) => <Text variant="body" as="p" {...props} />,
}

/** @deprecated use Text from theme-ui */
export default Typography
