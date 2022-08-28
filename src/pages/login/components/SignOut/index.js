import { ToastContainer, Slide } from 'react-toastify'

const SignOut = ({ logout }) => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
        transition={Slide}
      />
      <button onClick={() => logout()}>Cerrar sesión</button>
    </>
  )
}

export default SignOut
