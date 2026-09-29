import Swal from 'sweetalert2'
import { api } from 'api'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import {
  PageLoader,
  PlayoffBracket,
  PrimaryLink,
  StandingsTable,
} from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useEffect, useState } from 'react'

const TournamentPlayoffs = () => {
  const MySwal = withReactContent(Swal)

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
    apiClient
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

    const result = await MySwal.fire({
      title: '¿Generar playoff?',
      text: '¿Estás seguro de que quieres generar el playoff?',
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonColor: 'var(--blue-900)',
      cancelButtonColor: 'var(--red-700)',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
      background: 'rgba(28, 25, 25, 0.95)',
      color: '#fff',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await apiClient.post(`${api}/tournaments/${tournament}/playoff`, {})
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'success',
        iconColor: '#18890e',
        toast: true,
        title: `¡Éxito!`,
        position: 'top-end',
        showConfirmButton: false,
        text: `Playoff creado con éxito`,
        timer: 2000,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' },
        didOpen: (toast) => {
          getPlayoffsData()
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'No se pudo conectar con el servidor',
      )
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'error',
        iconColor: '#b30a0a',
        text: message,
        title: '¡Error!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
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
