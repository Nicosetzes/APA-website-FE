import { StyledSignOut } from './styled'
import Swal from 'sweetalert2'
import { removeAuthToken } from 'utils/auth'
import { useLogin } from 'context/LoginContext'
import withReactContent from 'sweetalert2-react-content'

const SignOut = () => {
  const MySwal = withReactContent(Swal)
  const { loginStatus, setLoginStatus } = useLogin()

  const { status } = loginStatus

  const handleLogoutSubmit = () => {
    if (status) {
      MySwal.fire({
        background: `rgba(28, 25, 25, 0.95)`,
        color: `#fff`,
        icon: 'info',
        iconColor: '#0a15d1',
        toast: true,
        title: 'Cerrando sesión...',
        position: 'top-end',
        showConfirmButton: false,
        text: 'Será redirigido en breve...',
        timer: 1000,
        timerProgressBar: true,
        customClass: { timerProgressBar: 'toast-progress-dark' },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
        didClose: () => {
          removeAuthToken()
          setLoginStatus({})
          window.location.href = '/'
        },
      })
    }
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
