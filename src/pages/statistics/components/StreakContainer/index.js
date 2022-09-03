import { StyledStreakContainer } from './styled'
import StreakBox from './../StreakBox'

const StreakContainer = ({ individualStreak }) => {
  const { player, streak } = individualStreak

  return (
    <StyledStreakContainer>
      <div className="card__streak">
        <div className="card__streak-player">{player}</div>
        <div className="card__streak-outcome">
          {streak.map((result, index) => (
            <StreakBox
              key={index}
              result={result.outcome}
              playerP1={result.playerP1}
              teamP1={result.teamP1}
              scoreP1={result.scoreP1}
              playerP2={result.playerP2}
              teamP2={result.teamP2}
              scoreP2={result.scoreP2}
              date={result.date}
              tournament={result.tournament}
            />
          ))}
        </div>
      </div>
    </StyledStreakContainer>
  )
}

export default StreakContainer
