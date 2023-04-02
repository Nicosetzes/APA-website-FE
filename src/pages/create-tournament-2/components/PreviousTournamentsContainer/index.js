import { StyledPreviousTournamentsContainer } from './styled'
import PreviousTournament from './../PreviousTournament'

const PreviousTournamentsContainer = ({ database, tournaments }) => {
  return (
    <StyledPreviousTournamentsContainer>
      <span className="previous-title">Torneos previos</span>
      <div className="previous-tournaments">
        {tournaments.map(({ id, name }) => (
          <PreviousTournament
            key={id}
            id={id}
            name={name}
            database={database}
            // background={`${database}/tournaments/logos/${id}`}
          />
        ))}
      </div>
    </StyledPreviousTournamentsContainer>
  )
}

export default PreviousTournamentsContainer
