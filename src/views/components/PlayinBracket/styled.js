import styled, { css } from 'styled-components'
import { Image } from 'cloudinary-react'
import {
  CONNECTOR_GAP,
  LINE_WIDTH,
  incomingStub,
  lineColor,
} from '../bracketConnectors'

const ROW_HEIGHT = '170px'
const ELBOW_RADIUS = '8px'

export const Wrapper = styled.div`
  background: #003545;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: auto;
  width: 100%;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: auto auto 200px 200px auto auto;
  grid-template-rows: auto 2.5rem ${ROW_HEIGHT} ${ROW_HEIGHT} auto;
  /* Auto margins center the bracket (legend included) on both axes
     without clipping it when the viewport is smaller */
  margin: auto;
  min-width: fit-content;
  /* No row-gap: rows 3 and 4 must touch so the elbows stay continuous */
`

const placement = ({ $col, $row }) => css`
  grid-column: ${$col};
  grid-row: ${$row};
`

export const ZoneTitle = styled.div`
  ${placement}
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  text-align: center;
  text-transform: uppercase;
`

export const RoundName = styled.div`
  ${placement}
  align-items: center;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  font-size: 0.85rem;
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`

export const CenterTitle = styled.div`
  ${placement}
  align-items: center;
  color: var(--orange-900);
  display: flex;
  font-size: 1.1rem;
  font-weight: 700;
  gap: 0.35rem;
  justify-content: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const TournamentLogo = styled(Image)`
  height: 80px;
  object-fit: contain;
  width: 80px;
`

const outgoing = ({ $out, $edge }) => {
  if (!$out) return null
  const { type, done, loserDone } = $out
  const color = lineColor(done)

  if (type === 'straight') {
    return css`
      &::after {
        border-top: ${LINE_WIDTH}px solid ${color};
        content: '';
        ${$edge}: 0;
        position: absolute;
        top: calc(50% - ${LINE_WIDTH / 2}px);
        width: ${CONNECTOR_GAP};
      }
    `
  }

  if (type === 'split') {
    return css`
      &::after {
        border-${$edge}: ${LINE_WIDTH}px dashed ${lineColor(loserDone)};
        border-top: ${LINE_WIDTH}px solid ${color};
        bottom: 0;
        box-sizing: border-box;
        content: '';
        ${$edge}: 0;
        position: absolute;
        top: calc(50% - ${LINE_WIDTH / 2}px);
        width: ${CONNECTOR_GAP};
      }
    `
  }

  return css`
    &::after {
      border-${$edge}: ${LINE_WIDTH}px solid ${color};
      border-bottom: ${LINE_WIDTH}px solid ${color};
      border-bottom-${$edge}-radius: ${ELBOW_RADIUS};
      bottom: calc(50% - ${LINE_WIDTH / 2}px);
      box-sizing: border-box;
      content: '';
      ${$edge}: 0;
      position: absolute;
      top: 0;
      width: ${CONNECTOR_GAP};
    }
  `
}

export const Cell = styled.div`
  ${placement}
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 ${CONNECTOR_GAP};
  position: relative;

  ${({ $in }) =>
    $in &&
    css`
      &::before {
        ${incomingStub($in.edge, $in.done)}
      }
    `}

  ${outgoing}
`

export const PassLine = styled.div`
  ${placement}
  align-self: center;
  border-top: ${LINE_WIDTH}px solid ${(props) => lineColor(props.$done)};
  height: 0;
  margin-top: -${LINE_WIDTH / 2}px;
`

export const QualifiedCard = styled.div`
  align-items: center;
  background: rgb(0, 26, 42);
  border: 1px solid
    ${(props) =>
      props.$filled ? 'rgba(255, 195, 11, 0.8)' : 'rgba(255, 255, 255, 0.15)'};
  border-radius: 10px;
  box-shadow: ${(props) =>
    props.$filled
      ? '0 0 12px rgba(255, 195, 11, 0.25)'
      : '0 2px 6px rgba(0, 0, 0, 0.35)'};
  box-sizing: border-box;
  display: flex;
  flex-direction: ${(props) =>
    props.$edge === 'right' ? 'row-reverse' : 'row'};
  gap: 0.6rem;
  min-height: 58px;
  padding: 0.5rem 0.75rem;
  text-align: ${(props) => (props.$edge === 'right' ? 'right' : 'left')};
  width: 100%;

  img {
    flex-shrink: 0;
    height: 30px;
    object-fit: contain;
    width: 30px;
  }
`

export const QualifiedInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`

export const QualifiedLabel = styled.span`
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

export const QualifiedName = styled.span`
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const QualifiedPlayer = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Legend = styled.div`
  ${placement}
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  font-size: 0.75rem;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1.25rem;
`

export const LegendItem = styled.span`
  align-items: center;
  display: flex;
  gap: 0.5rem;

  &::before {
    border-top: ${LINE_WIDTH}px
      ${(props) => (props.$dashed ? 'dashed' : 'solid')}
      rgba(255, 255, 255, 0.6);
    content: '';
    width: 24px;
  }
`
