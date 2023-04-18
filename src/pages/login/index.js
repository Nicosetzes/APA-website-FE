import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { useLogin } from '../../context/LoginContext'
import 'react-toastify/dist/ReactToastify.css'
// import { useNavigate } from 'react-router-dom'
import UserProfile from './components/UserProfile'

const Login = () => {
  const login = useLogin()

  const { loginStatus } = login

  console.log(loginStatus)

  const { status, id } = loginStatus

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
