'use client'

import { CLLogoColour } from '@/app/libs/era'
// import { CLLogoColour } from '../libs/era'
import Image from 'next/image'

function Logo() {
  return <Image src={CLLogoColour} alt="CrimsonLogic's Logo" priority fill style={{ objectFit: 'contain' }} />
}

export default Logo
