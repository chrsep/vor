import React, { FC, useState } from "react"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { NEW_STUDENT_URL } from "../../pages/dashboard/observe/students/new"
import Input from "../Input/Input"
import Select from "../Select/Select"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"
import Typography from "../Typography/Typography"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Card from "../Card/Card"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import Flex from "../Flex/Flex"

export const PagePickGuardian: FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [relationship, setRelationship] = useState<GuardianRelationship>(0)
  const [createNew, setCreateNew] = useState(false)

  return (
    <Box maxWidth="maxWidth.sm" mx="auto">
      <BackNavigation to={NEW_STUDENT_URL} text="New Student" />
      <Box m={3}>
        <Input
          value={name}
          mb={2}
          label="Guardian Name"
          width="100%"
          onChange={(e) => setName(e.target.value)}
        />
        {createNew && (
          <>
            <Select
              label="Relationship"
              mb={2}
              onChange={(e) => setRelationship(parseInt(e.target.value, 10))}
              value={relationship}
            >
              <option value={GuardianRelationship.Other}>Other</option>
              <option value={GuardianRelationship.Mother}>Mother</option>
              <option value={GuardianRelationship.Father}>Father</option>
            </Select>
            <Input
              type="email"
              value={email}
              mb={2}
              label="Email"
              width="100%"
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              type="phone"
              value={phone}
              mb={3}
              label="Phone"
              width="100%"
              onChange={(event) => setPhone(event.target.value)}
            />
            <Flex>
              <Button
                ml="auto"
                variant="outline"
                mr={2}
                onClick={() => setCreateNew(false)}
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </Flex>
          </>
        )}
      </Box>
      {!createNew && (
        <>
          <Typography.Body mx={3} mb={2} mt={4} color="textMediumEmphasis">
            Select a guardian or create one
          </Typography.Body>
          {name === "" && (
            <Card
              p={3}
              borderRadius={[0, "default"]}
              display="flex"
              sx={{ alignItems: "center" }}
              mx={[0, 3]}
            >
              <Typography.Body color="textMediumEmphasis">
                Type a guardian name
              </Typography.Body>
            </Card>
          )}
          {name !== "" && (
            <Card
              p={3}
              borderRadius={[0, "default"]}
              display="flex"
              mx={[0, 3]}
              onClick={() => setCreateNew(true)}
              sx={{
                alignItems: "flex-start",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "primaryLightest",
                },
              }}
            >
              <Icon as={PlusIcon} m={0} mt="5px" mr={3} fill="primary" />
              <Typography.Body>Create {name}</Typography.Body>
            </Card>
          )}
        </>
      )}
    </Box>
  )
}

export default PagePickGuardian
