import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLogin } from '../../context/LoginContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { api } from './../../api'
import StandingsTable from './../standings/components/StandingsTable'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import PlayoffRound from '../../components/PlayoffRound'
import ChampionBox from '../../components/ChampionBox'
import FinalistBox from './../../components/FinalistBox'
import MatchPreview from './components/MatchPreview'
import PageLoader from '../../components/PageLoader'

const Playoffs = () => {
  const { tournament } = useParams()

  const navigate = useNavigate()

  const login = useLogin()

  const { setLoginStatus } = login

  const MySwal = withReactContent(Swal)

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  const [playoffsTableData, setPlayoffsTableData] = useState()

  const [showMatchPreviews, setShowMatchPreviews] = useState(false)

  const getPlayoffsTableData = () => {
    console.log('Traigo la playoff table del torneo')
    axios
      .get(`${api}/tournaments/${tournament}/playoffs/table`)
      .then(({ data }) => setPlayoffsTableData(data))
  }

  const [playoffData, setPlayoffData] = useState()

  const getPlayoffsData = () => {
    axios
      .get(`${api}/tournaments/${tournament}/playoff/matches`)
      .then(({ data }) => setPlayoffData(data))
  }

  useEffect(() => {
    getTournamentData()
    getPlayoffsTableData()
    getPlayoffsData()
  }, [])

  const playoffGeneration = () => {
    axios
      .post(
        `${api}/tournaments/${tournament}/playoff`,
        tournament /* Importante, debo adjuntar algo en la request, sino no toma la configuración de abajo (y por ende no incluye la cookie) */,
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
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
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Vuelvo a traer la data de Playoffs, para mostrar la vista actualizada //
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
            auth === false
              ? navigate(
                  {
                    pathname: `/users/login`,
                  },
                  {
                    state: { url: location.pathname },
                  } /* Adjunto info de la ruta actual, para luego volver a ella en caso de login exitoso */,
                )
              : navigate({
                  pathname: `/tournaments/${tournament}/playin`,
                })
          },
        })
      })
  }

  if (tournamentData && playoffsTableData && playoffData) {
    const { name, format } = tournamentData
    const { standings } = playoffsTableData
    const { matches } = playoffData

    console.log(matches)

    console.log(playoffsTableData)

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Playoffs',
        route: `tournaments/${tournament}/playoffs`,
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
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
            <button
              onClick={() => setShowMatchPreviews(!showMatchPreviews)}
              className="button-main"
            >
              {showMatchPreviews ? 'Ocultar' : 'Mostrar'} emparejamientos
            </button>
            {showMatchPreviews ? (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  flexFlow: 'row wrap',
                  gap: '1.5rem',
                  justifyContent: 'center',
                  margin: '2rem auto 0 auto',
                  maxWidth: '1200px',
                }}
              >
                <MatchPreview
                  teamOne={standings.at(0)}
                  positionOne={'1'}
                  teamTwo={standings.at(15) || ''}
                  positionTwo={'16'}
                  color={'#ff0000'}
                />
                <MatchPreview
                  teamOne={standings.at(1)}
                  positionOne={'2'}
                  teamTwo={standings.at(14) || ''}
                  positionTwo={'15'}
                  color={'#35299b'}
                />
                <MatchPreview
                  teamOne={standings.at(2)}
                  positionOne={'3'}
                  teamTwo={standings.at(13) || ''}
                  positionTwo={'14'}
                  color={'#237e93'}
                />
                <MatchPreview
                  teamOne={standings.at(3)}
                  positionOne={'4'}
                  teamTwo={standings.at(12) || ''}
                  positionTwo={'13'}
                  color={'#ffa400'}
                />
                <MatchPreview
                  teamOne={standings.at(4)}
                  positionOne={'5'}
                  teamTwo={standings.at(11)}
                  positionTwo={'12'}
                  color={'#ffa400'}
                />
                <MatchPreview
                  teamOne={standings.at(5)}
                  positionOne={'6'}
                  teamTwo={standings.at(10)}
                  positionTwo={'11'}
                  color={'#237e93'}
                />
                <MatchPreview
                  teamOne={standings.at(6)}
                  positionOne={'7'}
                  teamTwo={standings.at(9)}
                  positionTwo={'10'}
                  color={'#35299b'}
                />
                <MatchPreview
                  teamOne={standings.at(7)}
                  positionOne={'8'}
                  teamTwo={standings.at(8)}
                  positionTwo={'9'}
                  color={'#ff0000'}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {matches.length ? (
          <div
            style={{
              alignContent: 'center',
              backgroundColor: '#003545',
              display: 'flex',
              overflowX: 'auto',
              padding: '0.5rem',
            }}
          >
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id <= 16
                  : playoff_id <= 8,
              )}
              round={1}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id > 16 && playoff_id <= 24
                  : playoff_id > 8 && playoff_id <= 12,
              )}
              round={2}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id > 24 && playoff_id <= 28
                  : playoff_id > 12 && playoff_id <= 14,
              )}
              round={3}
              getData={getPlayoffsData}
              isThisTheFinal={false}
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id == 29
                  : playoff_id == 15,
              )}
              round={4}
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
            <button className="button-main" onClick={() => playoffGeneration()}>
              Generar Playoff
            </button>
          </div>
        )}
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Playoffs
