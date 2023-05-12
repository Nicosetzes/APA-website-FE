import { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import PlayinRound from './../../components/PlayinRound'
import FixtureContainer from '../../components/FixtureContainer'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Oval } from 'react-loader-spinner'

const Playin = () => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 375px)' })

  const MySwal = withReactContent(Swal)

  const [searchParams, setSearchParams] = useSearchParams()

  const { tournament } = useParams()

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

  const [playinData, setPlayinData] = useState()

  const getPlayinData = () => {
    console.log('Traigo data del playin')
    axios
      .get(`${api}/tournaments/${tournament}/playin/matches`)
      .then(({ data }) => setPlayinData(data))
  }

  useEffect(() => {
    console.log('me ejecuto')
    getPlayinData()
  }, [])

  const playinGeneration = (group) => {
    console.log(tournament)
    axios
      .post(`${api}/tournaments/${tournament}/playin`, { group })
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
          text: `Playin de la zona ${group} creado con éxito`,
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            // Vuelvo a traer la data de Playin, para mostrar la vista actualizada //
            getPlayinData()
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  if (tournamentData && playinData) {
    // console.log(playinData)
    const { name, players } = tournamentData
    const { matches } = playinData

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Playin',
        route: `tournaments/${tournament}/playin`,
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
          <>
            <div
              style={{
                alignContent: 'center',
                backgroundColor: '#003545',
                display: 'flex',
                overflowX: 'auto',
                padding: '0.5rem',
              }}
            >
              <PlayinRound
                matches={matches.filter(({ playoff_id }) => playoff_id <= 4)}
                round={1}
                getData={getPlayinData}
              />
              <PlayinRound
                matches={matches.filter(({ playoff_id }) => playoff_id > 4)}
                round={2}
                getData={getPlayinData}
              />
              {matches.length &&
                matches.filter(({ outcome }) => outcome).length == 6 && (
                  <div
                    style={{
                      border: '#cfa420 2px solid',
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
              border: '#004a79 3px solid',
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
            <button
              className="button-main"
              onClick={() => playinGeneration('A')}
            >
              Generar partidos Zona A
            </button>
          </div>
        )}
        {(!matches.length ||
          !matches.filter(({ group }) => group == 'B').length) && (
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
              La zona B no posee partidos programados para el Playin
            </div>
            <div style={{ margin: '0.5rem auto' }}>¿Desea generarlos?</div>
            <button
              className="button-main"
              onClick={() => playinGeneration('B')}
            >
              Generar partidos Zona B
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

export default Playin
