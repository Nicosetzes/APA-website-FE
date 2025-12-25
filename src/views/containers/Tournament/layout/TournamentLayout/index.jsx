import { PageLoader } from 'views/components'
import TournamentTabs from '../../components/TournamentTabs'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TournamentLayout = () => {
  const { tournament } = useParams()
  const navigate = useNavigate()
  const [tournamentSummary, setTournamentSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const { data } = await apiClient.get(`${api}/tournaments/${tournament}`)
        setTournamentSummary(data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        navigate('/')
      }
    }
    fetchTournament()
  }, [tournament])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
    >
      {tournamentSummary && (
        <TournamentTabs
          name={tournamentSummary.name}
          format={tournamentSummary.format}
          tournamentId={tournament}
          cloudinary_id={tournamentSummary.cloudinary_id}
        />
      )}
      {loading || !tournamentSummary ? (
        <PageLoader />
      ) : (
        <Outlet context={{ tournamentSummary }} />
      )}
    </div>
  )
}

export default TournamentLayout
