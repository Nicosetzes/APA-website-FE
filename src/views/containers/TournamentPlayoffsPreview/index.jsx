import { Container, TableContainer, TableTitle } from './styled'
import { PageLoader, PlayoffsPreview, StandingsTable } from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useCallback, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

const TournamentPlayoffsPreview = () => {
  const [matches, setMatches] = useState([])
  const [thirds, setThirds] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewError, setPreviewError] = useState(null)

  const {
    tournamentData: { format },
  } = useOutletContext()

  const { tournament } = useParams()

  const fetchPlayoffPreview = useCallback(
    async (signal) => {
      setLoading(true)
      setPreviewError(null)

      try {
        const {
          data: { bracketPreview, thirdsTable },
        } = await apiClient.get(`/tournaments/${tournament}/playoffs/preview`, {
          signal,
        })

        setMatches(bracketPreview)
        setThirds(thirdsTable)
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return
        setPreviewError(
          getApiErrorMessage(err, 'No se pudieron calcular los cruces'),
        )
      } finally {
        setLoading(false)
      }
    },
    [tournament],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchPlayoffPreview(controller.signal)

    return () => controller.abort()
  }, [fetchPlayoffPreview])

  if (loading) return <PageLoader />

  if (previewError) {
    return (
      <Container>
        <p role="alert">{previewError}</p>
      </Container>
    )
  }

  return (
    <Container>
      {matches.length ? (
        <PlayoffsPreview matches={matches} />
      ) : (
        <p>Aún no es posible predecir los cruces</p>
      )}
      {thirds.length ? (
        <TableContainer>
          <TableTitle>Tabla de mejores terceros</TableTitle>
          <StandingsTable format={`${format}_best_thirds`} standings={thirds} />
        </TableContainer>
      ) : (
        <p>Aún no es posible generar la tabla de mejores terceros</p>
      )}
    </Container>
  )
}

export default TournamentPlayoffsPreview
