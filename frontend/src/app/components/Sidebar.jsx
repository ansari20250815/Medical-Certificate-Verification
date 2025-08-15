'use client'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, Box, Tooltip } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Link from 'next/link'
import { useState } from 'react'
import { menuItems } from './MenuItems'

export default function Sidebar({ collapsed, setCollapsed }) {
  const [openGroups, setOpenGroups] = useState({})

  const handleGroupClick = idx => {
    setOpenGroups(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 60 : 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? 60 : 220,
          boxSizing: 'border-box',
          bgcolor: '#fff',
          borderRight: '1px solid #e0e0e0',
          transition: 'width 0.2s',
          overflowX: 'hidden',
          height: '100%', // <-- This is important!
        }
      }}
      open
    >
      <Box display="flex" justifyContent="center" alignItems="center" p={1}>
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <List>
        {menuItems.map((item, idx) =>
          item.href ? (
            <ListItem key={item.href} disablePadding sx={{ display: 'block' }}>
              <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'flex-start', px: 2.5 }}>
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 2, justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Link>
            </ListItem>
          ) : item.children ? (
            <Box key={item.label || idx}>
              <ListItemButton
                onClick={() => handleGroupClick(idx)}
                sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'flex-start', px: 2.5 }}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 2, justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                {!collapsed && <ListItemText primary={item.label} />}
                {!collapsed && (openGroups[idx] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openGroups[idx]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map(child =>
                    child.href ? (
                      <ListItem key={child.href} disablePadding sx={{ display: 'block' }}>
                        <Link href={child.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ListItemButton sx={{ pl: collapsed ? 2.5 : 4 }}>
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ) : null
                  )}
                </List>
              </Collapse>
            </Box>
          ) : null
        )}
      </List>
    </Drawer>
  )
}