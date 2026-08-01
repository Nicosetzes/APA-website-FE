import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0 auto;
  max-width: 1400px;
  padding: 2.75rem 0.75rem;
  width: 100%;
  @media (min-width: 1366px) {
    flex-direction: row;
  }
`

export const TableTitle = styled.h2`
  align-self: center;
  color: var(--blue-900);
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`
