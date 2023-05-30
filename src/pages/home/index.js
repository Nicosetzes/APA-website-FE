import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import presentationDesktop from './../../../src/images/desktop.jpg'
import presentationMobile from './../../../src/images/mobile.jpg'
import championBackground from './../../../src/images/desktop-2.jpg'
import logo from './../../../src/images/sitioapalogo2.png'
import team from './../../../src/images/polonia-bandera.png'
import trophy from './../../../src/images/world-cup.png'
import nico from './../../../src/images/nico.png'
import max from './../../../src/images/max.png'
import santi from './../../../src/images/santi.png'
import lucho from './../../../src/images/lucho.png'
import leo from './../../../src/images/leo.png'
import banderaAlemania from './../../images/alemania-bandera.png'
import banderaArgentina from './../../images/argentina-bandera.png'
import banderaBelgica from './../../images/belgica-bandera.png'
import banderaPortugal from './../../images/portugal-bandera.png'
import banderaPolonia from './../../images/polonia-bandera.png'
import logoEstudiantes from './../../images/estudiantes-escudo.png'
import logoLiverpool from './../../images/liverpool-escudo.png'
import logoManchesterUnited from './../../images/manchester-united-escudo.png'
import logoRacingClub from './../../images/racing-club-escudo.png'
import logoRealMadrid from './../../images/real-madrid-escudo.png'
import logoRiverPlate from './../../images/river-plate-escudo.png'
import logoRosarioCentral from './../../images/rosario-central-escudo.png'
import logoSanLorenzo from './../../images/san-lorenzo-escudo.png'
import logoTottenhamHotspur from './../../images/tottenham-hotspur-escudo.png'
import trophyChampions from './../../images/champions.png'
import trophyCopaAmerica from './../../images/copa-america.png'
import trophyCopaArgentina from './../../images/copa-argentina.png'
import trophyMundialDeClubes from './../../images/mundial-de-clubes.png'
import trophyPremierLeague from './../../images/premier-league.png'
import trophySuperligaArgentina from './../../images/superliga-argentina.png'
import trophySuperligaEuropea from './../../images/superliga-europea.png'
import trophySuperligaItaloEspañola from './../../../src/images/tournaments/9.png'
import trophyWorldCup from './../../images/world-cup.png'

const Home = () => {
  // const isXL = useMediaQuery({ query: '(min-width: 1200px)' })
  // const isL = useMediaQuery({ query: '(min-width: 992px)' })
  const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 500px)' })
  const isXS = useMediaQuery({ query: '(min-width: 350px)' })

  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledHome
        presentationBackground={isSm ? presentationDesktop : presentationMobile}
        championBackground={championBackground}
        isXS={isXS && !isSm}
        isM={isM}
        // isXL={isXL}
      >
        <div className="container__presentation">
          <img className="logo" src={logo} />
          <div className="container__coaches">
            <img src={nico} />
            <img src={max} />
            <img src={santi} />
            <img src={lucho} />
            <img src={leo} />
          </div>
        </div>
        <div className="container__accolades">
          <div className="box__tournaments">
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2016</div>
                <div className="result-image">
                  <img src={trophySuperligaArgentina} />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoRosarioCentral} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2017</div>
                <div className="result-image">
                  <img src={trophySuperligaArgentina} />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoEstudiantes} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2017</div>
                <div className="result-image">
                  <img src={trophyWorldCup} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={banderaPortugal} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2018</div>
                <div className="result-image">
                  <img src={trophySuperligaArgentina} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoSanLorenzo} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2018 (I)</div>
                <div className="result-image">
                  <img src={trophyWorldCup} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={banderaAlemania} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2018 (II)</div>
                <div className="result-image">
                  <img src={trophyWorldCup} />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={banderaBelgica} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">MUNDIAL DE CLUBES</div>
                <div className="result-year">2018</div>
                <div className="result-image">
                  <img src={trophyMundialDeClubes} />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoManchesterUnited} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA ARGENTINA</div>
                <div className="result-year">2018</div>
                <div className="result-image">
                  <img src={trophyCopaArgentina} />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoRacingClub} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">
                  <i>CHEMPIONS LEAGUE</i>
                </div>
                <div className="result-year">2019</div>
                <div className="result-image">
                  <img src={trophyChampions} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoRealMadrid} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">COPA AMÉRICA</div>
                <div className="result-year">2019</div>
                <div className="result-image">
                  <img src={trophyCopaAmerica} />
                </div>
                <div className="result-player">
                  <div className="player-name">Santi</div>
                  <img src={banderaArgentina} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2021/22</div>
                <div className="result-image">
                  <img src={trophySuperligaArgentina} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoRiverPlate} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">SUPERLIGA EUROPEA</div>
                <div className="result-year">2022</div>
                <div className="result-image">
                  <img src={trophySuperligaEuropea} />
                </div>
                <div className="result-player">
                  <div className="player-name">Nico</div>
                  <img src={logoLiverpool} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">SUPERLIGA INGLESA</div>
                <div className="result-year">2022</div>
                <div className="result-image">
                  <img src={trophyPremierLeague} />
                </div>
                <div className="result-player">
                  <div className="player-name">Nico</div>
                  <img src={logoTottenhamHotspur} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2022</div>
                <div className="result-image">
                  <img src={trophyWorldCup} />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={banderaPolonia} />
                </div>
              </div>
            </div>
          </div>
          <div className="box__champion">
            <div className="champion-title">CAMPEÓN VIGENTE</div>
            <div className="champion-player">Leo</div>
            <div className="champion-img">
              <img src={trophy} />
            </div>
            <div className="champion-team">
              <span>POLONIA</span>
              <img src={team} />
            </div>
            <button onClick={() => navigate('./hall-of-fame')}>
              SALÓN DE LA FAMA
            </button>
          </div>
        </div>

        <div className="container__tournament">
          <div
            style={{
              color: '#004a79',
              display: 'flex',
              fontSize: '1rem',
              fontWeight: 700,
              margin: '0.5rem auto',
            }}
          >
            TORNEOS ACTIVOS
          </div>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() => navigate('./tournaments/6377fb8eb217aa7d3bf61eef')}
            >
              <div className="tournament-name">
                SUPERLIGA ÍTALO-ESPAÑOLA 2022
              </div>
              <div className="tournament-img">
                <img src={trophySuperligaItaloEspañola} />
              </div>
            </div>
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() => navigate('./tournaments/646ff40e2524b3187034f790')}
            >
              <div className="tournament-name">SUPERLIGA ARGENTINA 2023</div>
              <div className="tournament-img">
                <img src={trophySuperligaArgentina} />
              </div>
            </div>
          </div>

          <button onClick={() => navigate('./tournaments')}>VER TORNEOS</button>
        </div>
      </StyledHome>
    </motion.div>
  )
}

export default Home
