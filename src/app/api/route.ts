import {cookies} from "next/headers";

export async function POST() {
  cookies().set({
    name: 'setco',
    value: 'okok',
    httpOnly: true,
    path: '/',
  })
  return Response.json({ message: 'OK' })
}