import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Container } from '@/components/Container'
import { Nav } from '@/components/Nav'

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
      { role === "admin" && <Nav href="/groups" />}
      <Container>
        <p>Placeholder text</p>
      </Container>
    </>
  )
}
