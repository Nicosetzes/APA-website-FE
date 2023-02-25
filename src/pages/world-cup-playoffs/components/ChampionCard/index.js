import { StyledChampionCard } from './styled'
import { database } from './../../../../api'
import trophyWorldCup from './../../../../images/world-cup.png'

const ChampionCard = ({ champion }) => {
  const { player, team, tournament } = champion
  console.log(champion)
  return (
    <StyledChampionCard>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Campeón</div>
      <img src={trophyWorldCup} alt={team.name} />
      <div className="champion">
        <div className="champion-team">{team.name}</div>
        <div className="champion-player">{player.name}</div>
        <div className="champion-tournament">{tournament.name}</div>
      </div>
      <img src={`${database}/logos/${team.id}`} alt={team.name} />
    </StyledChampionCard>
  )
}

export default ChampionCard
