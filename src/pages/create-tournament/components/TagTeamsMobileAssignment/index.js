import { useState } from 'react'
import { StyledMobileAssignment } from './styled'
import { database } from '../../../../api'

const TagTeamsMobileAssignment = ({
  players,
  teams,
  groups,
  createTournament,
}) => {
  // const [unassignedTeams, setUnassignedTeams] = useState(teams)
  const [assignedTeams, setAssignedTeams] = useState(
    teams.map(({ id, name }) => {
      return {
        team: { id: id.toString(), name },
      } /* If I don't do toString() id is later saved as a number here on mobile, which is not the way I store the ID in the DB */
    }),
  )

  console.log(assignedTeams)

  return (
    <StyledMobileAssignment>
      <div className="container__teams">
        {assignedTeams.map(({ team, color }) => (
          <div
            key={team.id}
            className="teams-box"
            style={{ border: `${color ? `${color}` : `#000`} 2px solid` }}
          >
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                margin: '0.5rem 0',
              }}
            >
              <span className="teams-box-title">
                {team.name[0].toUpperCase()}
                {team.name[1].toUpperCase()}
                {team.name[2].toUpperCase()}
              </span>
              <img
                src={`${database}/logos/${team.id}`}
                className="teams-box-logo"
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          margin: '1rem auto',
          padding: '0.25rem',
          width: '250px',
        }}
      >
        <button
          style={{ backgroundColor: 'rgb(7, 150, 114)' }}
          onClick={() => createTournament(assignedTeams)}
        >
          Crear torneo
        </button>
      </div>
    </StyledMobileAssignment>
  )
}

export default TagTeamsMobileAssignment
