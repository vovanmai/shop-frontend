import { cookies } from 'next/headers'

export async function POST() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await res.json()

  const dataCookie: any = {
    name: 'access_token',
    value: 'access token after login.',
    httpOnly: true,
    path: '/',
  }
  cookies().set(dataCookie)

  return Response.json({ data })
}