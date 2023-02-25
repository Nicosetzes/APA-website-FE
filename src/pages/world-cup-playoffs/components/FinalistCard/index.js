import { StyledFinalistCard } from './styled'
import { database } from './../../../../api'
import trophyWorldCup from './../../../../images/world-cup.png'

const ChampionCard = ({ finalist }) => {
  const { player, team, tournament } = finalist
  console.log(finalist)
  return (
    <StyledFinalistCard>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Subcampeón</div>
      <img src={trophyWorldCup} alt={team.name} />
      <div className="finalist">
        <div className="finalist-team">{team.name}</div>
        <div className="finalist-player">{player.name}</div>
        <div className="finalist-tournament">{tournament.name}</div>
      </div>
      <img src={`${database}/logos/${team.id}`} alt={team.name} />
    </StyledFinalistCard>
  )
}

export default ChampionCard
