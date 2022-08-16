import { ToastContainer } from "react-toastify";

const SignOut = ({ logout }) => {
  return (
    <>
      <ToastContainer />
      <button onClick={() => logout()}>Cerrar sesión</button>
    </>
  );
};

export default SignOut;
