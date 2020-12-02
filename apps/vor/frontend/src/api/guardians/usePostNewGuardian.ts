import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { ApiError, BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { navigate } from "../../components/Link/Link"

interface NewGuardian {
  name: string
  email: string
  phone: string
  note: string
  address: string
  studentId?: string
  relationship?: number
}

export const usePostNewGuardian = (
  studentId?: string
): [MutateFunction<Response, NewGuardian>, MutationResult<Response>] => {
  const postNewGuardian = async (guardian: NewGuardian): Promise<Response> => {
    const schoolId = getSchoolId()
    const result = await fetch(`${BASE_URL}/schools/${schoolId}/guardians`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(guardian),
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

  return useMutation(postNewGuardian, {
    onSuccess: async () => {
      analytics.track("Guardian Created")
      await queryCache.invalidateQueries(["student", studentId])
    },
  })
}
