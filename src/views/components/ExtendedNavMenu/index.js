import { NavLink } from 'react-router-dom'
import { StyledExtendedNavMenu } from './styled'
import Swal from 'sweetalert2'
import { removeAuthToken } from 'utils/auth'
import { useLogin } from 'context/LoginContext'
import withReactContent from 'sweetalert2-react-content'

const ExtendedNavMenu = () => {
  const MySwal = withReactContent(Swal)
  const { loginStatus, setLoginStatus } = useLogin()

  const { status } = loginStatus

  const handleLogout = () => {
    MySwal.fire({
      background: `rgba(28, 25, 25, 0.95)`,
      color: `#fff`,
      icon: 'info',
      iconColor: '#0a15d1',
      toast: true,
      title: 'Cerrando sesión...',
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: { timerProgressBar: 'toast-progress-dark' },
      didClose: () => {
        removeAuthToken()
        setLoginStatus({})
        window.location.href = '/'
      },
    })
  }

  return (
    <StyledExtendedNavMenu>
      <NavLink to="/" className="nav-link">
        INICIO
      </NavLink>
      <NavLink to="/edits" className="nav-link">
        EDITS
      </NavLink>
      <NavLink to="/tournaments" className="nav-link">
        TORNEOS
      </NavLink>
      <NavLink to="/tournaments/create-tournament" className="nav-link">
        CREAR TORNEO
      </NavLink>
      <NavLink to="/matches" className="nav-link">
        PARTIDOS
      </NavLink>
      <NavLink to="/statistics" className="nav-link">
        STATS
      </NavLink>
      <NavLink to="/hall-of-fame" className="nav-link">
        SALÓN DE LA FAMA
      </NavLink>
      {status ? (
        <button onClick={handleLogout} className="nav-link logout-button">
          CERRAR SESIÓN
        </button>
      ) : (
        <NavLink to="/users/login" className="nav-link login">
          LOGIN
        </NavLink>
      )}
    </StyledExtendedNavMenu>
  )
}

export default ExtendedNavMenu
