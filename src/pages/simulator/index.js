import TeamBox from './components/TeamBox'
import { apiClient } from 'api/axiosConfig'
import { motion } from 'framer-motion'
import { api, database } from 'api'
import { BreadCrumbsMUI, PageLoader, PrimaryLink } from 'views/components'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Simulator = () => {
  const { tournament } = useParams()

  const navigate = useNavigate()

  const [currentTournament, setCurrentTournament] = useState()

  useEffect(() => {
    const fetchData = async () => {
      await apiClient
        .get(`${api}/tournaments/${tournament}`)
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
    const { name, teams } = currentTournament

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
        style={{ padding: '1rem' }}
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
          <PrimaryLink
            asButton
            text="Confirmar"
            onClick={() => navigateToCalculator()}
          />
        </div>
      </motion.div>
    )
  } else {
    return <PageLoader />
  }
}

export default Simulator
