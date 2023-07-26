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

    if (selectedTeams.length == 6 && !selectedTeams.includes(id)) return // Si se alcanzó el máximo y el equipo clickeado es uno nuevo, retorna

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
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            justifyContent: 'center',
            margin: '1rem 0',
            textAlign: 'center',
          }}
        >
          Elija los equipos para la predicción de resultados (máx 6)
        </div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            margin: '1rem 0',
          }}
        >
          {selectedTeams.length
            ? selectedTeams.map((id) => (
                <img
                  key={id}
                  id={id}
                  src={`${database}/logos/${id}`}
                  alt={id}
                  style={{ margin: '0.5rem', width: '45px' }}
                />
              ))
            : null}
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
          }}
        >
          {teams.map(({ team, player }) => (
            <TeamBox
              key={team.id}
              team={team}
              player={player}
              handler={() => teamOnClickHandler(event)}
              selectedTeams={selectedTeams}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="button-main"
            onClick={() => navigateToCalculator()}
            style={{ margin: '2rem 0 1rem 0' }}
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
