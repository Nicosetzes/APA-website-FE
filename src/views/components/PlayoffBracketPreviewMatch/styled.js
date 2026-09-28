import styled from 'styled-components'

export const MatchCard = styled.div`
  background: rgb(0, 26, 42);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  position: relative;
  width: 260px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.35);
    height: 2px;
    width: 24px;
    ${(props) => (props.side === 'right' ? 'left: -24px;' : 'right: -24px;')}
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: var(--orange-900);
    border-radius: 50%;
    height: 8px;
    width: 8px;
    ${(props) => (props.side === 'right' ? 'left: -28px;' : 'right: -28px;')}
  }
`

export const TeamRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: ${(props) =>
    props.side === 'right' ? 'row-reverse' : 'row'};
  gap: 0.6rem;
  padding: 0.6rem 0.85rem;
`

export const Seed = styled.span`
  align-items: center;
  background: var(--blue-900);
  border-radius: 50%;
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  height: 20px;
  justify-content: center;
  padding: 1em;
  width: 20px;
`

export const TeamLogo = styled.img`
  flex-shrink: 0;
  height: 28px;
  object-fit: contain;
  width: 28px;
`

export const TeamInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  text-align: ${(props) => (props.side === 'right' ? 'right' : 'left')};
`

export const TeamCode = styled.span`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TeamResults = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const TeamPlayerName = styled.span`
  color: #fff;
  font-size: 0.75rem;
  margin-top: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Divider = styled.div`
  align-items: center;
  color: rgba(255, 255, 255, 0.35);
  display: flex;
  font-size: 0.6rem;
  font-weight: 700;
  gap: 0.5rem;
  letter-spacing: 0.05em;
  padding: 0 0.85rem;

  &::before,
  &::after {
    background: rgba(255, 255, 255, 0.15);
    content: '';
    flex: 1;
    height: 1px;
  }
`
