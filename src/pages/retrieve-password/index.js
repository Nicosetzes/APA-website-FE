import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { StyledRetrievePassword } from './styled'
import { api } from './../../api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const RetrievePassword = () => {
  const MySwal = withReactContent(Swal)

  const [searchParams, setSearchParams] = useSearchParams()

  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  const [loginData, setLoginData] = useState({})

  const handleRetrievePasswordChange = (event) => {
    // Tengo que ver cómo cifrar la contraseña mientras el user la escribe (se ve en la consola) //
    const { name, value } = event.target
    setLoginData((values) => ({ ...values, [name]: value }))
  }

  const handleRetrievePasswordSubmit = async (event) => {
    event.preventDefault()
    const { password } = loginData
    if (password.length < 6) {
      alert('La contraseña debe tener más de 6 caracteres')
      return
    }
    await axios
      .post(
        `${api}/users/retrieve-password`,
        { ...loginData, userId, token },
        {
          withCredentials: true,
          credentials: 'include',
        } /* Importante, sirve para incluir la cookie alojada en el navegador */,
      )
      .then(({ data }) => {
        const { message } = data
        MySwal.fire({
          background: `rgba(28, 25, 25, 0.95)`,
          color: `#fff`,
          icon: 'success',
          iconColor: '#18890e',
          toast: true,
          title: `¡Éxito!`,
          text: message,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
      .catch(({ response }) => {
        const { data } = response
        const { message } = data
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
          timer: 2000,
          timerProgressBar: true,
          customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          },
        })
      })
  }

  return (
    <StyledRetrievePassword onSubmit={handleRetrievePasswordSubmit}>
      <Typography component="h2" sx={{ margin: '0.5rem', fontWeight: 'bold' }}>
        Ingrese su nueva contraseña
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
          name="password"
          type="password"
          label="Contraseña"
          margin="dense"
          variant="filled"
          size="small"
          value={loginData.password || ''}
          onChange={handleRetrievePasswordChange}
        />
      </Box>
      <Button
        type="submit"
        sx={{
          mt: 1, // margin top
        }}
      >
        Solicitar
      </Button>
    </StyledRetrievePassword>
  )
}

export default RetrievePassword
