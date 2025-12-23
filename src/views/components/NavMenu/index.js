import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { useLogin } from 'context/LoginContext'
import Divider from '@mui/material/Divider'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import HomeIcon from '@mui/icons-material/Home'
import ListItemIcon from '@mui/material/ListItemIcon'
import AccountCircle from '@mui/icons-material/AccountCircle'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CreateIcon from '@mui/icons-material/Create'
import BarChartIcon from '@mui/icons-material/BarChart'
import ExtensionIcon from '@mui/icons-material/Extension'
import { StyledMenu } from './styled'

const NavMenu = ({ handleClose, isOpen, anchorEl }) => {
  const login = useLogin()

  const { loginStatus } = login

  console.log(loginStatus)

  const { status } = loginStatus

  return (
    <StyledMenu
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
            <HomeIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/">
            <div>INICIO</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ExtensionIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/edits">
            <div>EDITS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CalendarMonthIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments">
            <div>VER TORNEOS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CreateIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/tournaments/create-tournament">
            <div>CREAR TORNEO</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SportsSoccerIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/matches">
            <div>ARCHIVO DE PARTIDOS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <BarChartIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/statistics">
            <div>STATS</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EmojiEventsIcon htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="/hall-of-fame">
            <div>SALÓN DE LA FAMA</div>
          </NavLink>
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--blue-900)' }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle htmlColor="var(--blue-900)" fontSize="small" />
          </ListItemIcon>
          <NavLink to="users/login">
            <div>{status ? 'MI PERFIL' : 'LOGIN'}</div>
          </NavLink>
        </MenuItem>
      </MenuList>
    </StyledMenu>
  )
}

export default NavMenu
