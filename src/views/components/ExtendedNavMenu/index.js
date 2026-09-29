import { StyledExtendedNavMenu } from './styled'
import { toast } from 'utils/notifications'
import { useAuth } from 'context/AuthContext'
import { NavLink, useNavigate } from 'react-router-dom'

const ExtendedNavMenu = () => {
  const navigate = useNavigate()
  const { endSession, isAuthenticated } = useAuth()

  const handleLogout = () => {
    endSession()
    navigate('/', { replace: true })
    toast.info({ title: 'Sesión cerrada' })
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
