import { database } from 'api'
import { StyledMatchPreview } from './styled'
import questionMark from 'images/question.svg'

const MatchPreview = ({
  teamOne,
  positionOne,
  teamTwo,
  positionTwo,
  color,
}) => {
  return (
    <StyledMatchPreview color={color}>
      {teamOne ? (
        <div className="match__team">
          <div>
            <span className="team__position">{positionOne}.</span>
            <img
              src={`${database}/logos/${teamOne.team.id}`}
              alt={teamOne.team.name}
              className="team__image"
            />
          </div>
          <span className="team__name">{teamOne.team.name} </span>
          <span className="team__player">({teamOne.player.name})</span>
        </div>
      ) : (
        <div className="match__team">
          <div>
            <span className="team__position">{positionOne}.</span>
          </div>
          <span className="team__name">Pendiente</span>
          <span className="team__player">(TBA)</span>
        </div>
      )}
      {teamTwo ? (
        <div className="match__team">
          <div>
            <span className="team__position">{positionTwo}.</span>
            <img
              src={`${database}/logos/${teamTwo.team.id}`}
              alt={teamTwo.team.name}
              className="team__image"
            />
          </div>
          <span className="team__name">{teamTwo.team.name} </span>
          <span className="team__player">({teamTwo.player.name})</span>
        </div>
      ) : (
        <div className="match__team">
          <div>
            <span className="team__position">{positionTwo}.</span>
            <img
              src={questionMark}
              alt={'Signo de pregunta'}
              className="team__image small"
            />
          </div>
          <span className="team__name">Pendiente</span>
          <span className="team__player">(TBA)</span>
        </div>
      )}
    </StyledMatchPreview>
  )
}

export default MatchPreview
