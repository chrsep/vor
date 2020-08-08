import React, { FC, PropsWithoutRef, useEffect } from "react"
import { Global, keyframes } from "@emotion/core"
import { BoxProps, Card, Flex, Box } from "theme-ui"
import Portal from "../Portal/Portal"

const dialogEnterAnim = keyframes(`
  0% {
    transform: translateY(64px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`)

const bgEnterAnim = keyframes(`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`)

function disableScroll(e: TouchEvent): boolean {
  e.preventDefault()
  return false
}

interface Props extends PropsWithoutRef<BoxProps> {
  visible?: boolean
}
export const Dialog: FC<Props> = ({ sx, ...props }) => {
  // disable scroll on iOS.
  useEffect(() => {
    document.body.addEventListener("touchmove", disableScroll)
    return () => {
      document.body.removeEventListener("touchmove", disableScroll)
    }
  })

  return (
    <Portal>
      <Flex
        as="dialog"
        role="dialog"
        p={[0, 3]}
        sx={{
          background: "transparent",
          height: "100%",
          width: "100%",
          justifyContent: ["", "center"],
          flexDirection: "column-reverse",
          alignItems: ["", "center"],
          border: "none",
          top: 0,
          left: 0,
          zIndex: 1000001,
          position: "fixed",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "overlay",
            width: "100%",
            height: "100%",
            zIndex: 1000002,
            animation: `${bgEnterAnim} 0.175s`,
          }}
        />
        <Card
          backgroundColor="surface"
          pb="env(safe-area-inset-bottom)"
          sx={{
            maxHeight: "100vh",
            width: "100%",
            maxWidth: "maxWidth.xsm",
            borderTopLeftRadius: "default",
            borderTopRightRadius: "default",
            borderBottomLeftRadius: [0, "default"],
            borderBottomRightRadius: [0, "default"],
            animation: `${dialogEnterAnim} 0.175s`,
            zIndex: 1000003,
            ...sx,
          }}
          {...props}
        />
        <GlobalStyle />
      </Flex>
    </Portal>
  )
}

const GlobalStyle: FC = () => (
  <Global styles={{ body: { overflow: "hidden" } }} />
)

export default Dialog
