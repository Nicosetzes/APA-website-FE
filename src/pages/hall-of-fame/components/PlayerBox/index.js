import StarIcon from '@mui/icons-material/Star'
import { StyledPlayerBox } from './styled'
import { useMediaQuery } from 'react-responsive'

const PlayerBox = ({ player, trophies }) => {
  const isM = useMediaQuery({ query: '(min-width: 768px)' })

  return (
    <>
      <StyledPlayerBox style={{ width: !isM && '350px' }}>
        <div className="player-box">
          <div className="player-box__name">{player}</div>
          <div className="player-box__stars">
            {trophies &&
              trophies.map((trophy, index) => (
                <StarIcon
                  key={index}
                  htmlColor={'#ffc30b'}
                  fontSize={'large'}
                />
              ))}
          </div>
          <div className="player-box__trophies">
            {trophies &&
              trophies.map((trophy, index) => <img key={index} src={trophy} />)}
          </div>
        </div>
      </StyledPlayerBox>
    </>
  )
}

export default PlayerBox
