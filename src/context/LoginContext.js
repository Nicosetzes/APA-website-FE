import { createContext, useState, useContext } from 'react'

const LoginContext = createContext()

export const useLogin = () => useContext(LoginContext)

export const LoginProvider = ({ children }) => {
  const initializeAuth = () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')

    if (token && user) {
      return {
        status: true,
        token,
        user: JSON.parse(user),
      }
    }
    return {}
  }

  const [loginStatus, setLoginStatus] = useState(initializeAuth)

  return (
    <LoginContext.Provider
      value={{
        loginStatus,
        setLoginStatus,
      }}
    >
      {children}
    </LoginContext.Provider>
  )
}
