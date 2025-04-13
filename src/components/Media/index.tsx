import React from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const content = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  if (!htmlElement) {
    return content
  }

  return React.createElement(
    htmlElement,
    { className },
    content
  )
}
