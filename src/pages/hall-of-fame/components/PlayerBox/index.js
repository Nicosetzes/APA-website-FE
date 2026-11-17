import { Image } from 'cloudinary-react'
import StarIcon from '@mui/icons-material/Star'
import { StyledPlayerBox } from './styled'
import { cloudName } from 'api'

const PlayerBox = ({ player, trophies }) => {
  const trophyCount = trophies?.length || 0
  const championshipLabel = trophyCount === 1 ? 'CAMPEONATO' : 'CAMPEONATOS'

  return (
    <StyledPlayerBox>
      <article className="player-box">
        <header className="player-box__header">
          <div className="player-box__identity">
            <h3 className="player-box__name">{player}</h3>
            <div
              className="player-box__championships"
              aria-label={`${trophyCount} ${championshipLabel.toLowerCase()}`}
            >
              <StarIcon aria-hidden="true" />
              <span>
                {trophyCount} {championshipLabel}
              </span>
            </div>
          </div>
        </header>

        <div className="player-box__cabinet">
          <div className="player-box__trophies" role="list">
            {trophies?.map((trophy, index) => (
              <div className="player-box__trophy" role="listitem" key={index}>
                <Image
                  cloudName={cloudName}
                  publicId={trophy}
                  alt={`Trofeo ${index + 1} de ${player}`}
                />
              </div>
            ))}
          </div>
        </div>
      </article>
    </StyledPlayerBox>
  )
}

export default PlayerBox
