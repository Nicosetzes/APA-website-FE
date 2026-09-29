import { PageLoader } from 'views/components'
import TournamentTabs from '../../components/TournamentTabs'
import { canMutateTournament } from 'utils/tournamentPermissions'
import { toast } from 'utils/notifications'
import { useAuth } from 'context/AuthContext'
import { Outlet, useParams } from 'react-router-dom'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useCallback, useEffect, useRef, useState } from 'react'

const TournamentLayout = () => {
  const { tournament } = useParams()
  const { isAuthenticated, user, validation } = useAuth()
  const [tournamentData, setTournamentData] = useState(null)
  const [tournamentError, setTournamentError] = useState(null)
  const [loading, setLoading] = useState(true)
  const controllerRef = useRef(null)

  const fetchTournament = useCallback(
    async ({ silent = false } = {}) => {
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      if (!silent) setLoading(true)
      try {
        const { data } = await apiClient.get(`/tournaments/${tournament}`, {
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        setTournamentData(data)
        setTournamentError(null)
      } catch (error) {
        if (controller.signal.aborted) return
        if (silent) {
          toast.apiError(error, 'No se pudo actualizar el torneo')
        } else {
          setTournamentError(
            getApiErrorMessage(error, 'No se pudo cargar el torneo'),
          )
        }
      } finally {
        if (!silent && controllerRef.current === controller) setLoading(false)
      }
    },
    [tournament],
  )

  useEffect(() => {
    fetchTournament()
    return () => controllerRef.current?.abort()
  }, [fetchTournament])

  const refreshTournament = useCallback(
    () => fetchTournament({ silent: true }),
    [fetchTournament],
  )

  if (loading) return <PageLoader />
  if (tournamentError) {
    return (
      <div style={{ margin: '2rem auto', textAlign: 'center' }}>
        {tournamentError}
      </div>
    )
  }

  const canMutate =
    isAuthenticated &&
    validation !== 'cache' &&
    canMutateTournament(tournamentData, user)

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
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
        <Outlet context={{ tournamentData, canMutate, refreshTournament }} />
      ) : (
        <div style={{ margin: '2rem auto' }}>No se encontró el torneo</div>
      )}
    </div>
  )
}

export default TournamentLayout
