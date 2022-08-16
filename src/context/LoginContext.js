import { createContext, useState, useContext } from "react";

const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState();

  // const isLoggedIn = () => {
  //   !loginStatus ? setLoginStatus(true) : setLoginStatus(false);
  // };

  return (
    <LoginContext.Provider
      value={{
        loginStatus,
        setLoginStatus,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
