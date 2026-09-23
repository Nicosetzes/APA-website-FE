import { StyledCard } from './styled'

const Card = ({ title, subtitle, text }) => {
  return (
    <StyledCard>
      <div className="card__title">{title}</div>
      <div className="card__subtitle">{subtitle}</div>
      <div className="card__text">{text}</div>
    </StyledCard>
  )
}

export default Card
