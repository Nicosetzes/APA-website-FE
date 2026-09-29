import styled, { css } from 'styled-components'
import {
  CONNECTOR_GAP,
  ELBOW_RADIUS,
  LINE_WIDTH,
  incomingStub,
  lineColor,
} from '../../bracketConnectors'

// Line leaving a match towards the next round. Pairs of matches draw an
// elbow each (top half / bottom half) so together they form the classic
// bracket "]" shape whose middle point is the center of the next slot.
const outgoingConnector = ({ $side, $position, $done }) => {
  if (!$position) return null

  const edge = $side === 'right' ? 'left' : 'right'
  const color = lineColor($done)

  if ($position === 'single') {
    return css`
      &::after {
        border-top: ${LINE_WIDTH}px solid ${color};
        content: '';
        height: 0;
        ${edge}: 0;
        position: absolute;
        top: calc(50% - ${LINE_WIDTH / 2}px);
        width: ${CONNECTOR_GAP};
      }
    `
  }

  const isFirst = $position === 'first'
  const vertical = isFirst ? 'top' : 'bottom'

  return css`
    &::after {
      border-${edge}: ${LINE_WIDTH}px solid ${color};
      border-${vertical}: ${LINE_WIDTH}px solid ${color};
      border-${vertical}-${edge}-radius: ${ELBOW_RADIUS};
      box-sizing: border-box;
      content: '';
      ${edge}: 0;
      position: absolute;
      ${isFirst ? 'bottom: 0;' : 'top: 0;'}
      ${vertical}: calc(50% - ${LINE_WIDTH / 2}px);
      width: ${CONNECTOR_GAP};
    }
  `
}

export const RoundColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`

export const RoundName = styled.div`
  align-items: center;
  color: ${(props) => (props.$highlight ? 'var(--orange-900)' : '#fff')};
  display: flex;
  font-weight: 700;
  height: 2.5rem;
  justify-content: center;
  letter-spacing: 0.03em;
  margin-bottom: 1rem;
  text-transform: uppercase;
`

export const RoundSlots = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

export const Slot = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  padding: 0.75rem ${CONNECTOR_GAP};
  position: relative;

  ${({ $side, $incoming, $incomingDone = {} }) => {
    if (!$incoming) return null
    if ($side === 'center') {
      return css`
        &::before {
          ${incomingStub('left', $incomingDone.left)}
        }
        &::after {
          ${incomingStub('right', $incomingDone.right)}
        }
      `
    }
    const edge = $side === 'right' ? 'right' : 'left'
    return css`
      &::before {
        ${incomingStub(edge, $incomingDone[edge])}
      }
    `
  }}

  ${outgoingConnector}
`

export const TieGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  ${(props) =>
    props.$legs > 1 &&
    css`
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 14px;
      padding: 0.4rem;
    `}
`

export const CenterStack = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

export const CenterAbove = styled.div`
  bottom: calc(100% + 1.25rem);
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
`

export const CenterBelow = styled.div`
  left: 50%;
  position: absolute;
  top: calc(100% + 1.25rem);
  transform: translateX(-50%);
`
