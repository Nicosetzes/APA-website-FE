import { useState } from 'react'
import { StyledLeagueBox } from './styled'

const LeagueBox = ({ id, name, country, handler }) => {
  return (
    <StyledLeagueBox>
      <div id={id} onClick={handler}>
        <span>{name}</span>
      </div>
    </StyledLeagueBox>
  )
}

export default LeagueBox
