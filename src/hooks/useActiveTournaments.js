import { apiClient } from 'api/axiosConfig'
import { useEffect, useState } from 'react'

const isAbortError = (err) =>
  err?.name === 'CanceledError' || err?.name === 'AbortError'

const LOADING = { status: 'loading', tournaments: [] }

/**
 * Torneos activos (`GET /tournaments?legacy=false`, los mismos que ofrece
 * /matches), pedidos una sola vez al montar.
 * @returns {{ status: 'loading'|'ok'|'error', tournaments: Array<{ _id: string, name: string }> }}
 */
const useActiveTournaments = () => {
  const [state, setState] = useState(LOADING)

  useEffect(() => {
    const controller = new AbortController()

    apiClient
      .get('/tournaments', {
        params: { legacy: false },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (controller.signal.aborted) return
        if (!Array.isArray(data)) {
          setState({ status: 'error', tournaments: [] })
          return
        }
        setState({ status: 'ok', tournaments: data })
      })
      .catch((err) => {
        if (isAbortError(err) || controller.signal.aborted) return
        console.error(err)
        setState({ status: 'error', tournaments: [] })
      })

    return () => controller.abort()
  }, [])

  return state
}

export default useActiveTournaments
