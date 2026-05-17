'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const bookingId = parseInt(formData.get('bookingId'))
  const rating = parseInt(formData.get('rating'))
  const comment = formData.get('comment')

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { companion: { include: { profile: true } } }
  })

  if (!booking || booking.clientId !== session.userId) {
    return { error: 'No puedes calificar esta reserva' }
  }

  await prisma.review.create({
    data: {
      bookingId,
      profileId: booking.companion.profile.id,
      rating,
      comment
    }
  })

  // Update average rating for the profile
  const allReviews = await prisma.review.findMany({
    where: { profileId: booking.companion.profile.id }
  })
  
  const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length

  await prisma.profile.update({
    where: { id: booking.companion.profile.id },
    data: { rating: avgRating }
  })

  revalidatePath('/profiles')
  revalidatePath(`/profiles/${booking.companion.profile.id}`)
  revalidatePath('/bookings')
  
  redirect('/bookings')
}
