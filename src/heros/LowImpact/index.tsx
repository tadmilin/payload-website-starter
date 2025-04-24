import React from 'react'

// สร้าง interface สำหรับ hero
interface HeroProps {
  links?: Array<{
    link: any;
  }>;
  media?: any;
  richText?: any;
  type?: string;
}

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<HeroProps, 'richText'> & {
      children?: never
      richText?: HeroProps['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
