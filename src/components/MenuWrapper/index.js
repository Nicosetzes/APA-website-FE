import { useState } from "react";
import Hamburger from "./../Hamburger";
import NavMenu from "./../NavMenu";
import { StyledMenuWrapper } from "./styled";

const MenuWrapper = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledMenuWrapper>
      <Hamburger handleClick={handleClick} isOpen={open} />
      <NavMenu handleClose={handleClose} isOpen={open} anchorEl={anchorEl} />
    </StyledMenuWrapper>
  );
};

export default MenuWrapper;
