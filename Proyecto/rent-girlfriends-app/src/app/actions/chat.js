'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData) {
  const session = await getSession()
  if (!session) return { error: 'No autorizado' }

  const receiverId = parseInt(formData.get('receiverId'))
  const content = formData.get('content')

  if (!content) return { error: 'El mensaje no puede estar vacío' }

  await prisma.message.create({
    data: {
      senderId: session.userId,
      receiverId,
      content
    }
  })

  revalidatePath(`/chat/${receiverId}`)
}
