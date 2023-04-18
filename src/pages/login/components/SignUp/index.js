import { useState } from 'react'
// import { api } from './../../../../api'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import KeyIcon from '@mui/icons-material/Key'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import { StyledSignUp } from './styled'
// import axios from 'axios'

const SignUp = () => {
  const [registerData, setRegisterData] = useState({})

  const handleRegisterChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setRegisterData((values) => ({ ...values, [name]: value }))
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()

    // await axios.post(
    //   `${api}/register`,
    //   { ...registerData },
    //   { withCredentials: true, credentials: 'include' }, // IMPORTANTE
    // )
  }

  return (
    <StyledSignUp onSubmit={handleRegisterSubmit}>
      <Typography component="h2" sx={{ margin: '0.5rem', fontWeight: 'bold' }}>
        Registrarse
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
          value={registerData.email || ''}
          onChange={handleRegisterChange}
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
          value={registerData.password || ''}
          onChange={handleRegisterChange}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 0.25rem',
        }}
      >
        <EmojiPeopleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          name="nickname"
          label="Nombre del jugador"
          margin="dense"
          variant="filled"
          size="small"
          value={registerData.nickname || ''}
          onChange={handleRegisterChange}
        />
      </Box>
      <Button
        type="submit"
        sx={{
          mt: 1, // margin top
        }}
      >
        Crear cuenta
      </Button>
    </StyledSignUp>
  )
}

export default SignUp
