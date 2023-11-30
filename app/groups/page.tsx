import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Groups() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: { role } } = await supabase
    .from('leidingsinfo')
    .select()
    .eq('id', session.user.id)
    .single()

  if (role == null || role !== 'admin') {
    redirect('/')
  }

  return (
    <>
      { role === "admin" && <div><p>Test conditional nav</p></div>}
      <div className="max-w-screen-md mx-auto p-6">
        <p>Placeholder text</p>
      </div>
    </>
  )
}
