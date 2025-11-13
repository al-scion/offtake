import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/portfolio')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/portfolio"!</div>
}
