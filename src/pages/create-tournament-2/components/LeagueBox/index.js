import { useState } from 'react'
import { StyledLeagueBox } from './styled'

const LeagueBox = ({ id, name, country, handler }) => {
  const [isLeagueActive, setIsLeagueActive] = useState(false)

  const isLeagueActiveOnClickHandler = () => {
    setIsLeagueActive(!isLeagueActive)
  }

  return (
    <StyledLeagueBox
      onClick={() => isLeagueActiveOnClickHandler(event)}
      active={isLeagueActive ? true : false}
    >
      <div id={id} onClick={handler}>
        <span id={id}>
          {name} ({country})
        </span>
      </div>
    </StyledLeagueBox>
  )
}

export default LeagueBox
