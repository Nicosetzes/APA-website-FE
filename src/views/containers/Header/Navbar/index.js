import { Link } from "react-router-dom";
import MenuWrapper from "./../MenuWrapper";
import { StyledNavbar } from "./styled";
import logo from "./../../../../images/logo.webp";

const Navbar = () => {
  return (
    <StyledNavbar>
      <Link to="/">
        <img className="logo" src={logo} alt="logo" />
      </Link>
      <MenuWrapper />
    </StyledNavbar>
  );
};

export default Navbar;
