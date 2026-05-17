import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function Home() {
  const session = await getSession()

  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary)' }}>RentCompanion</h1>
      <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Encuentra la compañía perfecta para tus eventos sociales, cenas o paseos.
      </p>
      
      {!session ? (
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/register" className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            Empieza Ahora
          </Link>
          <Link href="/login" className="btn" style={{ background: 'var(--secondary)', border: '1px solid var(--primary)', fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            Iniciar Sesión
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/profiles" className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            Explorar Acompañantes
          </Link>
        </div>
      )}

      <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Seguro y Confiable</h3>
          <p>Todos nuestros acompañantes pasan por un proceso de verificación para tu tranquilidad.</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Reserva Fácil</h3>
          <p>Selecciona la fecha y hora que prefieras y espera la confirmación en minutos.</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Chat Integrado</h3>
          <p>Comunícate directamente con tu acompañante antes de la cita para coordinar detalles.</p>
        </div>
      </div>
    </div>
  )
}
