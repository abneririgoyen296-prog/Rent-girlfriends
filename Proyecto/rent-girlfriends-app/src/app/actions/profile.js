'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData) {
  const session = await getSession()
  if (!session || session.role !== 'COMPANION') return { error: 'No autorizado' }

  const bio = formData.get('bio')
  const hourlyRate = parseFloat(formData.get('hourlyRate'))
  const photoUrl = formData.get('photoUrl')

  await prisma.profile.update({
    where: { userId: session.userId },
    data: {
      bio,
      hourlyRate,
      photoUrl
    }
  })

  revalidatePath('/my-profile')
  revalidatePath('/profiles')
  return { success: 'Perfil actualizado correctamente' }
}
