import { describeRatingChange } from 'utils/ratings'
import { Delta } from './styled'

const EloDelta = ({ change }) => {
  if (typeof change !== 'number' || !Number.isFinite(change)) return null
  const { trend, text } = describeRatingChange(change)
  return <Delta data-trend={trend}>{`${text} ELO`}</Delta>
}

export default EloDelta
