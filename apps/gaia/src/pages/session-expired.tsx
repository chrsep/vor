import Head from "next/head"
import React from "react"
import Button from "../components/Button/Button"

const SessionExpired = () => (
  <>
    <Head>
      <title>Session Expired | Obserfy for Parents</title>
    </Head>

    <div className="max-w-lg mx-auto my-8">
      <h1 className="text-xl m-3 leading-tight font-bold inline-block">
        Looks like your session has expired. Please log back in to continue.
      </h1>

      <a href="/api/auth/login" className="block mt-6 w-full px-3">
        <Button type="button" className="w-full">
          Login
        </Button>
      </a>
    </div>
  </>
)

export default SessionExpired
