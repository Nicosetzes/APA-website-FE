import AccountCircle from '@mui/icons-material/AccountCircle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import { StyledSignIn } from './styled'
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { api } from 'api'
import axios from 'axios'
import { useLogin } from 'context/LoginContext'
import { useState } from 'react'
import withReactContent from 'sweetalert2-react-content'
import { useLocation, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const MySwal = withReactContent(Swal)

  const [loginData, setLoginData] = useState({})

  const location = useLocation()

  const navigate = useNavigate()

  const previousUrl = location?.state?.from?.pathname || location?.state?.url

  const login = useLogin()

  const { setLoginStatus } = login

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginData((values) => ({ ...values, [name]: value }))
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    await axios
      .post(`${api}/users/login`, { ...loginData })
      .then(({ data }) => {
        const { auth, token, user, message } = data

        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify(user))

        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: message,
          position: 'top-end',
          showConfirmButton: false,
          text: 'Inicio de sesión exitoso! Será redirigido en breve...',
          timer: 1000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            setLoginStatus({
              status: auth,
              user,
              token,
            })
            navigate({
              pathname: previousUrl || '/',
            })
          },
        })
      })
      .catch(({ response }) => {
        const { data } = response
        const { auth, message } = data
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'error',
          iconColor: '#b30a0a',
          text: message,
          title: '¡Error!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
          didClose: () => {
            setLoginStatus((loginStatus) => ({ ...loginStatus, status: auth }))
          },
        })
      })
  }

  return (
    <StyledSignIn onSubmit={handleLoginSubmit}>
      <Typography component="h2" sx={{ margin: '0.5rem', fontWeight: 'bold' }}>
        Iniciar sesión
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 0.25rem',
        }}
      >
        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          name="email"
          label="Email"
          margin="dense"
          variant="filled"
          size="small"
          value={loginData.email || ''}
          onChange={handleLoginChange}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 0.25rem',
        }}
      >
        <KeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          name="password"
          type="password"
          label="Contraseña"
          margin="dense"
          variant="filled"
          size="small"
          value={loginData.password || ''}
          onChange={handleLoginChange}
        />
      </Box>
      <Button type="submit" sx={{ mt: 1 }}>
        Iniciar sesión
      </Button>
    </StyledSignIn>
  )
}

export default SignIn
