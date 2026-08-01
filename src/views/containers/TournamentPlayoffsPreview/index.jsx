import { apiClient } from 'api/axiosConfig'
import { useParams } from 'react-router-dom'
import { Container, TableContainer, TableTitle } from './styled'
import { PageLoader, PlayoffsPreview, StandingsTable } from 'views/components'
import { useCallback, useEffect, useState } from 'react'

const TournamentPlayoffsPreview = () => {
  const [matches, setMatches] = useState([])
  const [thirds, setThirds] = useState([])
  const [loading, setLoading] = useState(true)

  const { tournament } = useParams()

  const fetchPlayoffPreview = useCallback(
    async (signal) => {
      setLoading(true)

      try {
        const {
          data: { bracketPreview, thirdsTable },
        } = await apiClient.get(`/tournaments/${tournament}/playoffs/preview`, {
          signal,
        })

        setMatches(bracketPreview)
        setThirds(thirdsTable)
      } catch (err) {
        console.error(err)
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

  return (
    <Container>
      <PlayoffsPreview matches={matches} />
      <TableContainer>
        <TableTitle>Tabla de mejores terceros</TableTitle>
        <StandingsTable format="world_cup_2026_preview" standings={thirds} />
      </TableContainer>
    </Container>
  )
}

export default TournamentPlayoffsPreview
