import { useState, useEffect } from 'react'
import { useLogin } from '../../context/LoginContext'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import 'react-toastify/dist/ReactToastify.css'
// import { useNavigate } from 'react-router-dom'
import UserProfile from './components/UserProfile'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { api } from './../../api'
import axios from 'axios'

const Login = () => {
  const MySwal = withReactContent(Swal)

  const login = useLogin()

  const { loginStatus, setLoginStatus } = login

  console.log(loginStatus)

  const { status, id } = loginStatus

  const areUserCredentialsActive = () => {
    !status && // Solo chequearé credenciales si status es false, para no chequear innecesariamente REVISAR //
      axios
        .get(`${api}/users/isUserAuthenticated`, {
          withCredentials: true,
          credentials: 'include',
        }) // Es importante, sino la cookie (alojada en el browser) NO se envía con la request //
        .then(({ data }) => {
          const { auth, id, message } = data
          console.log(data)
          MySwal.fire({
            background: `rgba(28, 25, 25, 0.95)`,
            color: `#fff`,
            icon: 'success',
            iconColor: '#18890e',
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
              console.log(id)
              setLoginStatus((loginStatus) => ({
                ...loginStatus,
                status: auth,
                id,
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
            icon: 'info',
            iconColor: '#0a15d1',
            text: message,
            title: '¡Hola!',
            toast: true,
            position: 'top-start',
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
        })
  }

  useEffect(() => {
    areUserCredentialsActive()
  }, [])

  // const navigate = useNavigate()

  return !status ? (
    <>
      <SignIn />
      <SignUp />
    </>
  ) : (
    <UserProfile id={id} />
  )
}

export default Login
