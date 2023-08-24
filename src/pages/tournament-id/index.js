import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { api, database, cloudName } from './../../api'
import axios from 'axios'
import { Image } from 'cloudinary-react'
import StarIcon from '@mui/icons-material/Star'
import { motion } from 'framer-motion'
import { useMediaQuery } from 'react-responsive'
import { Oval } from 'react-loader-spinner'

const TournamentId = () => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  const { tournament } = useParams()

  const navigate = useNavigate()

  const [currentTournament, setCurrentTournament] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`${api}/tournaments/${tournament}`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          console.log(data)
          setCurrentTournament(data)
        })
        .catch((err) => {
          console.log(err)
          navigate('/')
        })
    }
    fetchData()
  }, [])

  if (currentTournament) {
    const { name, players, teams, format, groups, cloudinary_id, outcome } =
      currentTournament

    const champion = outcome?.champion
    const finalist = outcome?.finalist

    console.log(name)
    console.log(players)
    console.log(teams)
    console.log(format)
    console.log(groups)
    console.log(outcome)

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '1.5rem 0',
                  textAlign: 'center',
                }}
              >
                <span>{name}</span>
              </div>{' '}
            </div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                margin: '1rem auto',
                outline: 'black 2px solid',
                padding: '1rem',
                width: '250px',
              }}
            >
              <Link
                to={`fixture`}
                state={{ groups: groups }}
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1rem',
                  textDecoration: 'none',
                }}
              >
                Fixture
              </Link>
              {(format == 'league' ||
                format == 'league_playoff' ||
                format == 'league_playin_playoff' ||
                format == 'world_cup' ||
                format == 'champions_league') && (
                <Link
                  to={`standings`}
                  state={{ groups: groups }}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1rem',
                    textDecoration: 'none',
                  }}
                >
                  Clasificación
                </Link>
              )}
              {format == 'league' && (
                <Link
                  to={`simulator`}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1rem',
                    textDecoration: 'none',
                  }}
                >
                  Simulador
                </Link>
              )}
              <Link
                to={`teams`}
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1rem',
                  textDecoration: 'none',
                }}
              >
                Equipos
              </Link>
              {format == 'league_playin_playoff' && (
                <Link
                  to={`playin`}
                  state={{ groups: groups }}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1rem',
                    textDecoration: 'none',
                  }}
                >
                  Playin
                </Link>
              )}
              {(format == 'playoff' ||
                format == 'league_playoff' ||
                format == 'league_playin_playoff' ||
                format == 'world_cup' ||
                format == 'champions_league') && (
                <Link
                  to={`playoffs`}
                  state={{ groups: groups }}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1rem',
                    textDecoration: 'none',
                  }}
                >
                  Playoffs
                </Link>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', height: '100%' }}>
            <Image
              cloudName={cloudName}
              publicId={cloudinary_id}
              style={{ height: '300px' }}
            />
          </div>
        </div>
        {outcome && (
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              padding: '0 0.75rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#004a79',
                margin: '2rem auto',
                outline: '#cfa420 4px solid',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: !isSm ? 'center' : 'start',
                  margin: '0 0 1rem 0',
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 0.5rem 0 0',
                  }}
                >
                  Campeón
                </span>{' '}
                <StarIcon htmlColor={'#ffc30b'} fontSize={'large'} />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: !isSm ? 'center' : 'start',
                  margin: '0 0 0 1rem',
                }}
              >
                <img
                  src={`${database}/logos/${champion.team.id}`}
                  style={{ width: '150px' }}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    margin: '0 0 0 1.5rem',
                  }}
                >
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {champion.team.name}
                  </div>
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: '1rem 0 0 1rem',
                    }}
                  >
                    ({champion.player.name})
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#004a79',
                margin: '2rem auto',
                outline: '#cfa420 4px solid',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: !isSm ? 'center' : 'start',
                  margin: '0 0 1rem 0',
                }}
              >
                <span
                  style={{
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: 700,
                    margin: '0 0.5rem 0 0',
                  }}
                >
                  Finalista
                </span>{' '}
                <StarIcon htmlColor={'#b3b3b3'} fontSize={'large'} />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'row wrap',
                  justifyContent: !isSm ? 'center' : 'start',
                  margin: '0 0 0 1rem',
                }}
              >
                <img src={`${database}/logos/${finalist.team.id}`} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    margin: '0 0 0 1.5rem',
                  }}
                >
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {finalist.team.name}
                  </div>
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: '1rem 0 0 1rem',
                    }}
                  >
                    ({finalist.player.name})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            margin: '3rem',
          }}
        >
          <span>Equipos:</span>{' '}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {teams.map(({ team }) => (
              <div
                key={team.id}
                style={{
                  backgroundColor: 'grey',
                  display: 'flex',
                  height: '90px',
                  justifyContent: 'center',
                  margin: '1rem',
                  padding: '0.5rem',
                  width: '90px',
                }}
              >
                <img
                  src={`${database}/logos/${team.id}`}
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </div>
        </div>
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

export default TournamentId
