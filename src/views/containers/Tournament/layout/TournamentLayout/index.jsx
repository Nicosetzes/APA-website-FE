import { PageLoader } from 'views/components'
import TournamentTabs from '../../components/TournamentTabs'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { Outlet, useNavigate , useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TournamentLayout = () => {
  const { tournament } = useParams()
  const navigate = useNavigate()
  const [tournamentData, setTournamentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const { data } = await apiClient.get(`${api}/tournaments/${tournament}`)
        setTournamentData(data)
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
      {tournamentData && (
        <TournamentTabs
          cloudinary_id={tournamentData.cloudinary_id}
          format={tournamentData.format}
          legacy={tournamentData.legacy}
          name={tournamentData.name}
          tournamentId={tournament}
        />
      )}
      {loading || !tournamentData ? (
        <PageLoader />
      ) : (
        <Outlet context={{ tournamentData }} />
      )}
    </div>
  )
}

export default TournamentLayout
