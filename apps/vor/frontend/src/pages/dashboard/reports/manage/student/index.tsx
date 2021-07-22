import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderFull, borderLeft } from "../../../../../border"
import Icon from "../../../../../components/Icon/Icon"
import ImagePreview from "../../../../../components/ImagePreview/ImagePreview"
import Markdown from "../../../../../components/Markdown/Markdown"
import MarkdownEditor from "../../../../../components/MarkdownEditor/MarkdownEditor"
import Pill from "../../../../../components/Pill/Pill"
import SEO from "../../../../../components/seo"
import Tab from "../../../../../components/Tab/Tab"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../../components/TranslucentBar/TranslucentBar"
import { getFirstName } from "../../../../../domain/person"
import useGetReport from "../../../../../hooks/api/reports/useGetProgressReport"
import { useGetCurriculumAreas } from "../../../../../hooks/api/useGetCurriculumAreas"
import { useGetStudent } from "../../../../../hooks/api/useGetStudent"
import {
  materialStageToString,
  useGetStudentAssessments,
} from "../../../../../hooks/api/useGetStudentAssessments"
import {
  Observation,
  useGetStudentObservations,
} from "../../../../../hooks/api/useGetStudentObservations"
import { useQueryString } from "../../../../../hooks/useQueryString"
import { ReactComponent as ChevronDown } from "../../../../../icons/chevron-down.svg"
import { ReactComponent as ChevronUp } from "../../../../../icons/chevron-up.svg"
import { ReactComponent as EyeIcon } from "../../../../../icons/eye.svg"
import { ALL_REPORT_URL, MANAGE_REPORT_URL } from "../../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")

  const report = useGetReport(reportId)
  const observations = useGetStudentObservations(studentId)
  const areas = useGetCurriculumAreas()
  const assessments = useGetStudentAssessments(studentId)
  const [areaIdx, setAreaIdx] = useState(0)
  const student = useGetStudent(studentId)

  const filteredObservations = observations.data?.filter(({ area }) => {
    return area?.id === areas.data?.[areaIdx].id
  })

  const filteredAssessments = assessments.data?.filter(({ areaId }) => {
    return areaId === areas.data?.[areaIdx].id
  })

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <SEO title={`${student.data?.name} | Progress Report`} />

      <TranslucentBar>
        <TopBar
          containerSx={borderBottom}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title, MANAGE_REPORT_URL(reportId)),
            breadCrumb(getFirstName(student.data)),
          ]}
        />

        <Flex p={3} sx={{ ...borderBottom, alignItems: "center" }}>
          <Button variant="outline" p={0}>
            <Icon as={ChevronUp} size={24} />
          </Button>

          <Button variant="outline" p={0} ml={1}>
            <Icon as={ChevronDown} size={24} />
          </Button>

          <Text ml={3} mr="auto" sx={{ fontWeight: "bold", fontSize: 1 }}>
            {student.data?.name}
          </Text>

          <Button>Done</Button>
        </Flex>

        <Box sx={{ minHeight: 47 }}>
          <Tab
            small
            items={areas.data?.map((area) => area.name) ?? []}
            selectedItemIdx={areaIdx}
            onTabClick={setAreaIdx}
          />
        </Box>
      </TranslucentBar>

      <Box
        sx={{
          display: ["block", "block", "block", "flex"],
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Box
          m={3}
          sx={{
            top: 3,
            position: "sticky",
            borderRadius: "default",
            width: "100%",
            backgroundColor: "surface",
            ...borderFull,
          }}
        >
          <Box px={3} py={2}>
            <Text color="textMediumEmphasis" sx={{ fontWeight: "bold" }}>
              <Trans>Comments on {areas.data?.[areaIdx].name}</Trans>
            </Text>
          </Box>

          <MarkdownEditor
            onChange={() => {}}
            value=""
            placeholder="Add some details"
          />
        </Box>

        <Box
          sx={{
            minHeight: "100vh",
            width: 640,
            ...borderLeft,
          }}
        >
          <Box p={3} sx={{ width: "100%", ...borderBottom }}>
            <Text sx={{ fontWeight: "bold" }}>
              <Trans>Assessments</Trans>
            </Text>
          </Box>

          {filteredAssessments?.length === 0 && observations.isSuccess && (
            <Box p={3} sx={{ ...borderBottom }}>
              <Text>
                <Trans>No assessments has been made yet.</Trans>
              </Text>
            </Box>
          )}

          {filteredAssessments?.length !== 0 && observations.isSuccess && (
            <Box sx={{ overflow: "hidden" }}>
              {filteredAssessments?.map(
                ({ materialId, materialName, stage }) => {
                  const stageName = materialStageToString(stage)
                  return (
                    <Flex
                      key={materialId}
                      px={3}
                      py={2}
                      sx={{ alignItems: "center", ...borderBottom }}
                    >
                      <Text sx={{ fontSize: 0 }} mr={3}>
                        {materialName}
                      </Text>
                      <Pill
                        color={`materialStage.on${stageName}`}
                        backgroundColor={`materialStage.${stageName.toLowerCase()}`}
                        text={stageName}
                        ml="auto"
                      />
                    </Flex>
                  )
                }
              )}
            </Box>
          )}

          <Box p={3} sx={{ width: "100%", ...borderBottom }}>
            <Text sx={{ fontWeight: "bold" }}>
              <Trans>Observations</Trans>
            </Text>
          </Box>

          {filteredObservations?.length === 0 && observations.isSuccess && (
            <Box mb={3} sx={{ overflow: "hidden" }} p={3}>
              <Text>
                <Trans>No observation has been added.</Trans>
              </Text>
            </Box>
          )}

          {filteredObservations?.map((observation) => (
            <ObservationListItem
              key={observation.id}
              observation={observation}
              studentId={studentId}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const ObservationListItem: FC<{
  observation: Observation
  studentId: string
}> = ({ studentId, observation }) => (
  <Box pt={3} sx={borderBottom}>
    <Flex mb={2} mx={3}>
      <Text
        data-cy="observation-short-desc"
        sx={{ fontWeight: "bold", alignItems: "center" }}
      >
        {observation.shortDesc}
      </Text>
      {observation.visibleToGuardians && <Icon as={EyeIcon} ml="auto" />}
    </Flex>

    {observation.longDesc && (
      <Markdown
        mx={3}
        mb={3}
        data-cy="observation-long-desc"
        markdown={observation.longDesc}
      />
    )}

    <Flex ml={3}>
      {observation.area && (
        <Text
          mb={3}
          mr={1}
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textPrimary"
        >
          {observation.area.name} {observation.creatorName && "|"}
        </Text>
      )}
      {observation.creatorName && (
        <Text
          mb={3}
          sx={{ fontSize: 0, lineHeight: 1 }}
          color="textMediumEmphasis"
        >
          <Trans>By </Trans>
          {` ${observation.creatorName}`}
        </Text>
      )}
    </Flex>

    <Flex sx={{ alignItems: "baseline", flexWrap: "wrap" }} mx={3}>
      {observation.images.map(({ id, originalUrl, thumbnailUrl }) => (
        <ImagePreview
          studentId={studentId}
          imageId={id}
          key={id}
          id={id}
          originalUrl={originalUrl}
          thumbnailUrl={thumbnailUrl}
          imageSx={{ mr: 2, mb: 3 }}
        />
      ))}
    </Flex>
  </Box>
)

export default ManageReports
