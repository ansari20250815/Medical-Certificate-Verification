'use client'
import { useState } from 'react'
import { Box, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { menuItems } from './MenuItems'
import { CLLogoColour } from '../libs/era'
import Link from 'next/link'
import Footer from './Footer'

export default function NavbarLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [openMenuIdx, setOpenMenuIdx] = useState(null)

  // Sidebar content
  const drawer = (
    <Box sx={{ width: 220, height: '100%', bgcolor: '#fff' }}>
      <List>
        {menuItems.map((item, idx) =>
          item.href ? (
            <ListItem key={item.href} disablePadding>
              <Link href={item.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton onClick={() => setSidebarOpen(false)}>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ) : item.children ? (
            <Box key={item.label || idx}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={e => {
                    setOpenMenuIdx(openMenuIdx === idx ? null : idx)
                  }}
                >
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
              {/* Collapsible children */}
              {openMenuIdx === idx && item.children.map(child =>
                child.href ? (
                  <ListItem key={child.href} disablePadding sx={{ pl: 4 }}>
                    <Link href={child.href} style={{ width: '100%', textDecoration: 'none', color: 'inherit' }}>
                      <ListItemButton onClick={() => setSidebarOpen(false)}>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ) : null
              )}
            </Box>
          ) : null
        )}
      </List>
    </Box>
  )

  // Navbar menu for grouped items
  const handleMenuOpen = (event, idx) => {
    setMenuAnchor(event.currentTarget)
    setOpenMenuIdx(idx)
  }
  const handleMenuClose = () => {
    setMenuAnchor(null)
    setOpenMenuIdx(null)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      {/* AppBar */}
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar>
          {/* <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton> */}
          {typeof CLLogoColour === 'string'
            ? <img src={CLLogoColour} alt="Logo" style={{ height: 40, marginRight: 16 }} />
            : <CLLogoColour style={{ height: 40, marginRight: 16 }} />}
          <Typography variant="h6" noWrap sx={{ color: '#1976d2', fontWeight: 700, flexGrow: 1 }}>
            E-Maritime
          </Typography>
          {/* Navbar menus */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuItems.map((item, idx) =>
              item.href ? (
                <Link href={item.href} key={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Button sx={{ mx: 1 }}>{item.label}</Button>
                </Link>
              ) : item.children ? (
                <Box key={item.label || idx}>
                  <Button
                    sx={{ mx: 1 }}
                    onClick={e => handleMenuOpen(e, idx)}
                  >
                    {item.label}
                  </Button>
                  <Menu
                    anchorEl={menuAnchor}
                    open={openMenuIdx === idx}
                    onClose={handleMenuClose}
                  >
                    {item.children.map(child =>
                      child.href ? (
                        <MenuItem key={child.href} onClick={handleMenuClose}>
                          <Link href={child.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {child.label}
                          </Link>
                        </MenuItem>
                      ) : null
                    )}
                  </Menu>
                </Box>
              ) : null
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: 220,
            boxSizing: 'border-box',
            bgcolor: '#fff',
            borderRight: '1px solid #e0e0e0',
            top: 64,
            height: 'calc(100% - 64px)',
          }
        }}
        open
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: 220,
            bgcolor: '#fff',
            borderRight: '1px solid #e0e0e0',
            top: 64,
            height: 'calc(100% - 64px)',
          }
        }}
      >
        {drawer}
      </Drawer>
      {/* Main content */}
      {/* <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: { md: '220px' }, width: '100%' }}> */}
      <Footer
        sx={{ mt: 'auto', bgcolor: '#1976d2', color: '#fff', p: 2, textAlign: 'center' }}
      />     
      {/* //   </Box> */}
     
    </Box>
  )
}