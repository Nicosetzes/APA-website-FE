import { MatchPreview } from './components'
import StandingsTable from '../TournamentStandings/components/StandingsTable'
import Swal from 'sweetalert2'
import { api } from 'api'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import { useLogin } from 'context/LoginContext'
import { useOutletContext } from 'react-router-dom'
import withReactContent from 'sweetalert2-react-content'
import {
  ChampionBox,
  FinalistBox,
  PageLoader,
  PlayoffRound,
  PrimaryLink,
} from 'views/components'
import {
  PlayoffsPreviewContainer,
  PlayoffsSideContainer,
  PlayoffsSide,
  PlayoffsSideHeader,
} from './styled'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TournamentPlayoffs = () => {
  const navigate = useNavigate()

  const login = useLogin()

  const { setLoginStatus } = login

  const MySwal = withReactContent(Swal)

  const { tournament } = useParams()
  const { tournamentData } = useOutletContext()

  const [playoffsTableData, setPlayoffsTableData] = useState()
  const [playoffData, setPlayoffData] = useState()

  const getPlayoffsTableData = () => {
    console.log('Traigo la playoff table del torneo')
    apiClient
      .get(`${api}/tournaments/${tournament}/playoffs/table`)
      .then(({ data }) => setPlayoffsTableData(data))
  }

  const getPlayoffsData = () => {
    apiClient
      .get(`${api}/tournaments/${tournament}/playoff/matches`)
      .then(({ data }) => {
        setPlayoffData(data)
        if (!data.matches || data.matches.length === 0) {
          getPlayoffsTableData()
        }
      })
  }

  useEffect(() => {
    getPlayoffsData()
  }, [])

  const getMatchesForRound = (format, matches = [], componentRound) => {
    if (!Array.isArray(matches)) return []

    let expectedIds = []
    const range = (min, max) => {
      const arr = []
      for (let i = min; i <= max; i++) arr.push(i)
      return arr
    }

    if (format === 'playoff') {
      switch (componentRound) {
        case 1:
          expectedIds = range(1, 16)
          break
        case 2:
          expectedIds = range(17, 24)
          break
        case 3:
          expectedIds = range(25, 28)
          break
        case 4:
          expectedIds = range(29, 30)
          break
        case 5:
          expectedIds = [31]
          break
        default:
          expectedIds = []
      }
    } else if (format === 'champions_league') {
      switch (componentRound) {
        case 1:
          expectedIds = range(1, 16)
          break
        case 2:
          expectedIds = range(17, 24)
          break
        case 3:
          expectedIds = range(25, 28)
          break
        case 4:
          expectedIds = [29]
          break
        default:
          expectedIds = []
      }
    } else {
      // league_playin_playoff format
      switch (componentRound) {
        case 1:
          expectedIds = range(1, 8)
          break
        case 2:
          expectedIds = range(9, 12)
          break
        case 3:
          expectedIds = range(13, 14)
          break
        case 4:
          expectedIds = [15]
          break
        default:
          expectedIds = []
      }
    }

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

  const playoffGeneration = () => {
    apiClient
      .post(`${api}/tournaments/${tournament}/playoff`, tournament)
      .then(({ data }) => {
        console.log(data)
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
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            setLoginStatus((loginStatus) => ({
              ...loginStatus,
              status: auth,
            }))
            auth === false
              ? navigate(
                  {
                    pathname: `/users/login`,
                  },
                  {
                    state: { url: location.pathname },
                  },
                )
              : navigate({
                  pathname: `/tournaments/${tournament}/playin`,
                })
          },
        })
      })
  }

  if (tournamentData && playoffData) {
    const { format } = tournamentData
    const { matches } = playoffData
    const standings = playoffsTableData?.standings || []

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {standings.length ? (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <StandingsTable standings={standings} />
            {!matches.length ? (
              <PlayoffsPreviewContainer>
                <PlayoffsSideContainer>
                  <PlayoffsSide>
                    <PlayoffsSideHeader>Lado A</PlayoffsSideHeader>
                    <MatchPreview
                      positionOne={'1'}
                      positionTwo={'16'}
                      teamOne={standings.at(0)}
                      teamTwo={standings.at(15) || ''}
                    />
                    <MatchPreview
                      positionOne={'8'}
                      positionTwo={'9'}
                      teamOne={standings.at(7)}
                      teamTwo={standings.at(8) || ''}
                    />
                    <MatchPreview
                      positionOne={'5'}
                      positionTwo={'12'}
                      teamOne={standings.at(4)}
                      teamTwo={standings.at(11) || ''}
                    />
                    <MatchPreview
                      positionOne={'4'}
                      positionTwo={'13'}
                      teamOne={standings.at(3)}
                      teamTwo={standings.at(12) || ''}
                    />
                  </PlayoffsSide>

                  <PlayoffsSide>
                    <PlayoffsSideHeader>Lado B</PlayoffsSideHeader>
                    <MatchPreview
                      positionOne={'6'}
                      positionTwo={'11'}
                      teamOne={standings.at(5)}
                      teamTwo={standings.at(10) || ''}
                    />
                    <MatchPreview
                      positionOne={'3'}
                      positionTwo={'14'}
                      teamOne={standings.at(2)}
                      teamTwo={standings.at(13) || ''}
                    />
                    <MatchPreview
                      positionOne={'7'}
                      positionTwo={'10'}
                      teamOne={standings.at(6)}
                      teamTwo={standings.at(9) || ''}
                    />
                    <MatchPreview
                      positionOne={'2'}
                      positionTwo={'15'}
                      teamOne={standings.at(1)}
                      teamTwo={standings.at(14) || ''}
                    />
                  </PlayoffsSide>
                </PlayoffsSideContainer>
              </PlayoffsPreviewContainer>
            ) : null}
          </div>
        ) : null}
        {matches.length ? (
          <div
            style={{
              backgroundColor: '#003545',
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              padding: '2rem 0.5rem',
            }}
          >
            {/* Round of 32 - Only for playoff format */}
            {format === 'playoff' && (
              <PlayoffRound
                matches={getMatchesForRound(format, matches, 1)}
                round={1}
                getData={getPlayoffsData}
                isThisTheFinal={false}
              />
            )}
            {/* Round of 16 */}
            <PlayoffRound
              matches={getMatchesForRound(
                format,
                matches,
                format === 'playoff' ? 2 : 1,
              )}
              round={format === 'playoff' ? 2 : 1}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            {/* Quarterfinals */}
            <PlayoffRound
              matches={getMatchesForRound(
                format,
                matches,
                format === 'playoff' ? 3 : 2,
              )}
              round={format === 'playoff' ? 3 : 2}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            {/* Semifinals */}
            <PlayoffRound
              matches={getMatchesForRound(
                format,
                matches,
                format === 'playoff' ? 4 : 3,
              )}
              round={format === 'playoff' ? 4 : 3}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            {/* Final */}
            <PlayoffRound
              matches={getMatchesForRound(
                format,
                matches,
                format === 'playoff' ? 5 : 4,
              )}
              round={format === 'playoff' ? 5 : 4}
              getData={getPlayoffsData}
              isThisTheFinal={true}
            />
            {format == 'champions_league'
              ? matches.filter(({ outcome }) => outcome).length == 29 && (
                  <div
                    style={{
                      alignItems: 'space-around',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ChampionBox match={matches.at(-1)} />
                    <FinalistBox match={matches.at(-1)} />
                  </div>
                )
              : format === 'playoff'
              ? matches.filter(({ outcome }) => outcome).length == 31 && (
                  <div
                    style={{
                      alignItems: 'space-around',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ChampionBox match={matches.at(-1)} />
                    <FinalistBox match={matches.at(-1)} />
                  </div>
                )
              : matches.filter(({ outcome }) => outcome).length == 15 && (
                  <div
                    style={{
                      alignItems: 'space-around',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ChampionBox match={matches.at(-1)} />
                    <FinalistBox match={matches.at(-1)} />
                  </div>
                )}
          </div>
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
              No existen partidos programados para el Playoff
            </div>
            <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
            <PrimaryLink asButton text={"Generar Playoff"} onClick={() => playoffGeneration()} />
          </div>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default TournamentPlayoffs
