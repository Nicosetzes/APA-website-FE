import { StyledExtendedNavMenu } from './styled'
import { NavLink } from 'react-router-dom'
import { useLogin } from './../../context/LoginContext'

const ExtendedNavMenu = () => {
  //   const isL = useMediaQuery({ query: '(min-width: 992px)' })
  //   const isM = useMediaQuery({ query: '(min-width: 768px)' })
  //   const isSm = useMediaQuery({ query: '(min-width: 576px)' })

  const login = useLogin()

  const { loginStatus } = login

  console.log(loginStatus)

  const { status } = loginStatus

  return (
    <StyledExtendedNavMenu>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/users/login">
        {status ? 'Mi perfil' : 'Iniciar sesión'}
      </NavLink>
      <NavLink to="/matches">Partidos</NavLink>
      <NavLink to="/tournaments">Torneos</NavLink>
      <NavLink to="/tournaments/create-tournament">Crear Torneo</NavLink>
      <NavLink to="/statistics">Estadísticas</NavLink>
      <NavLink to="/hall-of-fame">Salón de la fama</NavLink>
    </StyledExtendedNavMenu>
  )
}

export default ExtendedNavMenu
