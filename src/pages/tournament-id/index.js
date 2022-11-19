import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const TournamentId = () => {
  const { tournament } = useParams()

  const navigate = useNavigate()

  const [activeTournament, setActiveTournament] = useState()

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
          setActiveTournament(data)
        })
        .catch((err) => {
          console.log(err)
          navigate('/')
        })
    }
    fetchData()
  }, [])

  if (activeTournament) {
    const { name, players, teams } = activeTournament

    console.log(name)
    console.log(players)
    console.log(teams)

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div>
          <span>Nombre del torneo:</span> <span>{name}</span>
        </div>
        <div>
          <span>Jugadores:</span>{' '}
          {players.map(({ name, id }) => (
            <span key={id}>{name}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Equipos:</span>{' '}
          {teams.map(({ team }) => (
            <img
              key={team.id}
              src={`${database}/logos/${team.id}`}
              style={{ width: '30px' }}
            />
          ))}
        </div>
        {/* <div style={{ margin: '1rem 0' }}>
          <Link to={`create-game`}>Cargar resultado</Link>
        </div> */}
        <div style={{ margin: '1rem 0' }}>
          <Link to={`matches`}>Partidos</Link>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <Link to={`standings`}>Clasificación</Link>
        </div>
        {/* <div style={{ margin: '1rem 0' }}>
          <Link to={`playoffs`}>Playoffs</Link>
        </div> */}
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
