import { PageLoader } from 'views/components'
import TournamentTabs from '../../components/TournamentTabs'
import { Outlet, useParams } from 'react-router-dom'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useEffect, useState } from 'react'

const TournamentLayout = () => {
  const { tournament } = useParams()
  const [tournamentData, setTournamentData] = useState(null)
  const [tournamentError, setTournamentError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournament = async () => {
      setLoading(true)
      try {
        const { data } = await apiClient.get(`/tournaments/${tournament}`)
        setTournamentData(data)
        setTournamentError(null)
      } catch (error) {
        setTournamentError(
          getApiErrorMessage(error, 'No se pudo cargar el torneo'),
        )
      } finally {
        setLoading(false)
      }
    }
    fetchTournament()
  }, [tournament])

  if (loading) return <PageLoader />
  if (tournamentError) {
    return (
      <div style={{ margin: '2rem auto', textAlign: 'center' }}>
        {tournamentError}
      </div>
    )
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      {tournamentData && (
        <TournamentTabs
          cloudinary_id={tournamentData.cloudinary_id}
          format={tournamentData.format}
          legacy={tournamentData.legacy}
          name={tournamentData.name}
          tournamentId={tournament}
        />
      )}
      {tournamentData ? (
        <Outlet context={{ tournamentData }} />
      ) : (
        <div style={{ margin: '2rem auto' }}>No se encontró el torneo</div>
      )}
    </div>
  )
}

export default TournamentLayout
