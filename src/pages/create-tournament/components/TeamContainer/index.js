import { StyledForm } from './styled'
import { api, database } from './../../../../api'
import Checkbox from '../../../../components/Checkbox'
import { useState } from 'react'
import axios from 'axios'

const TeamContainer = ({ teams }) => {
  const [tournamentInfo, setTournamentInfo] = useState()

  // const [tournamentTeams, setTournamentTeams] = useState([])

  const handleTournamentInfoChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setTournamentInfo((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const allInputs = Array.from(event.target)

    const selectedTeams = allInputs
      .filter(({ checked }) => {
        return checked
      })
      .map(({ id, value }) => {
        return {
          id,
          name: value,
        }
      })

    console.log(selectedTeams)

    axios
      .post(`${api}/tournaments`, {
        tournamentInfo,
        selectedTeams,
      })
      .then((response) => {
        console.log(response.data)
      })
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <div>
        <span>¿Cuál será el nombre del torneo?</span>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={tournamentInfo?.name}
          onChange={handleTournamentInfoChange}
        />
      </div>
      <div>
        <span>¿Quiénes participarán del torneo?</span>
        {/* DESARROLLAR LA LÓGICA, HAY QUE TRAER LOS NOMBRES DE LA BASE DE DATOS Y GENERAR INPUTS */}
      </div>
      <div className="header">Equipos</div>
      <div className="container__teams">
        {teams.map(({ team, league }) => (
          <div key={team.id}>
            <Checkbox
              id={team.id}
              value={team.name}
              label={team.name}
              img={`${database}/leagues/${league.id}/teams/${team.id}/logo`}
            />
            {/* <img
              src={`${database}/leagues/${league.id}/teams/${team.id}/logo`}
              alt={team.name}
            />
            <label htmlFor={`custom-checkbox-${index}`}>
              {team.name} ({team.country})
            </label>
            <input
              type="checkbox"
              id={`custom-checkbox-${index}`}
              name={team.name}
              value={team.name}
              checked={checkedTeamsState[index]}
              onChange={() => handleTeamChange(index)}
            /> */}
          </div>
        ))}
      </div>

      <input type="submit" className="form__submit" />
    </StyledForm>
  )
}

export default TeamContainer
