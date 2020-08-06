import React, { FC } from "react"
import { nanoid } from "nanoid"
import faker from "faker"
import PagePlanDetails from "./PagePlanDetails"
import Layout from "../Layout/Layout"
import mockApi from "../../__mocks__/api"
import { GetPlanResponseBody } from "../../api/plans/useGetPlan"

export default {
  title: "Page|Plans/PagePlanDetails",
  component: PagePlanDetails,
  parameters: {
    componentSubtitle: "Just a simple PagePlanDetails",
  },
}

export const Basic: FC = () => <PagePlanDetails id="testid" />

export const WithLayout: FC = () => {
  mockApi.get(
    "/plans/*",
    (): GetPlanResponseBody => ({
      id: nanoid(),
      title: faker.name.jobTitle(),
      description: faker.lorem.sentence(20, 2),
      classId: "asdfasjf",
      date: "2020-02-01",
      links: [],
    })
  )

  return (
    <Layout>
      <PagePlanDetails id="testid" />
    </Layout>
  )
}
