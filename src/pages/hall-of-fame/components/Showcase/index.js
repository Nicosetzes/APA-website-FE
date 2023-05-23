import { StyledShowcase } from './styled'
import ChampionshipBox from '../ChampionshipBox'
import banderaAlemania from './../../../../images/alemania-bandera.png'
import banderaArgentina from './../../../../images/argentina-bandera.png'
import banderaBelgica from './../../../../images/belgica-bandera.png'
import banderaFrancia from './../../../../images/francia-bandera.png'
import banderaPeru from './../../../../images/peru-bandera.png'
import banderaPortugal from './../../../../images/portugal-bandera.png'
import banderaBrazil from './../../../../images/brazil-bandera.png'
import banderaPolonia from './../../../../images/polonia-bandera.png'
import logoAtleticoMadrid from './../../../../images/atletico-madrid-escudo.png'
import logoBayern from './../../../../images/bayern-escudo.png'
import logoEstudiantes from './../../../../images/estudiantes-escudo.png'
import logoLanus from './../../../../images/lanus-escudo.png'
import logoLiverpool from './../../../../images/liverpool-escudo.png'
import logoLokomotiv from './../../../../images/lokomotiv-escudo.png'
import logoManchesterUnited from './../../../../images/manchester-united-escudo.png'
import logoRacingClub from './../../../../images/racing-club-escudo.png'
import logoRealMadrid from './../../../../images/real-madrid-escudo.png'
import logoRiverPlate from './../../../../images/river-plate-escudo.png'
import logoRosarioCentral from './../../../../images/rosario-central-escudo.png'
import logoSanLorenzo from './../../../../images/san-lorenzo-escudo.png'
import logoTottenhamHotspur from './../../../../images/tottenham-hotspur-escudo.png'
import trophyChampions from './../../../../images/champions.png'
import trophyCopaAmerica from './../../../../images/copa-america.png'
import trophyCopaArgentina from './../../../../images/copa-argentina.png'
import trophyMundialDeClubes from './../../../../images/mundial-de-clubes.png'
import trophyPremierLeague from './../../../../images/premier-league.png'
import trophyRandomOne from './../../../../images/random-one.png'
import trophySuperligaArgentina from './../../../../images/superliga-argentina.png'
import trophyWorldCup from './../../../../images/world-cup.png'

const Showcase = () => {
  return (
    <StyledShowcase>
      <ChampionshipBox
        tournament={'Torneo Argentino 2016'}
        championUser={'Max'}
        championTeam={'Rosario Central'}
        championLogo={logoRosarioCentral}
        finalistUser={'Leo'}
        finalistTeam={'San Lorenzo'}
        finalistLogo={logoSanLorenzo}
        trophy={trophySuperligaArgentina}
      />
      <ChampionshipBox
        tournament={'Torneo Argentino 2017'}
        championUser={'Max'}
        championTeam={'Estudiantes'}
        championLogo={logoEstudiantes}
        finalistUser={'Max'}
        finalistTeam={'Rosario Central'}
        finalistLogo={logoRosarioCentral}
        trophy={trophySuperligaArgentina}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2017'}
        championUser={'Leo'}
        championTeam={'Portugal'}
        championLogo={banderaPortugal}
        finalistUser={'Santi'}
        finalistTeam={'Francia'}
        finalistLogo={banderaFrancia}
        trophy={trophyWorldCup}
      />
      <ChampionshipBox
        tournament={'Torneo Argentino 2018'}
        championUser={'Leo'}
        championTeam={'San Lorenzo'}
        championLogo={logoSanLorenzo}
        finalistUser={'Santi'}
        finalistTeam={'River Plate'}
        finalistLogo={logoRiverPlate}
        trophy={trophySuperligaArgentina}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2018 (I)'}
        championUser={'Leo'}
        championTeam={'Alemania'}
        championLogo={banderaAlemania}
        finalistUser={'Santi'}
        finalistTeam={'Francia'}
        finalistLogo={banderaFrancia}
        trophy={trophyWorldCup}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2018 (II)'}
        championUser={'Max'}
        championTeam={'Bélgica'}
        championLogo={banderaBelgica}
        finalistUser={'Leo'}
        finalistTeam={'Alemania'}
        finalistLogo={banderaAlemania}
        trophy={trophyWorldCup}
      />
      <ChampionshipBox
        tournament={'Mundial de Clubes 2018'}
        championUser={'Max'}
        championTeam={'Manchester Utd.'}
        championLogo={logoManchesterUnited}
        finalistUser={'Max'}
        finalistTeam={'Atlético Madrid'}
        finalistLogo={logoAtleticoMadrid}
        trophy={trophyMundialDeClubes}
      />
      <ChampionshipBox
        tournament={'Copa Argentina 2018'}
        championUser={'Max'}
        championTeam={'Racing'}
        championLogo={logoRacingClub}
        finalistUser={'Leo'}
        finalistTeam={'San Lorenzo'}
        finalistLogo={logoSanLorenzo}
        trophy={trophyCopaArgentina}
      />
      <ChampionshipBox
        tournament={'Chempions 2019'}
        championUser={'Leo'}
        championTeam={'Real Madrid'}
        championLogo={logoRealMadrid}
        finalistUser={'Max'}
        finalistTeam={'Lokomotiv'}
        finalistLogo={logoLokomotiv}
        trophy={trophyChampions}
        id={'64697ac9d542ff4ada3038d3'}
      />
      <ChampionshipBox
        tournament={'Copa América 2019'}
        championUser={'Santi'}
        championTeam={'Argentina'}
        championLogo={banderaArgentina}
        finalistUser={'Max'}
        finalistTeam={'Perú'}
        finalistLogo={banderaPeru}
        trophy={trophyCopaAmerica}
      />
      <ChampionshipBox
        tournament={'Torneo Argentino 2021/22'}
        championUser={'Leo'}
        championTeam={'River Plate'}
        championLogo={logoRiverPlate}
        finalistUser={'Leo'}
        finalistTeam={'Lanús'}
        finalistLogo={logoLanus}
        trophy={trophySuperligaArgentina}
        id={'625e0f191b3f1ce6b5ee4756'}
      />
      <ChampionshipBox
        tournament={'Superliga Europea 2022'}
        championUser={'Nico'}
        championTeam={'Liverpool'}
        championLogo={logoLiverpool}
        finalistUser={'Nico'}
        finalistTeam={'Bayern'}
        finalistLogo={logoBayern}
        trophy={trophyRandomOne}
        id={'625f32c9cfe012fb71aae3af'}
      />
      <ChampionshipBox
        tournament={'Superliga Inglesa 2022'}
        championUser={'Nico'}
        championTeam={'Tottenham'}
        championLogo={logoTottenhamHotspur}
        finalistUser={'Santi'}
        finalistTeam={'Manchester Utd.'}
        finalistLogo={logoManchesterUnited}
        trophy={trophyPremierLeague}
        id={'6340436678316e185af86762'}
      />
      <ChampionshipBox
        tournament={'Copa del Mundo 2022/23'}
        championUser={'Leo'}
        championTeam={'Polonia'}
        championLogo={banderaPolonia}
        finalistUser={'Max'}
        finalistTeam={'Brazil'}
        finalistLogo={banderaBrazil}
        trophy={trophyWorldCup}
        id={'6372f83c88e2408e9cadcc73'}
      />
    </StyledShowcase>
  )
}

export default Showcase
