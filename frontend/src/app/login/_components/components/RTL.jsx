import React, { useEffect } from 'react'

import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import { useSelector } from 'react-redux'

function RTL(props) {
  const { children } = props

  const activeDir = useSelector(state => state.customizer.activeDir)

  useEffect(() => {
    document.dir = activeDir
  }, [activeDir])

  const cacheValue = createCache({
    key: 'rtl',
    prepend: true,

    // We have to temporary ignore this due to incorrect definitions
    // in the stylis-plugin-rtl module
    // @see https://github.com/styled-components/stylis-plugin-rtl/issues/23
    stylisPlugins: [rtlPlugin]
  })

  return activeDir === 'rtl' ? <CacheProvider value={cacheValue}>{children}</CacheProvider> : children
}

export default RTL
