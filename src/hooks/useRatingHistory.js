import { apiClient } from 'api/axiosConfig'
import { useCallback, useEffect, useState } from 'react'

export const RATING_HISTORY_ERROR = 'No se pudo cargar la evolución del rating.'

const isAbortError = (err) =>
  err?.name === 'CanceledError' || err?.name === 'AbortError'

const IDLE = { data: null, loading: false, error: null }

/**
 * @returns {{ data: object|null, loading: boolean, error: string|null, retry: Function }}
 */
const useRatingHistory = ({ dateFrom, dateTo }) => {
  const [state, setState] = useState(IDLE)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    if (!dateFrom || !dateTo) {
      setState(IDLE)
      return undefined
    }

    const controller = new AbortController()
    setState((previous) => ({ ...previous, loading: true, error: null }))

    apiClient
      .get('/ratings/history', {
        params: { dateFrom, dateTo },
        signal: controller.signal,
      })
      .then(({ data: body }) => {
        if (controller.signal.aborted) return
        setState({
          data: { ...body.data, dateFrom, dateTo },
          loading: false,
          error: null,
        })
      })
      .catch((err) => {
        if (isAbortError(err) || controller.signal.aborted) return
        console.error(err)
        setState({ data: null, loading: false, error: RATING_HISTORY_ERROR })
      })

    return () => controller.abort()
  }, [dateFrom, dateTo, attempt])

  return { ...state, retry }
}

export default useRatingHistory
