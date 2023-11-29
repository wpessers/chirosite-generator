import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { KeyIcon, XCircleIcon } from '@heroicons/react/20/solid'

export default function SetPassword({
  searchParams,
}: {
  searchParams: {
    token: string,
    message: string,
  }
}) {
  const changePassword = async (formData: FormData) => {
    'use server'
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { error: otpError } = await supabase.auth.verifyOtp({ token_hash: searchParams.token, type: 'email'})
    
    const password = formData.get('password') as string
    const { error: updateError } = await supabase.auth.updateUser({password: password})

    if (otpError) {
      return redirect('/set-password?message=Invalid invite url')
    }

    if (updateError) {
      return redirect('/set-password?message=Could not set your new password')
    }

    return redirect('/')
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <KeyIcon className="mx-auto h-10 w-10 text-indigo-500"/>
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Set your account password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST" action={changePassword}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Set password
              </button>
            </div>
            {searchParams?.message && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        {searchParams.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}