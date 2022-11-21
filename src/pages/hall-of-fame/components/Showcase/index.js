import { StyledShowcase } from './styled'
import ChampionshipBox from '../ChampionshipBox'
import banderaAlemania from './../../../../images/alemania-bandera.webp'
import banderaArgentina from './../../../../images/argentina-bandera.webp'
import banderaBelgica from './../../../../images/belgica-bandera.webp'
import banderaFrancia from './../../../../images/francia-bandera.webp'
import banderaPeru from './../../../../images/peru-bandera.webp'
import banderaPortugal from './../../../../images/portugal-bandera.webp'
import logoAtleticoMadrid from './../../../../images/atletico-madrid-escudo.webp'
import logoBayern from './../../../../images/bayern-escudo.webp'
import logoEstudiantes from './../../../../images/estudiantes-escudo.webp'
import logoLanus from './../../../../images/lanus-escudo.webp'
import logoLiverpool from './../../../../images/liverpool-escudo.webp'
import logoLokomotiv from './../../../../images/lokomotiv-escudo.webp'
import logoManchesterUnited from './../../../../images/manchester-united-escudo.webp'
import logoRacingClub from './../../../../images/racing-club-escudo.webp'
import logoRealMadrid from './../../../../images/real-madrid-escudo.webp'
import logoRiverPlate from './../../../../images/river-plate-escudo.webp'
import logoRosarioCentral from './../../../../images/rosario-central-escudo.webp'
import logoSanLorenzo from './../../../../images/san-lorenzo-escudo.webp'
import logoTottenhamHotspur from './../../../../images/tottenham-hotspur-escudo.webp'
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
        national={true}
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
        national={true}
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
        national={true}
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
      />
      <ChampionshipBox
        tournament={'Copa América 2019'}
        championUser={'Santi'}
        championTeam={'Argentina'}
        championLogo={banderaArgentina}
        finalistUser={'Max'}
        finalistTeam={'Perú'}
        finalistLogo={banderaPeru}
        national={true}
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
      />
    </StyledShowcase>
  )
}

export default Showcase
