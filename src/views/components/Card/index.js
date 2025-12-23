import { StyledCard } from './styled'
// import ArchiveIcon from '@mui/icons-material/Archive'
// import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

const Card = ({ title, subtitle, icon, text }) => {
  return (
    <StyledCard>
      <div className="card__title">{title}</div>
      <div className="card__subtitle">{subtitle}</div>
      {/* <div>{icon}</div> */}
      <div className="card__text">{text}</div>
    </StyledCard>
  )
}

export default Card
