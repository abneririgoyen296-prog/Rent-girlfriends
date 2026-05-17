import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET)

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secretKey)
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, secretKey, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const res = await encrypt(parsed)
  ;(await cookies()).set('session', res, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: parsed.expires,
    sameSite: 'lax',
    path: '/',
  })
}
