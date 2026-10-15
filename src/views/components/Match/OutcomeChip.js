import Tooltip from '../Tooltip'
import { OutcomeChip as Chip, OutcomeChipCell, OutcomeChipsRow } from './styled'
import {
  formatOutcomesPrediction,
  getOutcomesUpsetSide,
} from 'utils/predictions'

const WIN_HELP = 'Prob. de victoria (Rating APA 2.0)'
const DRAW_HELP = 'Prob. de empate (Rating APA 2.0)'

export const getOutcomeChips = ({
  prediction,
  played,
  valid,
  scoreP1,
  scoreP2,
  nameP1,
  nameP2,
}) => {
  const pct = formatOutcomesPrediction(prediction)
  if (!pct) return null

  const upsetSide = getOutcomesUpsetSide({
    prediction,
    played,
    valid,
    scoreP1,
    scoreP2,
  })

  const build = ({ text, label, help, upset }) => ({
    text,
    label: label + (upset ? '. Ganó quien tenía menos probabilidad.' : ''),
    help,
    upset,
  })

  return {
    p1: build({
      text: `V ${pct.p1Pct}%`,
      label: `Probabilidad de que gane ${nameP1 || 'P1'}: ${pct.p1Pct}%`,
      help: WIN_HELP,
      upset: upsetSide === 'p1',
    }),
    draw: build({
      text: `E ${pct.drawPct}%`,
      label: `Probabilidad de empate: ${pct.drawPct}%`,
      help: DRAW_HELP,
      upset: false,
    }),
    p2: build({
      text: `V ${pct.p2Pct}%`,
      label: `Probabilidad de que gane ${nameP2 || 'P2'}: ${pct.p2Pct}%`,
      help: WIN_HELP,
      upset: upsetSide === 'p2',
    }),
  }
}

const OutcomeChip = ({ chip, outcome }) => (
  <Tooltip title={chip.help} describeChild>
    <Chip
      role="img"
      tabIndex={0}
      aria-label={chip.label}
      data-outcome={outcome}
      data-upset={chip.upset || undefined}
    >
      {chip.text}
    </Chip>
  </Tooltip>
)

const OutcomeChips = ({ outcomes }) => {
  if (!outcomes) return null

  return (
    <OutcomeChipsRow>
      <OutcomeChipCell $position="side">
        <OutcomeChip chip={outcomes.p1} outcome="p1Win" />
      </OutcomeChipCell>
      <OutcomeChipCell $position="center">
        <OutcomeChip chip={outcomes.draw} outcome="draw" />
      </OutcomeChipCell>
      <OutcomeChipCell $position="side">
        <OutcomeChip chip={outcomes.p2} outcome="p2Win" />
      </OutcomeChipCell>
    </OutcomeChipsRow>
  )
}

export default OutcomeChips
