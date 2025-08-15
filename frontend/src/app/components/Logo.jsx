'use client'

import { CLIconColour, CLIconWhite, CLLogoColour, CLLogoWhite } from '../libs/era'

import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'

function Logo() {
  const customizer = useSelector(state => state.customizer)

  return (
    <Link href='/'>
      <Image
        src={
          customizer.isCollapse && !customizer.isSidebarHover
            ? customizer.activeMode === 'dark'
              ? CLIconWhite
              : CLIconColour
            : customizer.activeMode === 'dark'
            ? CLLogoWhite
            : CLLogoColour
        }
        alt="CrimsonLogic's Logo"
        priority
        fill
        style={{ objectFit: 'contain' }}
      />
    </Link>
  )
}

export default Logo
