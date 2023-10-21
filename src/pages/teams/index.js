import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { StyledTeams } from './styled'
import TeamCard from '../../components/TeamCard'
import BreadCrumbsMUI from './../../components/BreadCrumbsMUI'
import { Oval } from 'react-loader-spinner'
import { api } from './../../api'
import axios from 'axios'

const Teams = () => {
  const { tournament } = useParams()

  const [tournamentData, setTournamentData] = useState()

  const getTournamentData = () => {
    console.log('Traigo la data del torneo')
    axios
      .get(`${api}/tournaments/${tournament}`)
      .then(({ data }) => setTournamentData(data))
  }

  const [teams, setTeams] = useState()

  const getTeamsData = async () => {
    await axios
      .get(`${api}/tournaments/${tournament}/teams`)
      .then(({ data }) => {
        setTeams(data.teams)
      })
    // }
  }

  useEffect(() => {
    getTournamentData()
    getTeamsData()
  }, [])

  if (tournamentData && teams) {
    const { name } = tournamentData
    const breadCrumbsLinks = [
      { name: 'Home', route: '' },
      { name: 'Torneos', route: 'tournaments' },
      {
        name: `${name}`,
        route: `tournaments/${tournament}`,
      },
      {
        name: 'Jugadores',
        route: `tournaments/${tournament}/teams`,
      },
    ]
    return (
      <>
        <BreadCrumbsMUI links={breadCrumbsLinks} />
        <StyledTeams>
          {teams ? (
            teams.map(({ team, player }) => (
              <TeamCard key={team.id} team={team} player={player} />
            ))
          ) : (
            <div>No hay equipos para mostrar</div>
          )}
        </StyledTeams>
      </>
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

export default Teams
