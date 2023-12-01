import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Container } from '@/components/Container'
import { GroupView } from '@/components/Group'
import { Nav } from '@/components/Nav'
import { Person } from '@/interfaces'

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

  const peopleData = (await supabase
    .from('leidingsinfo')
    .select()).data as unknown as Person[]

  const groups = ['Pinkel', 'Speelclub', 'Rakwi', 'Tito', 'Keti', 'Aspi']

  return (
    <>
      { role === "admin" && <Nav href="/groups" />}
      <Container>
        <GroupView groups={groups} peopleData={peopleData}/>
      </Container>
    </>
  )
}
