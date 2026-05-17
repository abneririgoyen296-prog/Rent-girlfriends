import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendMessage } from '../../actions/chat'
import { redirect } from 'next/navigation'

export default async function ChatPage({ params }) {
  const { id } = await params
  const session = await getSession()
  if (!session) redirect('/login')

  const otherUserId = parseInt(id)
  const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } })

  // Verificar si existe al menos una reserva APROBADA entre ambos usuarios
  const activeBooking = await prisma.booking.findFirst({
    where: {
      OR: [
        { clientId: session.userId, companionId: otherUserId },
        { clientId: otherUserId, companionId: session.userId }
      ],
      status: 'APPROVED'
    }
  })

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.userId }
      ]
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: '#000' }}>
        <h2>Chat con {otherUser.name}</h2>
        {!activeBooking && (
          <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ CHAT BLOQUEADO - No hay una cita activa</p>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1.5rem', 
        background: '#050505', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === session.userId
          return (
            <div key={msg.id} style={{ 
              alignSelf: isMine ? 'flex-end' : 'flex-start',
              maxWidth: '70%',
              padding: '0.8rem 1.2rem',
              borderRadius: '12px',
              background: isMine ? 'var(--primary)' : '#1a1a1a',
              color: 'white',
              opacity: activeBooking ? 1 : 0.6 // Mensajes opacos si está bloqueado
            }}>
              {msg.content}
              <div style={{ fontSize: '0.7rem', marginTop: '0.3rem', opacity: 0.7, textAlign: 'right' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )
        })}
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#555', marginTop: '2rem' }}>Di hola para empezar la conversación.</p>}
      </div>

      {activeBooking ? (
        <form action={sendMessage} style={{ padding: '1.5rem', background: '#000', display: 'flex', gap: '1rem' }}>
          <input type="hidden" name="receiverId" value={otherUserId} />
          <input 
            type="text" 
            name="content" 
            placeholder="Escribe un mensaje..." 
            required 
            autoComplete="off"
            style={{ marginBottom: 0, flex: 1 }}
          />
          <button type="submit" style={{ padding: '0 2rem' }}>Enviar</button>
        </form>
      ) : (
        <div style={{ padding: '1.5rem', background: '#111', textAlign: 'center', color: 'var(--text-muted)' }}>
          El chat está deshabilitado porque no tienes una cita aprobada en este momento.
        </div>
      )}
    </div>
  )
}
