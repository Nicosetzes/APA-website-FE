import { useState } from 'react'
import { StyledFixtureContainer } from './styled'
import Match from './../../../../components/Match'

const FixtureContainer = ({ matches, handleSubmit }) => {
  return (
    <>
      <StyledFixtureContainer>
        {matches.map((match) => (
          <Match key={match._id} match={match} handleSubmit={handleSubmit} />
        ))}
      </StyledFixtureContainer>
    </>
  )
}

export default FixtureContainer
