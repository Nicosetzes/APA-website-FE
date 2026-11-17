import ChampionshipBox from '../ChampionshipBox'
import { StyledShowcase } from './styled'

const Showcase = ({ tournaments }) => {
  return (
    <StyledShowcase aria-labelledby="championship-archive-title">
      <div className="showcase__intro">
        <h1 id="championship-archive-title">
          Salón de la fama
          <img
            className="section-title__logo"
            src="/images/sitioapalogo-transparent.png"
            alt=""
          />
        </h1>
      </div>

      <div className="showcase__grid">
        {tournaments?.map(
          ({
            _id,
            name,
            format,
            outcome: { champion, finalist },
            cloudinary_id,
          }) => (
            <ChampionshipBox
              key={_id}
              tournament={name}
              format={format}
              championUserName={champion.player.name}
              championTeamId={champion.team.id}
              championTeamName={champion.team.name}
              finalistUserName={finalist.player.name}
              finalistTeamId={finalist.team.id}
              finalistTeamName={finalist.team.name}
              cloudinary_id={cloudinary_id}
              id={_id}
            />
          ),
        )}
      </div>
    </StyledShowcase>
  )
}

export default Showcase
