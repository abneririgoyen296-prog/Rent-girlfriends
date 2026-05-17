import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProfileDetailPage({ params }) {
  const { id } = await params
  const session = await getSession()
  
  const profile = await prisma.profile.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      reviews: {
        include: {
          booking: {
            include: {
              client: true
            }
          }
        }
      }
    }
  })

  if (!profile) return notFound()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
      <div>
        <div style={{ width: '100%', aspectRatio: '1', background: '#222', borderRadius: '8px', marginBottom: '1.5rem', overflow: 'hidden' }}>
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Sin Foto</div>
          )}
        </div>
        <div className="card">
          <h3>Información</h3>
          <p style={{ marginTop: '1rem' }}><strong>Tarifa:</strong> ${profile.hourlyRate} / hora</p>
          <p><strong>Calificación:</strong> ⭐ {profile.rating.toFixed(1)}</p>
          {session?.userId !== profile.userId && (
            <Link href={`/bookings/new?companionId=${profile.userId}`} className="btn" style={{ width: '100%', textAlign: 'center', marginTop: '1.5rem', display: 'block' }}>
              Reservar Cita
            </Link>
          )}
        </div>
      </div>

      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{profile.user.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>Acompañante Social</p>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Sobre mí</h3>
          <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{profile.bio}</p>
        </div>

        <h3>Reseñas ({profile.reviews.length})</h3>
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {profile.reviews.map((review) => (
            <div key={review.id} className="card" style={{ background: '#151515' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{review.booking.client.name}</strong>
                <span style={{ color: 'gold' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
          {profile.reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aún no hay reseñas para este perfil.</p>}
        </div>
      </div>
    </div>
  )
}
