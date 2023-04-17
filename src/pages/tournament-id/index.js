import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { api, database, cloudName } from './../../api'
import axios from 'axios'
import { Image } from 'cloudinary-react'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const TournamentId = () => {
  const { tournament } = useParams()

  const navigate = useNavigate()

  const [currentTournament, setCurrentTournament] = useState()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de dataaaa')
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
    const { name, players, teams, type, apa_id, cloudinary_id } =
      currentTournament

    console.log(name)
    console.log(players)
    console.log(teams)
    console.log(type)

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
                style={{
                  color: '#004a79',
                  fontSize: '2rem',
                  margin: '1.25rem',
                  textDecoration: 'none',
                }}
              >
                Fixture
              </Link>
              {(type == 'league' || type == 'world_cup') && (
                <Link
                  to={`standings`}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1.25rem',
                    textDecoration: 'none',
                  }}
                >
                  Clasificación
                </Link>
              )}
              {type == 'playoffs' && (
                <Link
                  to={`playoffs`}
                  style={{
                    color: '#004a79',
                    fontSize: '2rem',
                    margin: '1.25rem',
                    textDecoration: 'none',
                  }}
                >
                  Playoffs
                </Link>
              )}
            </div>
          </div>
          <div>
            <Image
              cloudName={cloudName}
              publicId={cloudinary_id}
              style={{ height: '300px' }}
            />
          </div>
        </div>
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
