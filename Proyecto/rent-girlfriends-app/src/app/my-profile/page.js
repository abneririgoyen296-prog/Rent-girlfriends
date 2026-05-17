import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { updateProfile } from '../actions/profile'

export default async function MyProfilePage() {
  const session = await getSession()
  if (!session || session.role !== 'COMPANION') redirect('/')

  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    include: { user: true }
  })

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Mi Perfil de Acompañante</h1>
      
      <form action={updateProfile} className="card">
        <label>Nombre (No editable)</label>
        <input type="text" value={profile.user.name} disabled style={{ opacity: 0.7 }} />

        <label>Biografía / Descripción</label>
        <textarea 
          name="bio" 
          defaultValue={profile.bio} 
          rows="5" 
          required 
          placeholder="Cuéntanos sobre ti..."
          style={{ width: '100%', padding: '0.8rem', background: 'var(--secondary)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', marginBottom: '1rem' }}
        ></textarea>

        <label>Tarifa por Hora ($)</label>
        <input type="number" name="hourlyRate" defaultValue={profile.hourlyRate} step="0.01" required />

        <label>URL de Foto de Perfil (Opcional)</label>
        <input type="text" name="photoUrl" defaultValue={profile.photoUrl} placeholder="https://ejemplo.com/tu-foto.jpg" />

        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Guardar Cambios</button>
      </form>

      <div className="card" style={{ marginTop: '2rem', border: '1px dashed var(--primary)' }}>
        <h3>Vista Previa</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Así es como los clientes verán tu perfil en la lista.</p>
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#111', borderRadius: '8px' }}>
          <h4>{profile.user.name}</h4>
          <p>${profile.hourlyRate}/hr</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>{profile.bio.substring(0, 100)}...</p>
        </div>
      </div>
    </div>
  )
}
