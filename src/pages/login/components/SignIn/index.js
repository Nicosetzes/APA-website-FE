import AccountCircle from '@mui/icons-material/AccountCircle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import KeyIcon from '@mui/icons-material/Key'
import { StyledSignIn } from './styled'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { apiClient } from 'api/axiosConfig'
import { toast } from 'utils/notifications'
import { useAuth } from 'context/AuthContext'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SignIn = () => {
  const [loginData, setLoginData] = useState({})
  const location = useLocation()
  const navigate = useNavigate()
  const { startSession } = useAuth()
  const from = location.state?.from
  const previousUrl = from
    ? `${from.pathname || ''}${from.search || ''}${from.hash || ''}`
    : '/'

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginData((values) => ({ ...values, [name]: value }))
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()

    try {
      const { data } = await apiClient.post('/users/login', { ...loginData })
      const { token, user, message } = data

      startSession({ token, user, validation: 'server' })
      navigate(previousUrl || '/', { replace: true })
      toast.success({ title: message || 'Inicio de sesión exitoso' })
    } catch (error) {
      toast.apiError(error)
    }
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
