import styled from 'styled-components'

export const StyledMatchPreview = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  max-width: 300px;
  border: var(--blue-900) 2px solid;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  width: 100%;
  .match__team {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 0.75rem 0.25rem;
    .team__position {
      color: #086128;
      font-size: 2.25rem;
      font-weight: 700;
    }
    .team__image {
      height: 60px;
      margin-left: 0.25rem;
      width: 60px;
    }
    .team__name,
    .team__player {
      font-size: 1rem;
      font-weight: 700;
    }
  }
`
