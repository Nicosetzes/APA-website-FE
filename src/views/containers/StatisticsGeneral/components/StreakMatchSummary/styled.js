import styled from 'styled-components'

const RESULT_COLORS = {
  W: { background: '#18890e', color: 'white' },
  D: { background: '#ffa400', color: '#1f1f1f' },
  L: { background: 'var(--red-700)', color: 'white' },
}

// El partido de corte lleva un borde lateral rojo punteado; el label "Fin" y
// el aria-label ("Partido que cortó la racha") lo nombran en texto, así que no
// depende sólo del color.
export const MatchCard = styled.div`
  background: ${({ $isBreak }) =>
    $isBreak ? 'rgba(179, 10, 10, 0.04)' : 'rgba(0, 74, 121, 0.04)'};
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: ${({ $isBreak }) =>
    $isBreak ? '3px dashed var(--red-700)' : '1px solid rgba(0, 0, 0, 0.08)'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
  padding: 0.5rem 0.6rem;
`

export const MatchLabel = styled.span`
  color: ${({ $isBreak }) =>
    $isBreak ? 'var(--red-700)' : 'rgba(0, 0, 0, 0.6)'};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

export const ScoreLine = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;

  img {
    flex-shrink: 0;
    height: 20px;
    object-fit: contain;
    width: 20px;
  }
`

export const Score = styled.strong`
  color: var(--blue-900);
  font-size: 0.95rem;
`

export const ResultChip = styled.span`
  background: ${({ $result }) =>
    (RESULT_COLORS[$result] || RESULT_COLORS.D).background};
  border-radius: 4px;
  color: ${({ $result }) => (RESULT_COLORS[$result] || RESULT_COLORS.D).color};
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0 0.3rem;
`

export const Opponent = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
`

export const MetaLine = styled.div`
  align-items: center;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  flex-wrap: wrap;
  font-size: 0.75rem;
  gap: 0.35rem;
`

export const TypeChip = styled.span`
  background: rgba(0, 74, 121, 0.12);
  border-radius: 999px;
  color: var(--blue-900);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.05rem 0.4rem;
  text-transform: uppercase;
`
