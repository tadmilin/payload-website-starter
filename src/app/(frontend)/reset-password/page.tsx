import React, { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  )
}
