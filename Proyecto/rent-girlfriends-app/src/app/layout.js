import { getSession } from '@/lib/auth'
import './globals.css'
import Link from 'next/link'
import { logout } from './actions/auth'

export const metadata = {
  title: 'RentCompanion - Encuentra tu compañía social',
  description: 'Sistema de reservas de acompañantes sociales',
}

export default async function RootLayout({ children }) {
  const session = await getSession()

  return (
    <html lang="es">
      <body>
        <nav>
          <Link href="/" className="logo">RentCompanion</Link>
          <div className="nav-links">
            {session ? (
              <>
                <Link href="/profiles">Acompañantes</Link>
                <Link href="/bookings">Mis Reservas</Link>
                {session.role === 'COMPANION' && (
                  <Link href="/my-profile">Mi Perfil</Link>
                )}
                {session.role === 'ADMIN' && (
                  <Link href="/admin">Panel Admin</Link>
                )}
                <form action={logout}>
                  <button type="submit" style={{ background: 'transparent', padding: 0, color: 'var(--primary)' }}>Cerrar Sesión</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Iniciar Sesión</Link>
                <Link href="/register">Registrarse</Link>
              </>
            )}
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
