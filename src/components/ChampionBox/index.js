import { StyledChampionBox } from './styled'
import StarIcon from '@mui/icons-material/Star'
import { database } from './../../api'

const ChampionBox = ({ match }) => {
  const { outcome } = match
  return (
    <StyledChampionBox>
      <div className="title">
        Campeón
        <StarIcon htmlColor={'#ffc30b'} fontSize={'large'} />
      </div>
      <img
        className="team"
        src={`${database}/logos/${outcome.teamThatWon.id}`}
      />
      <div className="player">{outcome.playerThatWon.name}</div>
    </StyledChampionBox>
  )
}

export default ChampionBox
