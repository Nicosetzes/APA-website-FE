import { StyledFooter } from './styled'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import logo from './../../../src/images/sitioapalogo2.png'
import youtube from './../../../src/images/youtube.png'
import twitch from './../../../src/images/twitch.png'
import { useLogin } from './../../context/LoginContext'

const Footer = () => {
  //   const isXL = useMediaQuery({ query: '(min-width: 1350px)' })
  //   const isL = useMediaQuery({ query: '(min-width: 992px)' })
  //   const isM = useMediaQuery({ query: '(min-width: 768px)' })
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  const isXS = useMediaQuery({ query: '(min-width: 500px)' })

  const login = useLogin()
  const { loginStatus } = login
  const { status } = loginStatus

  return (
    <StyledFooter isXS={!isXS} isSm={!isSm}>
      <div className="footer__img">
        <img src={logo} />
      </div>
      <div className="footer__social">
        {/* <YouTubeIcon sx={{ color: 'red', fontSize: '3rem' }} /> */}
        <a
          href={'https://www.youtube.com/channel/UCBalc6KX3zcNb4i_Bq5ZfEg'}
          rel="noreferrer"
          target="_blank"
        >
          <img src={youtube} />
        </a>
        <a
          href={'https://www.twitch.tv/apa_oficial'}
          rel="noreferrer"
          target="_blank"
        >
          <img src={twitch} />
        </a>
      </div>
      <div className="footer__menu">
        <div className="menu-item">
          <Link to={'tournaments'}>TORNEOS</Link>
        </div>
        <div className="menu-item">
          <Link to={'hall-of-fame'}>SALÓN DE LA FAMA</Link>
        </div>
        <div className="menu-item">
          <Link to={'users/login'}>
            <span>{status ? 'MI PERFIL' : 'INICIAR SESIÓN'}</span>
          </Link>
        </div>
      </div>
    </StyledFooter>
  )
}

export default Footer
