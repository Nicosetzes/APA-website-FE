import { useState, useEffect } from 'react'
import { StyledTeamBox } from './styled'
import { database } from './../../../../api'

const TeamBox = ({ team, updateSelectedTeams, selectedTeams }) => {
  const [isTeamActive, setIsTeamActive] = useState(false)
  // const [hasTeamBeenPreviouslySelected, setHasTeamBeenPreviouslySelected] =
  //   useState()

  const isTeamActiveOnClickHandler = () => {
    setIsTeamActive(!isTeamActive)
  }

  const checkIfTeamHasBeenPreviouslySelected = (id) => {
    setIsTeamActive(selectedTeams.map(({ id }) => id).includes(id))
  }

  useEffect(() => {
    checkIfTeamHasBeenPreviouslySelected(team.id)
  }, [])

  return (
    <StyledTeamBox
      onClick={() => isTeamActiveOnClickHandler(event)}
      active={isTeamActive ? true : false}
    >
      <div
        key={team.id}
        onClick={() => updateSelectedTeams(team)}
        className="teams__container-team"
      >
        <span>{team.name}</span>
        <img src={`${database}/logos/${team.id}`} />
      </div>
    </StyledTeamBox>
  )
}

export default TeamBox
