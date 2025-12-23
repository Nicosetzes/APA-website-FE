import { StyledPlayerInformationModal } from './styled'

const PlayerInformationModal = ({ name, stats }) => {
  const {
    total,
    wins,
    winsByPenalties,
    draws,
    losses,
    lossesByPenalties,
    goalsFor,
    goalsAgainst,
    scoringDifference,
  } = stats

  return (
    <StyledPlayerInformationModal>
      <div style={{ color: '#fff', fontSize: '1.25rem', margin: 'auto' }}>
        {name}
      </div>
      <div className="container__stats">
        <div className="stats-item">PJ: {total}</div>
        <div className="stats-item">PG: {wins.amount}</div>
        <div className="stats-item">PG (penales): {winsByPenalties.amount}</div>
        <div className="stats-item">PE: {draws.amount}</div>
        <div className="stats-item">PP: {losses.amount}</div>
        <div className="stats-item">
          PP (penales): {lossesByPenalties.amount}
        </div>
        <div className="stats-item">GF: {goalsFor}</div>
        <div className="stats-item">GC: {goalsAgainst}</div>
        <div className="stats-item">DF: {scoringDifference}</div>
      </div>
    </StyledPlayerInformationModal>
  )
}

export default PlayerInformationModal
