import { useState } from "react";
import Hamburger from "./../Hamburger";
import NavMenu from "./../NavMenu";

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
    <MenuWrapper>
      <Hamburger handleClick={handleClick} isOpen={open} />
      <NavMenu handleClose={handleClose} isOpen={open} anchorEl={anchorEl} />
    </MenuWrapper>
  );
};

export default MenuWrapper;
