import { queryCache, useMutation } from "react-query"
import { ApiError, BASE_URL } from "../useApi"
import { Dayjs } from "../../dayjs"
import { getSchoolId } from "../../hooks/schoolIdState"
import { navigate } from "../../components/Link/Link"

export interface PostNewLessonPlanBody {
  date: Dayjs
  title: string
  classId?: string
  description?: string
  areaId?: string
  students?: string[]
  repetition?: {
    type: number
    endDate: Dayjs
  }
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
}
const usePostNewPlan = () => {
  let date: string
  const postPlan = async (newPlan: PostNewLessonPlanBody) => {
    const schoolId = getSchoolId()
    const result = await fetch(`${BASE_URL}/schools/${schoolId}/plans`, {
      method: "POST",
      body: JSON.stringify({
        title: newPlan.title,
        description: newPlan.description,
        fileIds: [],
        date: newPlan.date.startOf("day").toISOString(),
        repetition: newPlan.repetition,
        areaId: newPlan.areaId,
        classId: newPlan.classId,
        students: newPlan.students,
        links: newPlan.links,
      }),
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return result
    }

    if (result.status !== 201) {
      const body: ApiError = await result.json()
      throw Error(body?.error?.message ?? "")
    }
    return result
  }

  return useMutation(postPlan, {
    onSuccess: async () => {
      analytics.track("Plan Created")
      await queryCache.invalidateQueries(["plans", getSchoolId(), date])
    },
  })
}

export default usePostNewPlan
