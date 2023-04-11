import { StyledPreviousTournamentsContainer } from './styled'
import PreviousTournament from './../PreviousTournament'

const PreviousTournamentsContainer = ({ database, tournaments }) => {
  console.log(tournaments)

  return (
    <StyledPreviousTournamentsContainer>
      <span className="previous-title">Torneos previos</span>
      <div className="previous-tournaments">
        {tournaments.map(({ apa_id, name }) => (
          <PreviousTournament
            key={apa_id}
            id={apa_id}
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
