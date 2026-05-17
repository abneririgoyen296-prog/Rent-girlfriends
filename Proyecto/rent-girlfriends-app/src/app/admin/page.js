import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { deleteUser } from '../actions/admin'

export default async function AdminPage() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') redirect('/')

  const usersCount = await prisma.user.count()
  const profilesCount = await prisma.profile.count()
  const bookingsCount = await prisma.booking.count()
  
  const recentUsers = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    take: 20
  })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Panel de Administración</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{usersCount}</h2>
          <p>Usuarios Registrados</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{profilesCount}</h2>
          <p>Perfiles de Acompañantes</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{bookingsCount}</h2>
          <p>Reservas Totales</p>
        </div>
      </div>

      <div className="card">
        <h3>Gestionar Usuarios</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '0.8rem' }}>Nombre</th>
              <th style={{ padding: '0.8rem' }}>Email</th>
              <th style={{ padding: '0.8rem' }}>Rol</th>
              <th style={{ padding: '0.8rem' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.8rem' }}>{user.name}</td>
                <td style={{ padding: '0.8rem' }}>{user.email}</td>
                <td style={{ padding: '0.8rem' }}>{user.role}</td>
                <td style={{ padding: '0.8rem' }}>
                  {user.id !== session.userId && (
                    <form action={deleteUser.bind(null, user.id)}>
                      <button type="submit" style={{ background: '#dc3545', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                        Eliminar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
