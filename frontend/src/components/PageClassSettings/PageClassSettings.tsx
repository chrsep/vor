import React, { FC } from "react"
import GatsbyImage, { FixedObject } from "gatsby-image"
import { graphql, useStaticQuery } from "gatsby"
import { Link } from "gatsby-plugin-intl3"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../pages/dashboard/settings"
import Flex from "../Flex/Flex"
import Typography from "../Typography/Typography"
import Button from "../Button/Button"
import { NEW_CLASS_URL } from "../../pages/dashboard/settings/class/new"
import useGetSchoolClasses from "../../api/useGetSchoolClasses"
import Card from "../Card/Card"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Box } from "../Box/Box"
import { EDIT_CLASS_URL } from "../../pages/dashboard/settings/class/edit"

export const PageClassSettings: FC = () => {
  const classes = useGetSchoolClasses()

  const haveNoClass = classes.status === "success" && classes.data?.length === 0

  return (
    <Flex flexDirection="column" maxWidth="maxWidth.md" mx="auto">
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      {classes.status === "loading" && <LoadingState />}
      {haveNoClass && <NoClassPlaceholder />}
      {(classes.data?.length ?? 0) > 0 && (
        <Flex alignItems="center" m={3} mb={4}>
          <Typography.H3 mr="auto" lineHeight={1}>
            Classes
          </Typography.H3>
          <Link to={NEW_CLASS_URL}>
            <Button>New</Button>
          </Link>
        </Flex>
      )}
      {classes.data?.map(({ id, name }) => (
        <Link key={id} to={EDIT_CLASS_URL(id)}>
          <Card mx={3} mb={2} p={3}>
            <Typography.Body>{name}</Typography.Body>
          </Card>
        </Link>
      ))}
    </Flex>
  )
}

const NoClassPlaceholder: FC = () => {
  const illustration = useStaticQuery(graphql`
    query {
      file: file(relativePath: { eq: "calendar-colour.png" }) {
        childImageSharp {
          fixed(width: 230, height: 230) {
            ...GatsbyImageSharpFixed_withWebp
          }
        }
      }
    }
  `)

  return (
    <Flex flexDirection="column" m={3} pt={4} alignItems="center">
      <GatsbyImage
        fixed={illustration?.file?.childImageSharp?.fixed as FixedObject}
      />
      <Typography.Body
        my={4}
        mx={4}
        sx={{ textAlign: "center" }}
        maxWidth={300}
      >
        Tell us about your classes, We&apos;ll help you track your students
        attendance.
      </Typography.Body>
      <Link to={NEW_CLASS_URL}>
        <Button>New Class</Button>
      </Link>
    </Flex>
  )
}

const LoadingState: FC = () => (
  <Box m={3}>
    <LoadingPlaceholder width="20rem" height={48} mb={3} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
  </Box>
)

export default PageClassSettings
