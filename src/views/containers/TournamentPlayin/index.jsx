import Swal from 'sweetalert2'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import { useLogin } from 'context/LoginContext'
import { useOutletContext } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import { PageLoader, PlayinRound, PrimaryLink } from 'views/components'
import { api, database } from 'api'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TournamentPlayin = () => {
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const login = useLogin()
  const { setLoginStatus } = login

  const { tournament } = useParams()
  const { tournamentData } = useOutletContext()
  const [playinData, setPlayinData] = useState()

  const getPlayinData = () => {
    apiClient
      .get(`${api}/tournaments/${tournament}/playin/matches`)
      .then(({ data }) => setPlayinData(data))
  }

  useEffect(() => {
    getPlayinData()
  }, [])

  const getPlayinMatchesForRound = (matches = [], componentRound) => {
    if (!Array.isArray(matches)) return []

    const expectedIds = componentRound === 1 ? [1, 2, 3, 4] : componentRound === 2 ? [5, 6] : []

    const matchById = new Map()
    matches.forEach((m) => {
      matchById.set(Number(m.playoff_id), m)
    })

    return expectedIds.map((playoffId) => {
      const existing = matchById.get(playoffId)
      if (existing) return existing

      return {
        _id: `preview-${playoffId}`,
        playoff_id: playoffId,
        playerP1: null,
        teamP1: null,
        seedP1: '?',
        scoreP1: null,
        playerP2: null,
        teamP2: null,
        seedP2: '?',
        scoreP2: null,
        played: false,
        outcome: null,
        valid: false,
      }
    })
  }

  const playinGeneration = (group) => {
    apiClient
      .post(`${api}/tournaments/${tournament}/playin`, { group })
      .then(({ data }) => {
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
      })
      .catch(({ response }) => {
        const { data } = response
        const { auth, message } = data
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
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            setLoginStatus((loginStatus) => ({
              ...loginStatus,
              status: auth,
            }))
            auth === false &&
              navigate(
                {
                  pathname: `/users/login`,
                },
                {
                  state: { url: location.pathname },
                },
              )
          },
        })
      })
  }

  if (tournamentData && playinData) {
    const { matches } = playinData

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {matches.length && (
          <>
            <div
              style={{
                backgroundColor: '#003545',
                display: 'flex',
                gap: '1rem',
                height: '100%',
                overflowX: 'auto',
                padding: '2rem 0.5rem',
              }}
            >
              <PlayinRound
                matches={getPlayinMatchesForRound(matches, 1)}
                round={1}
                getData={getPlayinData}
              />
              <PlayinRound
                matches={getPlayinMatchesForRound(matches, 2)}
                round={2}
                getData={getPlayinData}
              />
              {matches.length &&
                matches.filter(({ outcome }) => outcome).length == 6 && (
                  <div
                    style={{
                      border: 'var(--orange-900) 2px solid',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 'auto',
                      padding: '1.75rem 1.5rem',
                      minWidth: '200px',
                    }}
                  >
                    <div
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}
                    >
                      Equipos clasificados
                    </div>
                    <div style={{ margin: '0.5rem auto 0 auto' }}>
                      {matches
                        .filter(
                          ({ playoff_id }) =>
                            playoff_id == 1 ||
                            playoff_id == 3 ||
                            playoff_id == 5 ||
                            playoff_id == 6,
                        )
                        .map(({ _id, outcome }) => (
                          <div
                            key={_id}
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              margin: '0.25rem auto',
                            }}
                          >
                            <img
                              src={`${database}/logos/${outcome.teamThatWon.id}`}
                              style={{ margin: '0 0.25rem', width: '25px' }}
                            />
                            <span style={{ color: '#fff' }}>
                              {outcome.teamThatWon.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </>
        )}
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
            <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
            <PrimaryLink
              asButton
              text="Generar partidos Zona A"
              onClick={() => playinGeneration('A')}
            />
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
            <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
            <PrimaryLink
              asButton
              text="Generar partidos Zona B"
              onClick={() => playinGeneration('B')}
            />
          </div>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default TournamentPlayin
