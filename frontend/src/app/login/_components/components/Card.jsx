import { Card as MuiCard, useTheme } from '@mui/material'

import { useSelector } from 'react-redux'

function Card(props) {
  const { children, ...otherProps } = props

  const theme = useTheme()
  const isCardShadow = useSelector(state => state.customizer.isCardShadow)

  return (
    <MuiCard
      sx={{ padding: 0, border: !isCardShadow ? `1px solid ${theme.palette.divider}` : 'none' }}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
      {...otherProps}
    >
      {children}
    </MuiCard>
  )
}

export default Card
