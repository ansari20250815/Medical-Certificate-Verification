'use client'
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { CLLogoColour } from '../libs/era'

export default function EraAppBar({ onMenuClick, profile, onProfileMenu, profileMenuAnchor, onProfileMenuClose }) {
  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* <IconButton color="primary" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton> */}
        {typeof CLLogoColour === 'string'
          ? <img src={CLLogoColour} alt="Logo" style={{ height: 50, marginRight: 20 }} />
          : <CLLogoColour style={{ height: 50, marginRight: 20 }} />}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1 }}>
          BIPO Certificate Verification
          </Typography>
        </Box>
        {profile && (
          <>
            <IconButton onClick={onProfileMenu}>
              <Avatar>{profile.name?.[0] || 'U'}</Avatar>
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={onProfileMenuClose}
            >
              <MenuItem disabled>{profile.name}</MenuItem>
              <MenuItem onClick={onProfileMenuClose}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}