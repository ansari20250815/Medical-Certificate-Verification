import { Box } from '@mui/material'
import { CLTagline } from '../libs/era'

export default function Footer() {
  return (
    <Box
      width="110%"
      bgcolor="#1976d2"
      color="#fff"
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      py={1}
      mt="auto"
      sx={{
        fontSize: { xs: '0.9rem', md: '1.1rem' },
        textAlign: 'center'
      }}
    >
      <CLTagline height='1.2rem' widthMobile='100%' />
      <Box mt={1}>
        Copyright © 2024 DocuCheck
      </Box>
    </Box>
  )
}