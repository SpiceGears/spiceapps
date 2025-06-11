// hooks/userById.ts
import { getBackendUrl } from "../app/serveractions/backend-url"
import { UserInfo }     from "../models/User"
import { useState,
         useEffect }    from "react"

export const useUserById = (id: string) => {
  const [data, setData]     = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    // If no id, bail out immediately
    if (!id) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const backend = await getBackendUrl()
        if (!backend) throw new Error("Backend is not set up")

        const res = await fetch(`${backend}/api/user/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const result: UserInfo = await res.json()
        if (!cancelled) setData(result)
      } catch (e: any) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    // cleanup in case the component unmounts
    return () => {
      cancelled = true
    }
  }, [id])  // <-- re-run whenever `id` changes

  return { data, loading, error }
}