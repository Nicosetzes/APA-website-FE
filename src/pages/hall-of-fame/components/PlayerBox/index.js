import { StyledPlayerBox } from './styled'
import { useMediaQuery } from 'react-responsive'

const PlayerBox = ({ player, trophies }) => {
  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 600px)' })
  const isXS = useMediaQuery({ query: '(min-width: 400px)' })
  return (
    <>
      <StyledPlayerBox
        style={{ width: !isSm && '350px', height: !isSm && '200px' }}
      >
        <div className="player-box-name">{player}</div>
        <div className="player-box-trophies">
          {trophies &&
            trophies.map((trophy, index) => (
              <img
                key={index}
                src={trophy}
                style={{ width: !isSm && '75px' }}
              />
            ))}
        </div>
      </StyledPlayerBox>
    </>
  )
}

export default PlayerBox
