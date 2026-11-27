import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from 'api/axiosConfig'
import { buildPlayerColors } from 'utils/ratingHistory'
import { Loader } from 'views/components'
import { Section, SpinnerContainer } from '../../styled'
import RecentForm from '../RecentForm'
import { Notice, RetryButton } from '../RatingTab/styled'

const isAbortError = (err) =>
  err?.name === 'CanceledError' || err?.name === 'AbortError'

const RecentFormTab = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [requestId, setRequestId] = useState(0)

  const retry = useCallback(() => setRequestId((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    apiClient
      .get('/ratings/recent-form', { signal: controller.signal })
      .then(({ data: response }) => {
        if (controller.signal.aborted) return
        setData(response.data ?? null)
        setLoading(false)
      })
      .catch((err) => {
        if (isAbortError(err) || controller.signal.aborted) return
        console.error(err)
        setError(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [requestId])

  const players = data?.players ?? []
  const colors = useMemo(
    () => buildPlayerColors(players.map(({ player }) => player.id)),
    [players],
  )

  if (loading && data === null) {
    return (
      <SpinnerContainer role="status" aria-label="Cargando forma reciente">
        <Loader />
      </SpinnerContainer>
    )
  }

  if (error && data === null) {
    return (
      <div role="alert">
        <Notice $tone="error">No se pudo cargar la forma reciente.</Notice>
        <RetryButton type="button" onClick={retry}>
          Reintentar
        </RetryButton>
      </div>
    )
  }

  return (
    <Section aria-busy={loading}>
      <RecentForm players={players} colors={colors} />
    </Section>
  )
}

export default RecentFormTab
