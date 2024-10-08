import { database } from './../../../../api'
import { StyledMatchPreview } from './styled'
import { useMediaQuery } from 'react-responsive'
import questionMark from './../../../../images/question.svg'

const MatchPreview = ({
  teamOne,
  positionOne,
  teamTwo,
  positionTwo,
  color,
}) => {
  //   const isL = useMediaQuery({ query: "(min-width: 992px)" });
  //   const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  //   const isXS = useMediaQuery({ query: "(min-width: 400px)" });
  return (
    <StyledMatchPreview isSm={isSm} color={color}>
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
        </div>
      )}
      <span className="match__separator">-</span>
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
        </div>
      )}
    </StyledMatchPreview>
  )
}

export default MatchPreview
