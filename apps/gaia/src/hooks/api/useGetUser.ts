import { useQuery } from "react-query"
import { useRouter } from "next/router"
import * as Sentry from "@sentry/node"
import { UserData } from "../../pages/api/me"
import { getApi } from "./apiHelpers"

const useGetUser = () => {
  const router = useRouter()
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser, {
    retry: (failureCount, error) =>
      // TODO: Don't use any
      !((error as any).message === "not_authenticated"),
    onError: async (error) => {
      if ((error as any)?.message === "not_authenticated") {
        await router.push("/api/login")
      }
    },
    onSuccess: (data) => {
      Sentry.setUser({
        id: data.sub,
        email: data.email,
        username: data.name,
      })
      mixpanel.identify(data.sub)
      mixpanel.people.set({
        Name: data.name,
        Email: data.email,
        $avatar: data.picture,
        children: data.children.map(({ name }) => name),
        schools: data.children.map(({ schoolName }) => schoolName),
      })
    },
  })
}

export default useGetUser
