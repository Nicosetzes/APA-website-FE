import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { api } from './../../api'
import { Oval } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import PlayoffRound from '../../components/PlayoffRound'
import ChampionBox from '../../components/ChampionBox'
import FinalistBox from './../../components/FinalistBox'

const Playoffs = () => {
  const { tournament } = useParams()

  const navigate = useNavigate()

  const MySwal = withReactContent(Swal)

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  useEffect(() => {
    getTournamentData()
  }, [])

  const [playoffData, setPlayoffData] = useState()

  const getPlayoffsData = () => {
    axios
      .get(`${api}/tournaments/${tournament}/playoff/matches`)
      .then(({ data }) => setPlayoffData(data))
  }

  useEffect(() => {
    getPlayoffsData()
  }, [])

  const playoffGeneration = () => {
    axios
      .post(`${api}/tournaments/${tournament}/playoff`)
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
        const { message } = data
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
            navigate({
              pathname: `/tournaments/${tournament}/playin`,
            })
          },
        })
      })
  }

  if (tournamentData && playoffData) {
    const { name, format } = tournamentData
    const { matches } = playoffData

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
        {matches.length && (
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
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id > 16 && playoff_id <= 24
                  : playoff_id > 8 && playoff_id <= 12,
              )}
              round={2}
              getData={getPlayoffsData}
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id > 24 && playoff_id <= 28
                  : playoff_id > 12 && playoff_id <= 14,
              )}
              round={3}
              getData={getPlayoffsData}
            />
            <PlayoffRound
              matches={matches.filter(({ playoff_id }) =>
                format == 'champions_league'
                  ? playoff_id == 29
                  : playoff_id == 15,
              )}
              round={4}
              getData={getPlayoffsData}
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
        )}
        {!matches.length && (
          <div
            style={{
              alignItems: 'center',
              border: '#004a79 3px solid',
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
    return (
      <div style={{ margin: 'auto', width: '100px' }}>
        <Oval
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="three-dots-loading"
          $wrapperStyle
          $wrapperClass
        />
      </div>
    )
  }
}

export default Playoffs
