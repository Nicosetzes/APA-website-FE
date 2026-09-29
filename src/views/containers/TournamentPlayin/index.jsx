import Swal from 'sweetalert2'
import { api } from 'api'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import { PageLoader, PlayinBracket, PrimaryLink } from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { useEffect, useState } from 'react'

const TournamentPlayin = () => {
  const MySwal = withReactContent(Swal)

  const { tournament } = useParams()
  const { canMutate, tournamentData } = useOutletContext()
  const [playinData, setPlayinData] = useState()
  const [playinError, setPlayinError] = useState(null)

  const getPlayinData = () => {
    apiClient
      .get(`${api}/tournaments/${tournament}/playin/matches`)
      .then(({ data }) => {
        setPlayinData(data)
        setPlayinError(null)
      })
      .catch((error) => {
        setPlayinError(
          getApiErrorMessage(error, 'No se pudo cargar el play-in'),
        )
      })
  }

  useEffect(() => {
    getPlayinData()
  }, [])

  const playinGeneration = async (group) => {
    if (!canMutate) return

    const result = await MySwal.fire({
      title: '¿Generar playin?',
      text: `¿Estás seguro de que quieres generar el playin de la zona ${group}?`,
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
      await apiClient.post(`${api}/tournaments/${tournament}/playin`, { group })
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'success',
        iconColor: '#18890e',
        toast: true,
        title: `¡Éxito!`,
        position: 'top-end',
        showConfirmButton: false,
        text: `Playin de la zona ${group} creado con éxito`,
        timer: 2000,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' },
        didOpen: (toast) => {
          getPlayinData()
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

  if (playinError) {
    return (
      <div style={{ margin: '2rem auto', textAlign: 'center' }}>
        {playinError}
      </div>
    )
  }

  if (tournamentData && playinData) {
    const { matches } = playinData

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
      >
        {matches.length ? (
          <PlayinBracket
            canMutate={canMutate}
            cloudinaryId={tournamentData.cloudinary_id}
            getData={getPlayinData}
            matches={matches}
          />
        ) : null}
        {(!matches.length ||
          !matches.filter(({ group }) => group == 'A').length) && (
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
              La zona A no posee partidos programados para el Playin
            </div>
            {canMutate && (
              <>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <PrimaryLink
                  asButton
                  text="Generar partidos Zona A"
                  onClick={() => playinGeneration('A')}
                />
              </>
            )}
          </div>
        )}
        {(!matches.length ||
          !matches.filter(({ group }) => group == 'B').length) && (
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
              La zona B no posee partidos programados para el Playin
            </div>
            {canMutate && (
              <>
                <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
                <PrimaryLink
                  asButton
                  text="Generar partidos Zona B"
                  onClick={() => playinGeneration('B')}
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

export default TournamentPlayin
