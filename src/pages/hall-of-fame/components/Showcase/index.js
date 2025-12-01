import { StyledShowcase } from './styled'
import ChampionshipBox from '../ChampionshipBox'

const Showcase = ({ tournaments }) => {
  console.log(tournaments)

  return (
    <StyledShowcase>
      <ChampionshipBox
        tournament={'Torneo Argentino 2016'}
        championUserName={'Max'}
        championTeamId={'437'}
        championTeamName={'Rosario Central'}
        finalistUserName={'Leo'}
        finalistTeamId={'460'}
        finalistTeamName={'San Lorenzo'}
        cloudinary_id={'tournaments/rqi862k543ltlmdbgjjm'}
      />
      <ChampionshipBox
        tournament={'Torneo Argentino 2017'}
        championUserName={'Max'}
        championTeamId={'450'}
        championTeamName={'Estudiantes'}
        finalistUserName={'Max'}
        finalistTeamId={'437'}
        finalistTeamName={'Rosario Central'}
        cloudinary_id={'tournaments/rqi862k543ltlmdbgjjm'}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2017'}
        championUserName={'Leo'}
        championTeamId={'27'}
        championTeamName={'Portugal'}
        finalistUserName={'Santi'}
        finalistTeamId={'2'}
        finalistTeamName={'Francia'}
        cloudinary_id={'tournaments/qvkjpzyorvsglzft0ehq'}
      />
      <ChampionshipBox
        tournament={'Torneo Argentino 2018'}
        championUserName={'Leo'}
        championTeamId={'460'}
        championTeamName={'San Lorenzo'}
        finalistUserName={'Santi'}
        finalistTeamId={'435'}
        finalistTeamName={'River Plate'}
        cloudinary_id={'tournaments/rqi862k543ltlmdbgjjm'}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2018 (I)'}
        championUserName={'Leo'}
        championTeamId={'25'}
        championTeamName={'Alemania'}
        finalistUserName={'Santi'}
        finalistTeamId={'2'}
        finalistTeamName={'Francia'}
        cloudinary_id={'tournaments/qvkjpzyorvsglzft0ehq'}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2018 (II)'}
        championUserName={'Max'}
        championTeamId={'1'}
        championTeamName={'Bélgica'}
        finalistUserName={'Leo'}
        finalistTeamId={'25'}
        finalistTeamName={'Alemania'}
        cloudinary_id={'tournaments/qvkjpzyorvsglzft0ehq'}
      />
      <ChampionshipBox
        tournament={'Mundial de Clubes 2018'}
        championUserName={'Max'}
        championTeamId={'33'}
        championTeamName={'Manchester Utd.'}
        finalistUserName={'Max'}
        finalistTeamId={'530'}
        finalistTeamName={'Atlético Madrid'}
        cloudinary_id={'tournaments/mundial-de-clubes_zc7sdt'}
      />
      <ChampionshipBox
        tournament={'Copa Argentina 2018'}
        championUserName={'Max'}
        championTeamId={'436'}
        championTeamName={'Racing'}
        finalistUserName={'Leo'}
        finalistTeamId={'460'}
        finalistTeamName={'San Lorenzo'}
        cloudinary_id={'tournaments/_wz61rs'}
      />
      <ChampionshipBox
        tournament={'Copa América 2019'}
        championUserName={'Santi'}
        championTeamId={'26'}
        championTeamName={'Argentina'}
        finalistUserName={'Max'}
        finalistTeamId={'30'}
        finalistTeamName={'Perú'}
        cloudinary_id={'tournaments/copa-america_yo28ma'}
      />
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
