'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'No autorizado' }

  // Eliminar en cascada manualmente (Prisma/SQLite a veces necesita ayuda)
  await prisma.review.deleteMany({ where: { profile: { userId } } })
  await prisma.review.deleteMany({ where: { booking: { clientId: userId } } })
  await prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } })
  await prisma.booking.deleteMany({ where: { OR: [{ clientId: userId }, { companionId: userId }] } })
  await prisma.profile.deleteMany({ where: { userId } })
  
  await prisma.user.delete({
    where: { id: userId }
  })

  revalidatePath('/admin')
  revalidatePath('/profiles')
}
