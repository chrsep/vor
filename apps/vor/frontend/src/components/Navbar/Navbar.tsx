import React, { FC, FunctionComponent, useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import GatsbyImage from "gatsby-image"
import { useLocation, useMatch } from "@reach/router"
import { useMemoryStatus } from "react-adaptive-hooks/memory"
import Card from "../Card/Card"
import Flex from "../Flex/Flex"
import Box from "../Box/Box"
import { ReactComponent as EditIcon } from "../../icons/edit2.svg"
import { ReactComponent as SettingsIcon } from "../../icons/settings.svg"
import { Link } from "../Link/Link"
import Icon from "../Icon/Icon"
import { Typography } from "../Typography/Typography"

const Navbar: FC = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [lastVh, setLastVh] = useState(0)
  const { deviceMemory } = useMemoryStatus({ deviceMemory: 4 })

  const query = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "logo-transparent.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(width: 40, height: 40) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  useEffect(() => {
    const listener: EventListener = () => {
      const vh = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      )
      if (vh === lastVh) return
      if (vh < 400) {
        setKeyboardShown(true)
        setLastVh(vh)
      } else {
        setKeyboardShown(false)
        setLastVh(vh)
      }
    }
    window.addEventListener("resize", listener)
    return () => {
      window.removeEventListener("resize", listener)
    }
  }, [lastVh])

  return (
    <Card
      display={[keyboardShown ? "none" : "block", "block"]}
      as="nav"
      borderRadius={0}
      height={["auto", "100%"]}
      width={["100%", "auto"]}
      backgroundColor="surface"
      sx={{
        zIndex: 5,
        top: ["auto", 0],
        bottom: [0, "auto"],
        left: 0,
        position: "fixed",
        borderTopStyle: "solid",
        borderTopWidth: 1,
        borderTopColor: "borderSubtle",
        "@supports (backdrop-filter: blur(20px))":
          // Only enable on mid to hi end devices, blur is an expensive effect, turned on by default by devices that doesn't
          // support navigator.deviceMemory.
          // 1. On iOS <11 devices, this deviceMemory will always be 4 (the default value for the hooks)
          //    because navigator.deviceMemory is not supported on iOS <11. And the blur effects works
          //    really well on iOS.
          // 2. On all firefox browser as of 11/03/2020, the blur effect will be ignored (not supported).
          // 3. Chrome on android devices, which is where the majority of low end devices lies,
          //    navigator.deviceMemory is supported. This effects will then be disabled on low end devices
          //    with memory up-to 2GB, such as Galaxy S5, which performance got hit really bad with this effect,
          // 4. This will always be turned on before js is loaded, since gatsby's build step will use the default value.
          //    which means the initial html will always include the blur effect. But it doesn't matter, because at load,
          //    the html content is pretty simple.
          deviceMemory > 2
            ? {
                backgroundColor: "surfaceBlurTransparent",
                backdropFilter: "saturate(180%) blur(20px)",
                transform: "translateZ(0)",
                willChange: "backdrop-filter",
              }
            : {},
      }}
    >
      <Flex
        flexDirection={["row", "column"]}
        justifyContent={["space-evenly"]}
        height={["auto", "100%"]}
        pb={["env(safe-area-inset-bottom)", 0]}
        pl="env(safe-area-inset-left)"
      >
        <Box mx="auto" my={3} display={["none", "block"]} mb={4}>
          <GatsbyImage fixed={query.file.childImageSharp.fixed} />
        </Box>
        <NavBarItem title="Observe" icon={EditIcon} to="/dashboard/observe" />
        <Box height="100%" display={["none", "block"]} />
        <NavBarItem
          title="Settings"
          icon={SettingsIcon}
          to="/dashboard/settings"
        />
      </Flex>
    </Card>
  )
}

const NavBarItem: FC<{
  title: string
  icon: FunctionComponent
  to: string
}> = ({ title, icon, to }) => {
  const match = useMatch(`${to}/*`)
  const [target, setTarget] = useState(to)
  const location = useLocation()
  const url = `${match?.uri}/${match?.["*"]}${location.search}` ?? ""

  // Implement bottom navigation bar behaviour that follows patterns described
  // on material.io
  useEffect(() => {
    if (match?.uri) {
      setTarget(url)
    }
  }, [url, match])

  return (
    <Link
      to={url === target ? to : target}
      state={{ preserveScroll: true }}
      style={{
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        height={[48, 60]}
        mb={[0, 2]}
        width={[60, 70]}
        py={1}
        sx={{
          position: "relative",
          "&:after": {
            top: [0, "inherit"],
            right: ["inherit", 0],
            position: "absolute",
            backgroundColor: "textPrimary",
            borderRadius: ["0 0 10px 10px", "10px 0 0 10px"],
            width: [match ? "100%" : "0%", 2],
            height: [2, match ? "100%" : "0%"],
            content: "''",
            transition: "width 100ms cubic-bezier(0.0, 0.0, 0.2, 1)",
          },
        }}
      >
        <Icon
          as={icon}
          m={0}
          size={24}
          fill={match ? "textPrimary" : "textDisabled"}
        />
        <Typography.Body
          lineHeight={1}
          fontSize={["10px", 0]}
          color={match ? "textPrimary" : "textMediumEmphasis"}
          fontWeight={match ? "bold" : "normal"}
        >
          {title}
        </Typography.Body>
      </Flex>
    </Link>
  )
}

export default Navbar
