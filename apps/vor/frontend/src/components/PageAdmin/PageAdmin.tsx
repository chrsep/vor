import React, { FC } from "react"
import { Box, Button, Card, Flex, useColorMode } from "theme-ui"
import { Trans } from "@lingui/macro"
import { useLocalization } from "gatsby-theme-i18n"
import { useGetSchool } from "../../hooks/api/schools/useGetSchool"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import Typography from "../Typography/Typography"
import {
  ADMIN_CURRICULUM_URL,
  ADMIN_GUARDIAN_URL,
  ADMIN_INVITE_USER_URL,
  ADMIN_STUDENTS_URL,
  ADMIN_USERS_URL,
  CLASS_SETTINGS_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { ReactComponent as LightModeIcon } from "../../icons/light-mode.svg"
import { ReactComponent as DarkModeIcon } from "../../icons/dark-mode.svg"
import { ReactComponent as GlobeIcon } from "../../icons/globe.svg"
import { Link, navigate } from "../Link/Link"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"

export const PageAdmin: FC = () => {
  const schoolDetail = useGetSchool()

  async function logout(): Promise<void> {
    // @ts-ignore
    if (window.$chatwoot) {
      // @ts-ignore
      window.$chatwoot.reset()
    }
    const response = await fetch("/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })
    if (response.status === 200) {
      await navigate("/login")
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} m="auto" pb={5}>
      {schoolDetail.status === "loading" ? (
        <LoadingPlaceholder
          sx={{ width: "10rem", height: 27 }}
          mx={3}
          mb={3}
          mt={4}
        />
      ) : (
        <Typography.H6 mx={3} mb={3} mt={4} sx={{ height: 27 }}>
          {schoolDetail.data?.name}
        </Typography.H6>
      )}
      <Card mb={3} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Link to={ADMIN_CURRICULUM_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>Curriculum</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
        <Link to={CLASS_SETTINGS_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>Class</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
        <Link to={ADMIN_STUDENTS_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>All Students</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
        <Link to={ADMIN_GUARDIAN_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>All Guardians</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
      </Card>

      <Card mb={3} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Link to={ADMIN_USERS_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>Users</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
        <Link to={ADMIN_INVITE_USER_URL}>
          <Flex p={3}>
            <Typography.Body>
              <Trans>Invite Your Team</Trans>
            </Typography.Body>
            <Icon as={NextIcon} ml="auto" />
          </Flex>
        </Link>
      </Card>

      <Card mb={3} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <I18nButton />
        <ThemeModeButton />
      </Card>

      <Flex
        mt={2}
        px={[3, 0]}
        mx={[0, 3]}
        sx={{ flexDirection: ["column", "row"] }}
      >
        <Button
          variant="outline"
          ml="auto"
          color="warning"
          onClick={() => navigate("/choose-school")}
          sx={{ width: ["100%", "auto"], flexShrink: 0 }}
          mb={3}
        >
          <Trans>Switch school</Trans>
        </Button>
        <Button
          variant="outline"
          ml={[0, 2]}
          color="danger"
          onClick={logout}
          mb={3}
        >
          <Trans>Log Out</Trans>
        </Button>
      </Flex>
    </Box>
  )
}

const I18nButton = () => {
  const { locale } = useLocalization()

  return (
    <Flex
      sx={{ alignItems: "center", cursor: "pointer" }}
      p={3}
      onClick={() => {
        window.localStorage.setItem(
          "preferred-lang",
          locale === "id" ? "en" : "id"
        )
        window.location.replace(
          `${locale === "id" ? "" : "/id"}/dashboard/admin`
        )
      }}
      data-cy={locale === "en" ? "switch-indonesian" : "switch-english"}
    >
      <Icon as={GlobeIcon} fill="background" />
      <Box ml={3}>
        <Typography.Body color="textMediumEmphasis" sx={{ fontSize: 0 }}>
          <Trans>Language</Trans>
        </Typography.Body>
        <Typography.Body>
          {locale === "en" ? "English" : "Indonesian"}
        </Typography.Body>
      </Box>
      <Icon as={NextIcon} ml="auto" />
    </Flex>
  )
}

const ThemeModeButton: FC = () => {
  const [colorMode, setColorMode] = useColorMode()
  return (
    <Flex
      p={3}
      onClick={() => setColorMode(colorMode === "dark" ? "default" : "dark")}
      data-cy={colorMode === "dark" ? "light-switch" : "dark-switch"}
      sx={{ alignItems: "center", cursor: "pointer" }}
    >
      {colorMode === "dark" ? (
        <Icon as={DarkModeIcon} />
      ) : (
        <Icon as={LightModeIcon} />
      )}
      <Box ml={3}>
        <Typography.Body color="textMediumEmphasis" sx={{ fontSize: 0 }}>
          <Trans>Theme</Trans>
        </Typography.Body>
        <Typography.Body>
          {colorMode === "dark" ? <Trans>Dark</Trans> : <Trans>Light</Trans>}
        </Typography.Body>
      </Box>

      <Icon as={NextIcon} ml="auto" />
    </Flex>
  )
}

export default PageAdmin
