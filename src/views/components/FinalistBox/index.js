import { StyledFinalistBox } from './styled'
import StarIcon from '@mui/icons-material/Star'
import { database } from 'api'

const FinalistBox = ({ match }) => {
  const { outcome } = match
  return (
    <StyledFinalistBox>
      <div className="title">
        Finalista <StarIcon htmlColor={'#b3b3b3'} fontSize={'large'} />
      </div>
      <img
        className="team"
        src={`${database}/logos/${outcome.teamThatLost.id}`}
      />
      <div className="player">{outcome.playerThatLost.name}</div>
    </StyledFinalistBox>
  )
}

export default FinalistBox
