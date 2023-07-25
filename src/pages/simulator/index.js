import { useState, useEffect } from 'react'
import TeamBox from './components/TeamBox'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api, database, cloudName } from './../../api'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Oval } from 'react-loader-spinner'

const Simulator = () => {
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

  const [selectedTeams, setSelectedTeams] = useState([])

  const teamOnClickHandler = (e) => {
    const id = e.target.id

    console.log(id)

    if (selectedTeams.includes(id)) {
      setSelectedTeams((currentTeams) =>
        currentTeams.filter((team) => team !== id),
      )
    } else {
      setSelectedTeams((currentTeams) => [...currentTeams, id])
    }

    console.log(selectedTeams)
  }

  const navigateToCalculator = () => {
    navigate(
      {
        pathname: `/tournaments/${tournament}/simulator/calculator`,
      },
      { state: selectedTeams }, // Send information about selected teams (IDs) //
    )
  }

  if (currentTournament) {
    const { name, players, teams, format, groups } = currentTournament

    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      { name: 'Simulador', route: `tournaments/${tournament}/simulator` },
    ]

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <div>Elija los equipos para la predicción de resultados</div>
        <div>
          {selectedTeams.length &&
            selectedTeams.map((id) => (
              <img
                key={id}
                id={id}
                src={`${database}/logos/${id}`}
                alt={id}
                style={{ margin: '0.5rem', width: '45px' }}
              />
            ))}
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexFlow: 'row wrap',
          }}
        >
          {teams.map(({ team, player }) => (
            <TeamBox
              key={team.id}
              team={team}
              player={player}
              handler={() => teamOnClickHandler(event)}
            />
          ))}
        </div>
        <div>
          <button
            onClick={() => navigateToCalculator()}
            style={{ margin: '1rem auto', padding: '0.5em 0.75em' }}
          >
            Confirmar
          </button>
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

export default Simulator
