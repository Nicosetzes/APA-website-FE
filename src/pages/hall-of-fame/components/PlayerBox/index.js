import { useMediaQuery } from 'react-responsive'
import StarIcon from '@mui/icons-material/Star'
import { StyledPlayerBox } from './styled'

const PlayerBox = ({ player, trophies }) => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 400px)' })

  console.log({ player, trophies })

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
