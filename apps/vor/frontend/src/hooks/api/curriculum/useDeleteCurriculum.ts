import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { getSchoolId } from "../../schoolIdState"
import { invalidateGetCurriculumCache } from "../useGetCurriculum"
import { setCurriculumAreasCache } from "../useGetCurriculumAreas"

const useDeleteCurriculum = () => {
  const deleteCurriculum = deleteApi(`/schools/${getSchoolId()}/curriculums`)
  return useMutation(deleteCurriculum, {
    onSuccess: async () => {
      analytics.track("Curriculum Deleted")
      await invalidateGetCurriculumCache()
      setCurriculumAreasCache([])
    },
  })
}

export default useDeleteCurriculum