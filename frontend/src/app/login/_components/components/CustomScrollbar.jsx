import 'simplebar-react/dist/simplebar.min.css'

import { Box, styled, useTheme } from '@mui/material'

import SimpleBar from 'simplebar-react'
import useMediaQuery from '@mui/material/useMediaQuery'

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%'
}))

const CustomScrollbar = props => {
  const { children, ...other } = props
  const theme = useTheme()
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'))

  return lgDown ? (
    <Box sx={{ overflowX: 'auto' }}>{children}</Box>
  ) : (
    <SimpleBarStyle {...other}>{children}</SimpleBarStyle>
  )
}

export default CustomScrollbar
