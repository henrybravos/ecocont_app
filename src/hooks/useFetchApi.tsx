import { useState } from 'react'

type ApiFunctionWithArg<T, A> = (arg: A) => Promise<T>

export default function fetchApi<S, A>(
  apiFunction: ApiFunctionWithArg<S, A>,
): [boolean, S, (arg?: A) => Promise<void>]

export default function fetchApi<S, A>(apiFunction: ApiFunctionWithArg<S, A>) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<S | null>(null)
  const fetch = async (arg?: A) => {
    setLoading(true)
    const response = await apiFunction(arg!)
    if (response) {
      setResponse(response)
    }
    setLoading(false)
  }
  const resetData = () => setResponse(null)
  return [loading, response, fetch, resetData]
}
