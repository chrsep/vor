import { Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Flex } from "theme-ui"
import { borderFull } from "../../border"
import { ReactComponent as MarkdownIcon } from "../../icons/markdown.svg"
import Icon from "../Icon/Icon"
import Markdown from "../Markdown/Markdown"
import { Typography } from "../Typography/Typography"

export interface MarkdownEditorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}
const MarkdownEditor: FC<MarkdownEditorProps> = ({
  onChange,
  placeholder = "Write something",
  value = "",
}) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <Box>
      {showPreview ? (
        <Box
          p={3}
          sx={{
            borderBottomLeftRadius: "default",
            borderBottomRightRadius: "default",
            minHeight: 408,
          }}
        >
          <Markdown markdown={value} />
        </Box>
      ) : (
        <Box
          px={2}
          sx={{
            borderBottomLeftRadius: "default",
            borderBottomRightRadius: "default",
          }}
        >
          <textarea
            data-cy="markdown-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={{
              lineHeight: "1.7142857",
              outline: "none",
              width: "100%",
              px: 2,
              py: 3,
              border: "none",
              minHeight: 400,
              backgroundColor: "transparent",
            }}
          />
        </Box>
      )}

      <Flex px={2} pb={3} sx={{ alignItems: "center" }}>
        <Button
          variant="secondary"
          as="button"
          ml={2}
          mr={0}
          px={3}
          py={12}
          onClick={() => setShowPreview(false)}
          sx={{
            ...borderFull,
            fontWeight: "bold",
            backgroundColor: !showPreview ? "primaryLightest" : "none",
            color: !showPreview ? "textPrimary" : "textMediumEmphasis",
            borderColor: !showPreview ? "primary" : "border",
            fontSize: 0,
          }}
        >
          <Trans>Write</Trans>
        </Button>
        <Button
          variant="secondary"
          as="button"
          ml={2}
          mr={0}
          px={3}
          py={12}
          onClick={() => setShowPreview(true)}
          sx={{
            ...borderFull,
            fontWeight: "bold",
            color: showPreview ? "warning" : "textMediumEmphasis",
            borderColor: showPreview ? "warning" : "border",
            fontSize: 0,
            "&:hover, &:focus": {
              backgroundColor: "tintWarning",
              color: "warning",
              borderColor: "warning",
            },
          }}
        >
          <Trans>Preview</Trans>
        </Button>

        <a
          href="https://obserfy.com/docs/markdown-support"
          target="_blank"
          rel="noreferrer"
          sx={{
            display: "flex",
            alignItems: "end",
            ml: "auto",
            transition: "color ease-in 0.1s",
            color: "textMediumEmphasis",
            whiteSpace: "nowrap",
            mt: 3,
            mr: 3,
            "&:hover": {
              color: "textPrimary",
            },
          }}
        >
          <Icon as={MarkdownIcon} mr={2} mt={2} sx={{ color: "inherit" }} />

          <Typography.Body
            pr={2}
            mt={2}
            mb={1}
            sx={{
              fontSize: 0,
              color: "inherit",
              lineHeight: 1,
              display: ["none", "none", "block"],
            }}
          >
            <Trans>Markdown Supported</Trans>
          </Typography.Body>
        </a>
      </Flex>
    </Box>
  )
}

export default MarkdownEditor
