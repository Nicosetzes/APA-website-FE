import { StyledNationalTeamBox } from './styled'
import { database } from './../../../../api'
import UserSelector from '../UserSelector'

const NationalTeamBox = ({ team, players }) => {
  return (
    <>
      <StyledNationalTeamBox>
        <div className="box__header">
          <span className="header-team">{team.name}</span>
          <img
            className="header-logo"
            src={`${database}/logos/${team.id}`}
            alt={team.name}
          />
        </div>
        <div
          className="box__body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '70%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <UserSelector
            team={team}
            players={players}
            style={{ margin: 'auto 0' }}
          />
          <div>Grupo: {team.group}</div>
        </div>
      </StyledNationalTeamBox>
    </>
  )
}

export default NationalTeamBox
