import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useAuth } from '@workos-inc/authkit-react'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  
  return (
    <>
      <Outlet />
    </>
  )
}
