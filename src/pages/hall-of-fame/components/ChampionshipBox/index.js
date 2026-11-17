import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Image } from 'cloudinary-react'
import { cloudName, database } from 'api'
import { getTournamentFormatLabel } from 'utils/tournamentFormat'
import { StyledChampionshipBox } from './styled'

const ChampionshipBox = ({
  tournament,
  format,
  championUserName,
  championTeamId,
  championTeamName,
  finalistUserName,
  finalistTeamId,
  finalistTeamName,
  cloudinary_id,
  id,
}) => {
  return (
    <StyledChampionshipBox
      to={`/tournaments/${id}`}
      aria-label={`Ver torneo ${tournament}`}
    >
      <header className="showcase__header">
        <div className="showcase__header-copy">
          <div className="showcase__format">
            {getTournamentFormatLabel(format)}
          </div>
          <h2 className="showcase__title">{tournament}</h2>
        </div>
        <span className="showcase__link-label" aria-hidden="true">
          <span>Ver torneo</span>
          <ArrowForwardIcon />
        </span>
      </header>

      <div className="showcase__trophy">
        <Image
          cloudName={cloudName}
          publicId={cloudinary_id}
          alt={`Trofeo de ${tournament}`}
        />
      </div>

      <div className="showcase__results">
        <div className="showcase__result showcase__result--champion">
          <div className="showcase__result-label">Campeón</div>
          <div className="showcase__result-content">
            <img
              src={`${database}/logos/small/${championTeamId}`}
              alt={`Escudo de ${championTeamName}`}
            />
            <div className="showcase__result-info">
              <div className="showcase__team">{championTeamName}</div>
              <div className="showcase__player">{championUserName}</div>
            </div>
          </div>
        </div>

        <div className="showcase__result showcase__result--finalist">
          <div className="showcase__result-label">Subcampeón</div>
          <div className="showcase__result-content">
            <img
              src={`${database}/logos/small/${finalistTeamId}`}
              alt={`Escudo de ${finalistTeamName}`}
            />
            <div className="showcase__result-info">
              <div className="showcase__team">{finalistTeamName}</div>
              <div className="showcase__player">{finalistUserName}</div>
            </div>
          </div>
        </div>
      </div>
    </StyledChampionshipBox>
  )
}

export default ChampionshipBox
