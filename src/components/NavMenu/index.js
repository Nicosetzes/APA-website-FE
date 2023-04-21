import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { useLogin } from './../../context/LoginContext'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import HomeIcon from '@mui/icons-material/Home'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import AccountCircle from '@mui/icons-material/AccountCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import DataObjectIcon from '@mui/icons-material/DataObject'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CreateIcon from '@mui/icons-material/Create'
import BarChartIcon from '@mui/icons-material/BarChart'

const NavMenu = ({ handleClose, isOpen, anchorEl }) => {
  const login = useLogin()

  const { loginStatus } = login

  console.log(loginStatus)

  const { status } = loginStatus

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuList>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/">
            <ListItemText>Home</ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <NavLink to="users/login">
            <ListItemText>
              {status ? 'Mi perfil' : 'Iniciar sesión'}
            </ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SportsSoccerIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/matches">
            <ListItemText>Partidos</ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CalendarMonthIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments">
            <ListItemText>Torneos</ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CreateIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments/create-tournament">
            <ListItemText>Crear torneo</ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <BarChartIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/statistics">
            <ListItemText>Estadística</ListItemText>
          </NavLink>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EmojiEventsIcon fontSize="small" />
          </ListItemIcon>
          <NavLink to="/hall-of-fame">
            <ListItemText>Salón de la fama</ListItemText>
          </NavLink>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NavMenu
