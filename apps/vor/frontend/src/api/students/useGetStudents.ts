import { QueryResult, useQuery } from "react-query"
import { navigate } from "gatsby"
import { ApiError, BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"

export interface Student {
  id: string
  name: string
  active: boolean
  profilePicUrl?: string
  classes: {
    classId: string
    className: string
  }[]
}

export const useGetStudents = (
  classId = "",
  active?: boolean
): QueryResult<Student[]> => {
  const fetchStudents = async (): Promise<Student[]> => {
    const url = `/schools/${getSchoolId()}/students?classId=${classId}&active=${
      active ?? ""
    }`
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
    }

    if (result.status === 404) {
      await navigate("/choose-school")
    }

    if (result.status !== 200) {
      const response: ApiError = await result.json()
      throw Error(response.error?.message)
    }

    return result.json()
  }

  return useQuery(["students", classId, active], fetchStudents)
}
