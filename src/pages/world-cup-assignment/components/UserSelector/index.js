import { useState, useEffect } from 'react'
import { api, database } from './../../../../api'
import axios from 'axios'
import { useTeamAssignment } from '../../../../context/TeamAssignmentContext'

const UserSelector = ({ players, team }) => {
  const tournament = '6372f83c88e2408e9cadcc73' // Harcodeado, REVISAR //

  const teamAssignment = useTeamAssignment()

  // const [teamAssignment, setTeamAssignment] = useState('')

  const handleSelectChange = (event) => {
    const teamId = event.target.id
    const teamGroup = event.target.name
    const userId = event.target.value
    teamAssignment.updateAssignment({
      team: { id: teamId, group: teamGroup },
      user: { id: userId },
    })
  }

  const teamAssignmentSubmit = (e) => {
    e.preventDefault()
    console.log(teamAssignment.assignment)
    axios
      .put(
        `${api}/world-cup/${tournament}/team-assignment`,
        teamAssignment.assignment,
      )
      .then(({ data }) => {
        console.log(data)
      })
  }

  return (
    <>
      <form onSubmit={(e) => teamAssignmentSubmit(e)}>
        <select id={team.id} name={team.group} onChange={handleSelectChange}>
          <option>Seleccione</option>
          {players.map(({ name, id }) => (
            <option name={id} value={id} key={id}>
              {name}
            </option>
          ))}
          <option name={'IA'} value={'IA'}>
            IA
          </option>
        </select>
        <input type="submit" value="Confirmar" />
      </form>
    </>
  )
}

export default UserSelector
