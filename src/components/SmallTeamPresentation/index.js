import { StyledSmallTeamPresentation } from './styled'
import { database } from './../../api'

const SmallTeamPresentation = ({ team, player }) => {
  return (
    <>
      <StyledSmallTeamPresentation>
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <div className="position">
            <div className="position-pos">Pos.</div>
            <div className="position-value">{team.position}.</div>
          </div>
          <div className="logo">
            <img src={`${database}/logos/${team.id}`} alt={team.name} />
          </div>
        </div>

        <div className="name">
          {team.name} ({player.name})
        </div>
      </StyledSmallTeamPresentation>
    </>
  )
}

export default SmallTeamPresentation
