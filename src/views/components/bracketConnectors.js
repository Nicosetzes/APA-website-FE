import styled, { css } from 'styled-components'

export const CONNECTOR_GAP = '1.25rem'
export const LINE_WIDTH = 2
export const ELBOW_RADIUS = '8px'
const LINE_COLOR = 'rgba(255, 255, 255, 0.35)'
const LINE_COLOR_DONE = 'rgba(255, 195, 11, 0.85)'

export const lineColor = (done) => (done ? LINE_COLOR_DONE : LINE_COLOR)

export const incomingStub = (edge, done) => css`
  border-top: ${LINE_WIDTH}px solid ${lineColor(done)};
  content: '';
  height: 0;
  ${edge}: 0;
  position: absolute;
  top: calc(50% - ${LINE_WIDTH / 2}px);
  width: ${CONNECTOR_GAP};
`

export const ConnectorDot = styled.span`
  background: var(--orange-900);
  border-radius: 50%;
  height: 8px;
  ${(props) => props.$edge}: calc(${CONNECTOR_GAP} - 4px);
  position: absolute;
  top: calc(50% - 4px);
  width: 8px;
  z-index: 1;
`
