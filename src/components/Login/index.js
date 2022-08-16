import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import { toast } from "react-toastify";
import { useLogin } from "../../context/LoginContext";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const api = "http://localhost:5000/api";

  const login = useLogin();

  const { loginStatus, setLoginStatus } = login;

  console.log(login.loginStatus);

  const [loginData, setLoginData] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setLoginData((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await toast.promise(
      axios.post(
        `${api}/login`,
        { ...loginData },
        { withCredentials: true, credentials: "include" } // IMPORTANTE
      ),
      {
        pending: {
          render() {
            return "Aguarde unos instantes...";
          },
          icon: false,
          position: "bottom-right",
        },
        success: {
          render({ data }) {
            setLoginStatus(true);
            const { nickname } = data.data.result;
            return `Bienvenid@ ${nickname}`;
          },
          icon: "🟢",
          position: "bottom-right",
        },
        error: {
          render({ data }) {
            setLoginStatus(false);
            const { message } = data.response.data;
            return `Error: ${message}`; // MODIFICAR;
          },
        },
      }
    );
  };

  const logout = async () => {
    if (loginStatus) {
      await toast.promise(
        axios.post(
          `${api}/logout`,
          {},
          { withCredentials: true, credentials: "include" } // IMPORTANTE
        ),
        {
          pending: {
            render() {
              return "Aguarde unos instantes...";
            },
            icon: false,
            position: "bottom-right",
          },
          success: {
            render({ data }) {
              setLoginStatus(false);
              console.log(data);
              const { nickname } = data.data.user;
              return `${nickname}, su sesión ha sido cerrada con éxito`;
            },
            icon: "🟢",
            position: "bottom-right",
          },
          error: {
            render({ data }) {
              const { message } = data.response.data;
              return `Error: ${message}`; // MODIFICAR;
            },
          },
        }
      );
    }
  };

  if (!loginStatus)
    return (
      <SignIn
        loginData={loginData}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    );
  else return <SignOut logout={logout} />;
};

export default Login;
