import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api, database } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const TournamentId = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const [tournament, setTournament] = useState()

  useEffect(() => {
    const fetchData = async () => {
      console.log('Hago el fetch de data')
      await axios
        .get(`${api}/tournaments/${id}`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then(({ data }) => {
          setTournament(data)
        })
        .catch((err) => {
          console.log(err)
          navigate('/')
        })
    }
    fetchData()
  }, [])

  if (tournament) {
    const { name, players, teams } = tournament

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
          {teams.map(({ name, id }) => (
            <img
              key={id}
              src={`${database}/logos/${id}`}
              style={{ width: '30px' }}
            />
          ))}
        </div>
        <Link to={`create-game`}>Cargar resultado</Link>
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
