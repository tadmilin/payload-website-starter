'use client'

export default function Error({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div>
        <h1 className="text-2xl mb-4">เกิดข้อผิดพลาด</h1>
        <p>{error.message}</p>
      </div>
    </div>
  )
}
