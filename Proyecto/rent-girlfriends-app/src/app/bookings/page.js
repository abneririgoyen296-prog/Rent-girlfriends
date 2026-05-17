import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { updateBookingStatus, deleteBooking } from '../actions/bookings'
import Link from 'next/link'

export default async function BookingsPage() {
  const session = await getSession()
  if (!session) return <p>Inicia sesión para ver tus reservas.</p>

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { clientId: session.userId },
        { companionId: session.userId }
      ]
    },
    include: {
      client: true,
      companion: true,
      review: true
    },
    orderBy: { date: 'desc' }
  })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Mis Reservas</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {bookings.map((booking) => {
          const isCompanionView = booking.companionId === session.userId
          const otherUser = isCompanionView ? booking.client : booking.companion
          
          return (
            <div key={booking.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ 
                  color: booking.status === 'APPROVED' ? '#28a745' : booking.status === 'PENDING' ? 'gold' : 'var(--text-muted)', 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}>{booking.status}</p>
                <h3>{otherUser.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  {new Date(booking.date).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Actions for Companion */}
                {isCompanionView && booking.status === 'PENDING' && (
                  <>
                    <form action={updateBookingStatus.bind(null, booking.id, 'APPROVED')}>
                      <button type="submit" style={{ background: '#28a745' }}>Aprobar</button>
                    </form>
                    <form action={updateBookingStatus.bind(null, booking.id, 'CANCELLED')}>
                      <button type="submit" style={{ background: '#dc3545' }}>Rechazar</button>
                    </form>
                  </>
                )}
                
                {isCompanionView && booking.status === 'APPROVED' && (
                  <form action={updateBookingStatus.bind(null, booking.id, 'COMPLETED')}>
                    <button type="submit" style={{ background: 'var(--primary)' }}>Finalizar Cita</button>
                  </form>
                )}

                {/* Actions for Client */}
                {!isCompanionView && booking.status === 'COMPLETED' && !booking.review && (
                  <Link href={`/bookings/${booking.id}/review`} className="btn" style={{ background: 'gold', color: 'black' }}>
                    ⭐ Calificar
                  </Link>
                )}

                {booking.review && <span style={{ color: 'gold' }}>✅ Calificado</span>}
                
                {booking.status === 'APPROVED' && (
                  <Link href={`/chat/${otherUser.id}`} className="btn">Chat</Link>
                )}

                {/* Delete button for COMPLETED or CANCELLED */}
                {(booking.status === 'COMPLETED' || booking.status === 'CANCELLED') && (
                  <form action={deleteBooking.bind(null, booking.id)}>
                    <button type="submit" style={{ background: 'transparent', color: '#555', border: '1px solid #333', padding: '0.5rem' }}>
                      Eliminar historial
                    </button>
                  </form>
                )}
              </div>
            </div>
          )
        })}
        {bookings.length === 0 && <p style={{ textAlign: 'center' }}>No tienes reservas registradas.</p>}
      </div>
    </div>
  )
}
