'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function register(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  const role = formData.get('role') || 'CLIENT'
  const cedula = formData.get('cedula')

  if (!email || !password || !name) {
    return { error: 'Todos los campos son obligatorios' }
  }

  if (role === 'CLIENT') {
    if (!cedula) return { error: 'La cédula es obligatoria para clientes' }
    // Formato de cédula nicaragüense: 000-000000-0000A
    const cedulaRegex = /^\d{3}-\d{6}-\d{4}[a-zA-Z]$/i
    if (!cedulaRegex.test(cedula)) {
      return { error: 'Formato de cédula nicaragüense inválido (ej: 001-010190-0000A)' }
    }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'El correo ya está registrado' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      cedula,
      role
    }
  })

  // If companion, create empty profile
  if (role === 'COMPANION') {
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: 'Sin descripción aún',
        hourlyRate: 0
      }
    })
  }

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id, role: user.role, expires })

  ;(await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/')
}

export async function login(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Email y contraseña son obligatorios' }
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Credenciales inválidas' }
  }

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const session = await encrypt({ userId: user.id, role: user.role, expires })

  ;(await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  })

  redirect('/')
}

export async function logout() {
  ;(await cookies()).delete('session')
  redirect('/login')
}
