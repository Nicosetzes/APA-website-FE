import { useState } from 'react'
// import { useNavigate } from "react-router-dom";
import axios from 'axios'
import SignIn from './components/SignIn'
import SignOut from './components/SignOut'
import SignUp from './components/SignUp'
import { api } from './../../api'
import { useLogin } from '../../context/LoginContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {
  // const api = 'http://localhost:5000/api'

  const login = useLogin()

  const { loginStatus, setLoginStatus } = login

  // console.log(login.loginStatus)

  const [loginData, setLoginData] = useState({})
  const [registerData, setRegisterData] = useState({})

  const handleLoginChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setLoginData((values) => ({ ...values, [name]: value }))
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      await toast.promise(
        axios.post(
          `${api}/login`,
          { ...loginData },
          { withCredentials: true, credentials: 'include' }, // IMPORTANTE
        ),
        {
          success: {
            render({ data }) {
              setLoginStatus(true)
              const { message } = data.data
              return message
            },
            icon: '🟢',
          },
          error: {
            render({ data }) {
              setLoginStatus(false)
              console.log(data)
              const { message } = data.response.data
              return message
            },
          },
        },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const handleRegisterChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setRegisterData((values) => ({ ...values, [name]: value }))
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    try {
      await toast.promise(
        axios.post(
          `${api}/register`,
          { ...registerData },
          { withCredentials: true, credentials: 'include' }, // IMPORTANTE
        ),
        {
          success: {
            render({ data }) {
              const { message } = data.data
              return message
            },
            icon: '🟢',
          },
          error: {
            render({ data }) {
              const { message } = data.response.data
              return message
            },
          },
        },
      )
    } catch (err) {
      console.log(err)
    }
  }

  const logout = async () => {
    if (loginStatus) {
      await toast.promise(
        axios.post(
          `${api}/logout`,
          {},
          { withCredentials: true, credentials: 'include' }, // IMPORTANTE
        ),
        {
          pending: {
            render() {
              return 'Aguarde unos instantes...'
            },
            icon: false,
            position: 'bottom-right',
          },
          success: {
            render({ data }) {
              setLoginStatus(false)
              const { message } = data.data
              return message
            },
            icon: '🟢',
            position: 'bottom-right',
          },
          error: {
            render({ data }) {
              const { message } = data.response.data
              return message
            },
            position: 'bottom-right',
          },
        },
      )
    }
  }

  if (!loginStatus)
    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <SignIn
          loginData={loginData}
          handleLoginSubmit={handleLoginSubmit}
          handleLoginChange={handleLoginChange}
        />
        <SignUp
          registerData={registerData}
          handleRegisterSubmit={handleRegisterSubmit}
          handleRegisterChange={handleRegisterChange}
        />
      </>
    )
  else
    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <SignOut logout={logout} />
      </>
    )
}

export default Login
