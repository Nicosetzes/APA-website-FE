import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import { cloudName } from './../../api'
import { Image } from 'cloudinary-react'
import presentationDesktop from './../../../src/images/desktop.jpg'
import presentationMobile from './../../../src/images/mobile.jpg'
import championBackground from './../../../src/images/desktop-2.jpg'
import logo from './../../../src/images/sitioapalogo2.png'
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
import logoAtleticoMadrid from './../../images/atletico-madrid-escudo.png'

const torneo_argentino_cloudinary_id = 'tournaments/rqi862k543ltlmdbgjjm'
const chempions_cloudinary_id = 'tournaments/5_qyvcdb'
const world_cup_cloudinary_id = 'tournaments/qvkjpzyorvsglzft0ehq'
const superliga_italo_española_cloudinary_id =
  'tournaments/h26y9hwsqbroiqjdgmyn'
const superliga_inglesa_cloudinary_id = 'tournaments/chemvkybmg1wmvjanwby'
const copa_america_cloudinary_id = 'tournaments/copa-america_yo28ma'
const mundial_de_clubes_cloudinary_id = 'tournaments/mundial-de-clubes_zc7sdt'
const superliga_europea_cloudinary_id = 'tournaments/mbdi22w2xyirjwnrbyiu'
const copa_argentina_cloudinary_id = 'tournaments/copa-argentina_uf76a1'
const superliga_internacional_cloudinary_id = 'tournaments/_xqnhmh'
const superliga_argentina_cloudinary_id = 'tournaments/_wz61rs'

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
                  <Image
                    cloudName={cloudName}
                    publicId={torneo_argentino_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={torneo_argentino_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoEstudiantes} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2017</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={world_cup_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={banderaPortugal} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2018</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={torneo_argentino_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoSanLorenzo} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">COPA DEL MUNDO</div>
                <div className="result-year">2018 (I)</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={world_cup_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={world_cup_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={mundial_de_clubes_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={copa_argentina_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoRacingClub} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">
                  <i>CHEMPIONS LEAGUE</i>
                </div>
                <div className="result-year">2019</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={chempions_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoRealMadrid} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">COPA AMÉRICA</div>
                <div className="result-year">2019</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={copa_america_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Santi</div>
                  <img src={banderaArgentina} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">TORNEO ARGENTINO</div>
                <div className="result-year">2021/22</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={torneo_argentino_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={superliga_europea_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={superliga_inglesa_cloudinary_id}
                  />
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
                  <Image
                    cloudName={cloudName}
                    publicId={world_cup_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={banderaPolonia} />
                </div>
              </div>
            </div>
            <div className="row__tournaments">
              <div className="tournaments-result">
                <div className="result-title">SUPERLIGA ÍTALO-ESPAÑOLA</div>
                <div className="result-year">2022/23</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={superliga_italo_española_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Leo</div>
                  <img src={logoAtleticoMadrid} />
                </div>
              </div>
              <div className="tournaments-result">
                <div className="result-title">SUPERLIGA ARGENTINA</div>
                <div className="result-year">2023</div>
                <div className="result-image">
                  <Image
                    cloudName={cloudName}
                    publicId={superliga_argentina_cloudinary_id}
                  />
                </div>
                <div className="result-player">
                  <div className="player-name">Max</div>
                  <img src={logoSanLorenzo} />
                </div>
              </div>
            </div>
          </div>
          <div className="box__champion">
            <div className="champion-title">CAMPEÓN VIGENTE</div>
            <div className="champion-player">Max</div>
            <div className="champion-img">
              <Image
                cloudName={cloudName}
                publicId={superliga_argentina_cloudinary_id}
              />
            </div>
            <div className="champion-team">
              <span>SAN LORENZO</span>
              <img src={logoSanLorenzo} />
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
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '0.5rem auto 1rem auto',
            }}
          >
            TORNEOS ACTIVOS
          </div>
          <div
            style={{
              alignItems: 'end',
              display: 'flex',
              justifyContent: 'center',
              margin: '0.5rem 0',
            }}
          >
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '50%',
              }}
              onClick={() => navigate('./tournaments/6532e14f72b09831c4a5edf6')}
            >
              <div className="tournament-name">
                SUPERLIGA INTERNACIONAL 2023/24
              </div>
              <div className="tournament-img">
                <Image
                  cloudName={cloudName}
                  publicId={superliga_internacional_cloudinary_id}
                />
              </div>
            </div>
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '50%',
              }}
              onClick={() => navigate('./tournaments/659dcf45dd45bf53f0748a0d')}
            >
              <div className="tournament-name">SUPERLIGA INGLESA 2024</div>
              <div className="tournament-img">
                <Image
                  cloudName={cloudName}
                  publicId={superliga_inglesa_cloudinary_id}
                />
              </div>
            </div>
            <div
              style={{
                alignItems: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                flexBasis: '50%',
              }}
              onClick={() => navigate('./tournaments/664d43458f37f00eba8ea380')}
            >
              <div className="tournament-name">CHEMPIONS 2024</div>
              <div className="tournament-img">
                <Image
                  cloudName={cloudName}
                  publicId={chempions_cloudinary_id}
                />
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
