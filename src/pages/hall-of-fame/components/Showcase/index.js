import ChampionshipBox from '../ChampionshipBox'
import { StyledShowcase } from './styled'

const Showcase = ({ tournaments }) => {
  return (
    <StyledShowcase>
      {tournaments
        ? tournaments.map(
            ({ _id, name, outcome: { champion, finalist }, cloudinary_id }) => (
              <ChampionshipBox
                key={_id}
                tournament={name}
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
          )
        : null}
    </StyledShowcase>
  )
}

export default Showcase
