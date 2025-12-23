import styled from 'styled-components'

export const StyledCard = styled.div`
  background-color: #032c46;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem;
  width: 100%;
  .card__title,
  .card__subtitle,
  .card__text {
    color: #fff;
    margin: 1.25rem 0;
  }
  .card__title {
    font-size: 1.75rem;
    font-weight: 700;
  }
  .card__text {
    align-items: center;
    display: flex;
    justify-content: center;
    max-width: 50ch;
  }
`
