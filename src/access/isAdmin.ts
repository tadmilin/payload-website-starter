import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has the 'admin' role
  return Boolean(user?.roles?.includes('admin'))
} 