import type { PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export const authenticated = ({ req }: { req: PayloadRequest }): boolean => {
  return Boolean(req.user)
}
