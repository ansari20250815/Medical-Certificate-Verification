'use client'
import { useState } from 'react'
import { Box } from '@mui/material'
import EraAppBar from './AppBar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import Dashboard from '../dashboard/Dashboard'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../createEmotionCache'
import  '../libs/era/index.css'

export default function ComponentsLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [profile, setProfile] = useState({ name: 'John Doe' })
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
  const clientSideEmotionCache = createEmotionCache();

  return (
    <div className="era-loader">

<CacheProvider value={clientSideEmotionCache}>
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f7fa'
    }}>
      <EraAppBar
        onMenuClick={() => setCollapsed(!collapsed)}
        profile={profile}
        onProfileMenu={e => setProfileMenuAnchor(e.currentTarget)}
        profileMenuAnchor={profileMenuAnchor}
        onProfileMenuClose={() => setProfileMenuAnchor(null)}
      />
      {/* Main content area: fills available space between AppBar and Footer */}
      <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
      {children || <Dashboard />}
      </Box>
    </Box>
      <Footer />
    </Box>
    </CacheProvider>
    </div>

  )
}