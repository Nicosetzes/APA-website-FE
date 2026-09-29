import { api } from 'api'
import { motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { PageLoader, PlayinBracket, PrimaryLink } from 'views/components'
import { apiClient, getApiErrorMessage } from 'api/axiosConfig'
import { confirmDialog, toast } from 'utils/notifications'
import { useEffect, useState } from 'react'

const TournamentPlayin = () => {
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

    const confirmed = await confirmDialog({
      title: '¿Generar playin?',
      text: `¿Estás seguro de que quieres generar el playin de la zona ${group}?`,
      confirmText: 'Sí, generar',
    })
    if (!confirmed) return

    try {
      await apiClient.post(`${api}/tournaments/${tournament}/playin`, { group })
      getPlayinData()
      toast.success({ title: `Playin de la zona ${group} creado con éxito` })
    } catch (error) {
      toast.apiError(error)
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
