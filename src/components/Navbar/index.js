import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'
import MenuWrapper from './../MenuWrapper'
import ExtendedNavMenu from './../ExtendedNavMenu'
import { StyledNavbar } from './styled'
import logo from './../../images/logo.webp'

const Navbar = () => {
  // const api = 'http://localhost:5000/api'

  const isL = useMediaQuery({ query: '(min-width: 992px)' })
  // const isM = useMediaQuery({ query: '(min-width: 768px)' })
  // const isSm = useMediaQuery({ query: '(min-width: 576px)' })

  return (
    <StyledNavbar>
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      {/* <Login loginStatus={loginStatus} /> */}
      {!isL ? <MenuWrapper /> : <ExtendedNavMenu />}
    </StyledNavbar>
  )
}

export default Navbar
