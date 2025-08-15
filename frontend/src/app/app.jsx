'use client'

import './libs/era/index.css'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import RTL from '@/components/RTL'
import { SessionProvider } from 'next-auth/react'
// import { InfoProvider } from '@/utils/InfoContext'

function App(props) {
  return (
    <SessionProvider session={props.session}>
      <RTL>
        <LocalizationProvider dateAdapter={AdapterMoment}>{props.children}</LocalizationProvider>
      </RTL>
    </SessionProvider>
  )
}

export default App
