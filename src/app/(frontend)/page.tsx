import { redirect } from 'next/navigation'

export default function Page() {
  // ทำ redirect ไปยังหน้า home
  redirect('/home')
}
