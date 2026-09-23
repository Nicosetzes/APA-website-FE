import { StyledFooter } from './styled'
import { Link } from 'react-router-dom'
import { useAuth } from 'context/AuthContext'
import { useMediaQuery } from 'react-responsive'

const Footer = () => {
  const isSm = useMediaQuery({ query: '(min-width: 576px)' })
  const isXS = useMediaQuery({ query: '(min-width: 500px)' })
  const { isAuthenticated } = useAuth()

  return (
    <StyledFooter isXS={!isXS} isSm={!isSm}>
      <div className="footer__img">
        <img src="/images/sitioapalogo2.png" />
      </div>
      <div className="footer__social">
        <a
          href="https://www.youtube.com/channel/UCBalc6KX3zcNb4i_Bq5ZfEg"
          rel="noreferrer"
          target="_blank"
        >
          <img src="/images/youtube.png" />
        </a>
        <a
          href="https://www.twitch.tv/apa_oficial"
          rel="noreferrer"
          target="_blank"
        >
          <img src="/images/twitch.png" />
        </a>
      </div>
      <div className="footer__menu">
        <div className="menu-item">
          <Link to="/tournaments">TORNEOS</Link>
        </div>
        <div className="menu-item">
          <Link to="/hall-of-fame">SALÓN DE LA FAMA</Link>
        </div>
        <div className="menu-item">
          <Link to="/users/login">
            <span>{isAuthenticated ? 'MI PERFIL' : 'LOGIN'}</span>
          </Link>
        </div>
      </div>
    </StyledFooter>
  )
}

export default Footer
