import styled from 'styled-components'

export const PlayoffsPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 800px;
  padding: 2.75rem 0.75rem;
  width: 100%;
`

export const PlayoffsSideContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`

export const PlayoffsSide = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 280px;
  flex: 1 1 360px;
`

export const PlayoffsSideHeader = styled.h2`
  align-self: center;
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`
