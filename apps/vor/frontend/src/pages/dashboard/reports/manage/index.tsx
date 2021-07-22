import { t } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Flex, Image, Text } from "theme-ui"
import { borderBottom, borderFull } from "../../../../border"
import { Link } from "../../../../components/Link/Link"
import SEO from "../../../../components/seo"
import StudentPicturePlaceholder from "../../../../components/StudentPicturePlaceholder/StudentPicturePlaceholder"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import useGetReport from "../../../../hooks/api/reports/useGetProgressReport"
import { useGetAllStudents } from "../../../../hooks/api/students/useGetAllStudents"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ALL_REPORT_URL, STUDENT_REPORT_URL } from "../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const report = useGetReport(reportId)
  const students = useGetAllStudents("", true)

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <SEO title="Progress Reports" />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ ...borderBottom }}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />

        <Flex
          py={3}
          sx={{
            flexDirection: ["column", "row"],
            alignItems: ["start", "center"],
          }}
        >
          <Text ml={3} pb={[1, 0]} sx={{ fontWeight: "bold" }}>
            {report.data?.title}
          </Text>

          <Text
            ml={3}
            mr="auto"
            color="textMediumEmphasis"
            sx={{ fontSize: 0 }}
          >
            {report.data?.periodStart.format("DD MMMM YYYY")} -{" "}
            {report.data?.periodStart.format("DD MMMM YYYY")}
          </Text>

          <Text ml={3} color="textMediumEmphasis" sx={{ fontSize: 0 }}>
            0 out of {students.data?.length} done
          </Text>

          <Button mx={3} mt={[3, 0]}>
            Publish
          </Button>
        </Flex>
      </TranslucentBar>

      {students.data?.map(({ id, name, classes, profileImageUrl }) => (
        <Student
          key={id}
          image={profileImageUrl}
          reportId={reportId}
          studentId={id}
          name={name}
          classes={classes}
        />
      ))}
    </Box>
  )
}

const Student: FC<{
  image?: string
  reportId: string
  studentId: string
  name: string
  classes: { classId: string; className: string }[]
}> = ({ image, name, reportId, studentId, classes }) => (
  <Link
    to={STUDENT_REPORT_URL(reportId, studentId)}
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      ...borderBottom,
      "&:hover": {
        backgroundColor: "primaryLightest",
      },
    }}
  >
    {image ? (
      <Image src={image} sx={{ ml: 3, width: 24, flexShrink: 0 }} />
    ) : (
      <StudentPicturePlaceholder sx={{ ml: 3, width: 24, flexShrink: 0 }} />
    )}

    <Text mr="auto" p={3} className="truncate">
      {name}
    </Text>

    {classes.map(({ classId, className }) => (
      <Text
        key={classId}
        mr={3}
        color="textMediumEmphasis"
        py={1}
        px={2}
        sx={{
          ...borderFull,
          fontSize: 0,
          borderRadius: "circle",
          backgroundColor: "background",
          display: ["none", "block"],
          flexShrink: 0,
        }}
      >
        {className}
      </Text>
    ))}

    <Flex
      mr={3}
      py={1}
      px={2}
      sx={{
        ...borderFull,
        borderRadius: "circle",
        backgroundColor: "background",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        sx={{
          mr: "8px",
          width: "6px",
          height: "6px",
          backgroundColor: "red",
          borderRadius: "circle",
          color: "textMediumEmphasis",
        }}
      />

      <Text sx={{ fontSize: 0 }}>Todo</Text>
    </Flex>
  </Link>
)

export default ManageReports
