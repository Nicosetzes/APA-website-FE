import { useLogin } from '../../../../context/LoginContext'
import { api } from './../../../../api'
import { StyledSignOut } from './styled'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const SignOut = () => {
  const MySwal = withReactContent(Swal)
  const login = useLogin()

  const { loginStatus, setLoginStatus } = login

  console.log(loginStatus)

  const { status } = loginStatus

  const handleLogoutSubmit = async () => {
    status &&
      (await axios
        .get(
          `${api}/users/logout`,
          {
            withCredentials: true,
            credentials: 'include',
          } /* Importante, sirve para incluir la cookie alojada en el navegador */,
        )
        .then(({ data }) => {
          const { auth, message } = data
          console.log(data)

          MySwal.fire({
            background: `rgba(28, 25, 25, 0.95)`,
            color: `#fff`,
            icon: 'info',
            iconColor: '#0a15d1',
            toast: true,
            title: message,
            position: 'top-end',
            showConfirmButton: false,
            text: 'Será redirigido en breve...',
            timer: 1500,
            timerProgressBar: true,
            customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
              setLoginStatus((loginStatus) => ({
                ...loginStatus,
                status: auth,
                id: '',
              }))
              // navigate({
              //   pathname: `/`,
              // })
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
            customClass: { timerProgressBar: 'toast-progress-dark' }, // Definido en index.css //
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
              setLoginStatus((loginStatus) => ({
                ...loginStatus,
                status: auth,
              }))
              // navigate({
              //   pathname: `/tournaments/${data._id}`,
              // })
            },
          })
        }))
  }

  return (
    <>
      <StyledSignOut onClick={() => handleLogoutSubmit()}>
        Cerrar sesión
      </StyledSignOut>
    </>
  )
}

export default SignOut
