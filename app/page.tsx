import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { Container } from '@/components/Container'
import { Nav } from '@/components/Nav'

export default async function Index() {
  'use server'
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('leidingsinfo')
    .select()
    .eq('id', session.user.id)
    .single()

  const updateUser = async (formData: FormData) => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (!session) {
      redirect('/login')
    }

    const userData = Object.fromEntries(
      [...formData.entries()].filter(([k, v]) => !k.toLowerCase().includes('action'))
        .flatMap(([k, v]) => {
          if (k === 'street_address') {
            const re_num = /(\d+)/
            const [street, house_number] = v.toString().split(re_num)
            return [['street', street], ['house_number', house_number]]
          }
          return [[k, v]]
        }))
    
    const { error } = await supabase
      .from('leidingsinfo')
      .update({ ...userData })
      .eq('id', session.user.id)

  }

  return (
    <>
      { data.role === "admin" && <Nav href="/"></Nav>}
      <Container>
        <form action={updateUser}>
          <div className="space-y-12">
            <div className="border-b border-white/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-white">Personal Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">Enter or update your information</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.first_name}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.last_name}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.email}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-white">
                    Phone number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="+32 488 00 00 00"
                      defaultValue={data.phone_number}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 sm:col-start-1">
                  <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-white">
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="street_address"
                      id="street_address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={`${data.street} ${data.house_number}`}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.city}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-white">
                    Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="postal_code"
                      id="postal_code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.postal_code}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="birth-date" className="block text-sm font-medium leading-6 text-white">
                    Date of Birth
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="birth_date"
                      id="birth_date"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.birth_date}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4 sm:col-start-1">
                  <label htmlFor="education-occupation" className="block text-sm font-medium leading-6 text-white">
                    Education / Occupation
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="education_occupation"
                      id="education_occupation"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.education_occupation}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="hobbies" className="block text-sm font-medium leading-6 text-white">
                    Hobbies
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="hobbies"
                      id="hobbies"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.hobbies}
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="responsibilities" className="block text-sm font-medium leading-6 text-white">
                    Responsibilities
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="responsibilities"
                      id="responsibilities"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.responsibilities}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-color" className="block text-sm font-medium leading-6 text-white">
                    Favorite color
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_color"
                      id="fav_color"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Geel"
                      defaultValue={data.fav_color}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-activity" className="block text-sm font-medium leading-6 text-white">
                    Favorite activity
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_activity"
                      id="fav_activity"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Dropping"
                      defaultValue={data.fav_activity}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-song" className="block text-sm font-medium leading-6 text-white">
                    Favorite song
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_song"
                      id="fav_song"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Summer of '69"
                      defaultValue={data.fav_song}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-camp" className="block text-sm font-medium leading-6 text-white">
                    Favorite camp
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_camp"
                      id="fav_camp"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Westouter 2016"
                      defaultValue={data.fav_camp}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-music-genre" className="block text-sm font-medium leading-6 text-white">
                    Favorite music genre
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_music_genre"
                      id="fav_music_genre"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Chiroliedjes"
                      defaultValue={data.fav_music_genre}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fav-film-book" className="block text-sm font-medium leading-6 text-white">
                    Favorite film / book
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fav_film_book"
                      id="fav_film_book"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      placeholder="Borat"
                      defaultValue={data.fav_film_book}
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="prev-groups" className="block text-sm font-medium leading-6 text-white">
                    Previous groups
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="prev_groups"
                      id="prev_groups"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.prev_groups}
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="years-active" className="block text-sm font-medium leading-6 text-white">
                    Years active
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="years_active"
                      id="years_active"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      defaultValue={data.years_active}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="my-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-white">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </Container>
    </>
  )
}
