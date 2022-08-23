import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ToastContainer } from "react-toastify";
import { StyledLogin } from "./styled";

const SignIn = ({ loginData, handleSubmit, handleChange }) => {
  return (
    <StyledLogin onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", margin: "0 0.25rem" }}>
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          name="email"
          label="Email"
          margin="dense"
          variant="filled"
          size="small"
          value={loginData.email || ""}
          onChange={handleChange}
        />
      </Box>
      <TextField
        name="password"
        type="password"
        label="Contraseña"
        margin="dense"
        variant="filled"
        size="small"
        value={loginData.password || ""}
        onChange={handleChange}
      />
      <Button
        type="submit"
        sx={{
          mt: 1, // margin top
        }}
      >
        Log in
      </Button>
    </StyledLogin>
  );
};

export default SignIn;
