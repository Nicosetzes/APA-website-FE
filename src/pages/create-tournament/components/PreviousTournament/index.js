import { StyledPreviousTournament } from './styled'

const PreviousTournaments = ({ id, name, database }) => {
  return (
    <StyledPreviousTournament
      key={id}
      // background={`${database}/tournaments/logos/${id}`}
    >
      <div className="previous-tournaments-title">{name}</div>
      <div className="previous-tournaments-img">
        <img src={`${database}/tournaments/logos/${id}`} />
      </div>
    </StyledPreviousTournament>
  )
}

export default PreviousTournaments
