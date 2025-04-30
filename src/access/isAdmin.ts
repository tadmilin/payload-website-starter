import type { PayloadRequest } from 'payload'

export const isAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  // Return true or false based on if the user has the 'admin' role
  return Boolean(req.user?.roles?.includes('admin'))
}
