import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StyledHome } from './styled'
import { cloudName } from './../../api'
import { Image } from 'cloudinary-react'
import MemeCarousel from '../../components/MemeCarousel'
import presentationDesktop from './../../../src/images/desktop.jpg'
import presentationMobile from './../../../src/images/mobile.jpg'
import championBackground from './../../../src/images/desktop-2.jpg'
import logo from './../../../src/images/sitioapalogo2.png'
import nico from './../../../src/images/nico.png'
import max from './../../../src/images/max.png'
import santi from './../../../src/images/santi.png'
import lucho from './../../../src/images/lucho.png'
import leo from './../../../src/images/leo.png'

const chempions_cloudinary_id = 'tournaments/5_qyvcdb'
const superliga_inglesa_cloudinary_id = 'tournaments/chemvkybmg1wmvjanwby'
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
        <div className="container__memes">
          <MemeCarousel />
        </div>
        <div className="container__accolades">
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
              {/* <img src={logoSanLorenzo} /> */}
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
              flexWrap: 'wrap',
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
