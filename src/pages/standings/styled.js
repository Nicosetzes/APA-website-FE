import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 350px;
  padding-inline: 0.5rem;
  width: 100%;

  @media (min-width: 576px) {
    max-width: 500px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 16px;
  width: 100%;
`

export const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 700;
  margin: 0;
`

export const FixtureLink = styled(Link)`
  border: 1px solid var(--blue-900);
  color: var(--blue-900);
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--blue-900);
    color: #fff;
  }
`

export const Card = styled.section`
  margin: 0 8px 16px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  width: 100%;
`

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`

export const GroupsTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--blue-900);
`

export const GroupButtons = styled.div`
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
`

export const GroupButton = styled.button`
  appearance: none;
  border: 1px solid
    ${(p) => (p.$active ? 'var(--green-900)' : 'rgba(0,0,0,0.2)')};
  background: ${(p) => (p.$active ? 'rgba(0, 128, 0, 0.08)' : '#fff')};
  color: ${(p) => (p.$active ? 'var(--green-900)' : 'inherit')};
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: ${(p) =>
      p.$active ? 'rgba(0, 128, 0, 0.15)' : 'rgba(0,0,0,0.04)'};
  }
`

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: 600px;
  padding: 2rem 0 0;
`
