import { StyledPlayerBox } from './styled'
import { useMediaQuery } from 'react-responsive'

const PlayerBox = ({ player, trophies }) => {
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  // const isXS = useMediaQuery({ query: '(min-width: 400px)' })
  console.log(trophies)
  return (
    <>
      <StyledPlayerBox style={{ width: !isM && '350px' }}>
        <div className="player-box-name">
          {player}{' '}
          <span style={{ fontSize: '2rem' }}>{`(x${trophies.length})`}</span>
        </div>
        <div className="player-box-trophies">
          {trophies &&
            trophies.map((trophy, index) => <img key={index} src={trophy} />)}
        </div>
      </StyledPlayerBox>
    </>
  )
}

export default PlayerBox
