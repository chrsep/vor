import { useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import {
  getObservationCache,
  updateObservationCache,
} from "./useGetObservation"

const usePostNewObservationImage = (observationId: string) => {
  const postNewImage = async (image: File) => {
    const payload = new FormData()
    payload.append("image", image)

    return fetch(`${BASE_URL}/observations/${observationId}/images`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })
  }

  return useMutation(postNewImage, {
    onSuccess: async (data) => {
      analytics.track("Observation Image Uploaded")
      const result = await data.json()
      const cached = await getObservationCache(observationId)
      if (cached) {
        if (cached.images?.length) {
          cached.images.push(result)
        } else {
          cached.images = [result]
        }
        updateObservationCache(cached)
      }
    },
  })
}

export default usePostNewObservationImage
