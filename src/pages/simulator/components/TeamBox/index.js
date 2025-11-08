import { StyledTeamBox } from './styled'
import { database } from './../../../../api'

const TeamBox = ({ team, player, handler, selectedTeams }) => {
  return (
    <StyledTeamBox active={selectedTeams.includes(team.id) ? true : false}>
      <div id={team.id} onClick={handler}>
        <div id={team.id} className="teambox__team">
          <span id={team.id}>{team.name}</span>{' '}
          <img
            id={team.id}
            src={`${database}/logos/${team.id}`}
            alt={team.name}
          />{' '}
        </div>
        <div id={team.id} className="teambox__player">
          <span id={team.id}>({player.name})</span>
        </div>
      </div>
    </StyledTeamBox>
  )
}

export default TeamBox
