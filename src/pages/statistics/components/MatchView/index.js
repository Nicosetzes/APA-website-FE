import { StyledMatchView } from './styled'

const MatchView = ({ match }) => {
  const { teamP1, teamP2, scoreP1, scoreP2, tournament, date } = match

  return (
    <StyledMatchView data-aos="flip-left" data-aos-duration="1000">
      <div className="card__match-score">
        <div className="card__match-score-teams">
          <span>{teamP1}</span>
          <span>{teamP2}</span>
        </div>
        <div className="card__match-score-result">
          <span>{scoreP1}</span>
          <span>{scoreP2}</span>
        </div>
      </div>
      <div className="card__match-info">
        <span className="card__match-info-tournament">{tournament}</span>{' '}
        <span className="card__match-info-date">{date}</span>
      </div>
    </StyledMatchView>
  )
}

export default MatchView
