import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLogin } from './../../context/LoginContext'
import { StyledTeams } from './styled'
import TeamCard from '../../components/TeamCard'
import { api } from './../../api'
import axios from 'axios'

const Teams = () => {
  const { tournament } = useParams()

  const login = useLogin()

  const { loginStatus } = login

  const [teams, setTeams] = useState()

  const getTeamsData = async () => {
    // if (loginStatus.id) {
    // await axios
    //   .get(`${api}/tournaments/${tournament}/teams?player=${loginStatus.id}`)
    //   .then(({ data }) => {
    //     setTeams(data.teams)
    //   })
    await axios
      .get(`${api}/tournaments/${tournament}/teams`)
      .then(({ data }) => {
        setTeams(data.teams)
      })
    // }
  }

  useEffect(() => {
    getTeamsData()
  }, [])

  console.log(loginStatus)
  console.log(teams)

  return (
    <StyledTeams>
      {/* {!loginStatus.id && <div>Debe estar logueado</div>} */}
      {teams ? (
        teams.map(({ team, player }) => (
          <TeamCard key={team.id} team={team} player={player} />
        ))
      ) : (
        <div>No hay equipos para mostrar</div>
      )}
    </StyledTeams>
  )
}

export default Teams
