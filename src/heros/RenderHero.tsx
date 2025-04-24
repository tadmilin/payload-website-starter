import React from 'react'

// สร้าง interface สำหรับ hero
interface HeroProps {
  links?: Array<{
    link: any;
  }>;
  media?: any;
  richText?: any;
  type?: 'highImpact' | 'lowImpact' | 'mediumImpact' | 'none' | string;
}

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<HeroProps> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
