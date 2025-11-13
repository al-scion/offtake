import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuth } from '@workos-inc/authkit-react'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  
  return (
    <>
      <header className='flex flex-row items-center h-12 p-3 border-b'>
        <div onClick={() => auth.signOut()}>Sign out</div>
        {auth.user?.id}
      </header>
      <Outlet />
    </>
  )
}
