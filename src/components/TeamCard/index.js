// import { Link } from 'react-router-dom'
import { StyledTeamCard } from './styled'
import { database } from '../../api'

const TeamCard = ({ team, player }) => {
  return (
    <StyledTeamCard>
      <div className="header">
        <div className="header-name">{team.name}</div>
        <div className="header-logo">
          <img src={`${database}/logos/${team.id}`} />
        </div>
        <div className="header-player">{player.name}</div>
      </div>
      {/* <div className="body">
        <div className="body-squad">
          <Link to={`${team.id}/squad`}>Ver alineación</Link>
        </div>
      </div> */}
    </StyledTeamCard>
  )
}

export default TeamCard
