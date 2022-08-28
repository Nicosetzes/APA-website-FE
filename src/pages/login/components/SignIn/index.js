import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import KeyIcon from '@mui/icons-material/Key'
import { StyledSignIn } from './styled'

const SignIn = ({ loginData, handleLoginSubmit, handleLoginChange }) => {
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
      <Button
        type="submit"
        sx={{
          mt: 1, // margin top
        }}
      >
        Iniciar sesión
      </Button>
    </StyledSignIn>
  )
}

export default SignIn
