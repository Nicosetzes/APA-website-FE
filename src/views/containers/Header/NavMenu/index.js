import * as React from "react";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from '@mui/icons-material/BarChart';

const NavMenu = ({ handleClose, isOpen, anchorEl }) => {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuList>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EmojiEventsIcon fontSize="small" />
          </ListItemIcon>
          <Link to="/standings">
            <ListItemText>Clasificación</ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SportsSoccerIcon fontSize="small" />
          </ListItemIcon>
          <Link to="/matches">
            <ListItemText>Partidos</ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          <Link to="/tournaments">
            <ListItemText>Torneos</ListItemText>
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          <Link to="/statistics">
            <ListItemText>Estadística</ListItemText>
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavMenu;
