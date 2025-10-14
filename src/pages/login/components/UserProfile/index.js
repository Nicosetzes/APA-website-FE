import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLogin } from '../../../../context/LoginContext'
import { StyledUserProfile } from './styled'
import SignOut from './../SignOut'
import { api } from '../../../../api'
import axios from 'axios'
import PlayerInformationModal from '../../../../components/PlayerInformationModal'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import PageLoader from '../../../../components/PageLoader'

const UserProfile = ({ id }) => {
  const MySwal = withReactContent(Swal)

  const navigate = useNavigate()

  const location = useLocation()

  const login = useLogin()
  const { setLoginStatus } = login

  const [userData, setUserData] = useState()

  const getUserData = () => {
    axios
      .get(`${api}/users/profile?id=${id}`, {
        withCredentials: true,
        credentials: 'include',
      }) // Es importante, sino la cookie (alojada en el browser) NO se envía con la request //)
      .then(({ data }) => setUserData(data))
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
          timer: 2000,
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
            auth === false &&
              navigate(
                {
                  pathname: `/users/login`,
                },
                {
                  state: { url: location.pathname },
                } /* Adjunto info de la ruta actual, para luego volver a ella en caso de login exitoso */,
              )
          },
        })
      })
  }

  useEffect(() => {
    getUserData()
  }, [])

  const displayPlayerInformationModal = (name, stats) => {
    MySwal.fire({
      background: 'rgba(0,74,121,0.8)',
      html: <PlayerInformationModal name={name} stats={stats} />,
      width: 600,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }

  if (userData) {
    const { user, stats } = userData

    return (
      <>
        <StyledUserProfile>
          <button
            className="button-display-statistics"
            onClick={() => displayPlayerInformationModal(user.nickname, stats)}
          >
            Ver estadísticas
          </button>
          <SignOut />
        </StyledUserProfile>
      </>
    )
  } else {
    return <PageLoader />
  }
}

export default UserProfile
