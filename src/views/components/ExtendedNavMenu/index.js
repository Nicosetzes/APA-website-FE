import { StyledExtendedNavMenu } from './styled'
import Swal from 'sweetalert2'
import { useAuth } from 'context/AuthContext'
import withReactContent from 'sweetalert2-react-content'
import { NavLink, useNavigate } from 'react-router-dom'

const ExtendedNavMenu = () => {
  const MySwal = withReactContent(Swal)
  const navigate = useNavigate()
  const { endSession, isAuthenticated } = useAuth()

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
        endSession()
        navigate('/', { replace: true })
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
      {isAuthenticated ? (
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
