'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBooking(formData) {
  const session = await getSession()
  if (!session) return { error: 'Debes iniciar sesión' }

  const companionId = parseInt(formData.get('companionId'))
  const date = formData.get('date')

  if (!companionId || !date) {
    return { error: 'Compañero y fecha son obligatorios' }
  }

  await prisma.booking.create({
    data: {
      clientId: session.userId,
      companionId: companionId,
      date: new Date(date),
      status: 'PENDING'
    }
  })

  redirect('/bookings')
}

export async function updateBookingStatus(bookingId, status) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  })

  revalidatePath('/bookings')
}

export async function deleteBooking(bookingId) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  // Eliminar primero la reseña asociada si existe (por la restricción de FK)
  await prisma.review.deleteMany({
    where: { bookingId: bookingId }
  })

  await prisma.booking.delete({
    where: { id: bookingId }
  })

  revalidatePath('/bookings')
}
