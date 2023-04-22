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
import tournament from './../../../src/images/tournaments/9.png'
import nico from './../../../src/images/nico.png'
import max from './../../../src/images/max.png'
import santi from './../../../src/images/santi.png'
import lucho from './../../../src/images/lucho.png'
import leo from './../../../src/images/leo.png'

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
        <div className="container__champion">
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
        <div className="container__tournament">
          <div className="tournament-title">TORNEO ACTIVO</div>
          <div className="tournament-img">
            <img src={tournament} />
          </div>
          <div className="tournament-name">SUPERLIGA ÍTALO-ESPAÑOLA</div>
          <button onClick={() => navigate('./tournaments')}>VER TORNEOS</button>
        </div>
      </StyledHome>
    </motion.div>
  )
}

export default Home
