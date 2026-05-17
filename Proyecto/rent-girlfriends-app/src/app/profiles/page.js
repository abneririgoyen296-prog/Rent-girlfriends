import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function ProfilesPage() {
  const profiles = await prisma.profile.findMany({
    include: {
      user: true
    }
  })

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Acompañantes Disponibles</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {profiles.map((profile) => (
          <div key={profile.id} className="card">
            <div style={{ height: '200px', background: '#222', borderRadius: '4px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#555' }}>Sin Foto</span>
              )}
            </div>
            <h2>{profile.user.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{profile.bio.substring(0, 100)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
                ${profile.hourlyRate}/hr
              </span>
              <Link href={`/profiles/${profile.id}`} className="btn">Ver Perfil</Link>
            </div>
          </div>
        ))}
      </div>
      {profiles.length === 0 && <p style={{ textAlign: 'center', marginTop: '2rem' }}>No hay perfiles disponibles en este momento.</p>}
    </div>
  )
}
