import { api } from 'api'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
  PageLoader,
  PlayoffBracket,
  PrimaryLink,
  StandingsTable,
} from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { confirmDialog, toast } from 'utils/notifications'
import { useEffect, useState } from 'react'

const TournamentPlayoffs = () => {
  const { tournament } = useParams()
  const { canMutate, tournamentData } = useOutletContext()

  const [playoffsTableData, setPlayoffsTableData] = useState()
  const [playoffData, setPlayoffData] = useState()
  const [playoffError, setPlayoffError] = useState(null)

  const getPlayoffsTableData = () => {
    apiClient
      .get(`${api}/tournaments/${tournament}/playoffs/table`)
      .then(({ data }) => setPlayoffsTableData(data))
      .catch((error) => {
        setPlayoffError(
          getApiErrorMessage(
            error,
            'No se pudo cargar la tabla previa al playoff',
          ),
        )
      })
  }

  const getPlayoffsData = () => {
    return apiClient
      .get(`${api}/tournaments/${tournament}/playoff/matches`)
      .then(({ data }) => {
        setPlayoffData(data)
        setPlayoffError(null)
        if (!data.matches || data.matches.length === 0) {
          getPlayoffsTableData()
        }
      })
      .catch((error) => {
        setPlayoffError(
          getApiErrorMessage(error, 'No se pudo cargar el playoff'),
        )
      })
  }

  useEffect(() => {
    getPlayoffsData()
  }, [])

  const playoffGeneration = async () => {
    if (!canMutate) return

    const confirmed = await confirmDialog({
      title: '¿Generar playoff?',
      text: '¿Estás seguro de que quieres generar el playoff?',
      confirmText: 'Sí, generar',
    })
    if (!confirmed) return

    try {
      await apiClient.post(`${api}/tournaments/${tournament}/playoff`, {})
      getPlayoffsData()
      toast.success({ title: 'Playoff creado con éxito' })
    } catch (error) {
      toast.apiError(error)
    }
  }

  if (playoffError) {
    return (
      <div style={{ margin: '2rem auto', textAlign: 'center' }}>
        {playoffError}
      </div>
    )
  }

  if (tournamentData && playoffData) {
    const { cloudinary_id, format } = tournamentData
    const { matches } = playoffData
    const standings = playoffsTableData?.standings || []

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
      >
        {!matches.length && standings.length ? (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <StandingsTable
              standings={standings}
              title={'Tabla de clasificados'}
            />
          </div>
        ) : null}
        {matches.length ? (
          <PlayoffBracket
            canMutate={canMutate}
            cloudinaryId={cloudinary_id}
            format={format}
            getData={getPlayoffsData}
            matches={matches}
            playoffMode={tournamentData.playoffMode}
            tournamentId={tournament}
          />
        ) : null}
        {!matches.length && (
          <div
            style={{
              alignItems: 'center',
              border: 'var(--blue-900) 3px solid',
              display: 'flex',
              flexDirection: 'column',
              margin: '2rem auto',
              padding: '1.5rem 1.75rem',
              width: 'fit-content',
            }}
          >
            <div style={{ fontSize: '1.25rem' }}>
              {format === 'playoff'
                ? 'El bracket inicial no está disponible; este formato lo genera al crear el torneo'
                : 'No existen partidos programados para el Playoff'}
            </div>
            {canMutate && format !== 'playoff' && (
              <>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <PrimaryLink
                  asButton
                  text={'Generar Playoff'}
                  onClick={() => playoffGeneration()}
                />
              </>
            )}
          </div>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default TournamentPlayoffs
