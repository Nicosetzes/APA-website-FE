import { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuWrapper from './../MenuWrapper'
import { StyledNavbar } from './styled'
import logo from './../../images/logo.webp'
import { api } from './../../api'
import { useLogin } from './../../context/LoginContext'
// import Login from './../Login'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  // const api = 'http://localhost:5000/api'

  const login = useLogin()
  const { loginStatus, setLoginStatus } = login

  useLayoutEffect(() => {
    const isUserAuthenticated = async () => {
      await axios
        .get(`${api}/isUserAuthenticated`, {
          withCredentials: true,
          credentials: 'include',
        })
        .then((response) => {
          const { auth, message } = response.data
          if (auth) {
            setLoginStatus(true)
            toast.success(`${message}`, {
              position: 'bottom-right',
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else {
            setLoginStatus(false)
          }
        })
    }
    isUserAuthenticated()
  }, [])

  return (
    <StyledNavbar>
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      {/* <Login loginStatus={loginStatus} /> */}
      <MenuWrapper />
    </StyledNavbar>
  )
}

export default Navbar
