import { useState } from 'react'
import { StyledTeamBox } from './styled'
import { api, database } from './../../../../api'

const TeamBox = ({ team, player, handler }) => {
  const [isTeamActive, setIsTeamActive] = useState(false)

  const isTeamActiveOnClickHandler = () => {
    setIsTeamActive(!isTeamActive)
  }

  return (
    <StyledTeamBox
      onClick={() => isTeamActiveOnClickHandler(event)}
      active={isTeamActive ? true : false}
    >
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
