'use client'

import { register } from '../actions/auth'
import { useState } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [role, setRole] = useState('CLIENT')

  async function handleSubmit(formData) {
    const res = await register(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Registrarse</h1>
      {error && <p className="error-msg">{error}</p>}
      <form action={handleSubmit}>
        <label>Nombre Completo</label>
        <input type="text" name="name" required placeholder="Juan Pérez" />

        <label>Email</label>
        <input type="email" name="email" required placeholder="tu@email.com" />
        
        <label>Contraseña</label>
        <input type="password" name="password" required placeholder="********" />

        <label>Tipo de Usuario</label>
        <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="CLIENT">Cliente</option>
          <option value="COMPANION">Acompañante</option>
        </select>
        
        {role === 'CLIENT' && (
          <>
            <label>Cédula de Identidad (Nicaragua)</label>
            <input type="text" name="cedula" required placeholder="000-000000-0000A" title="Formato: 000-000000-0000A" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1rem' }}>Requerido para verificar tu identidad como cliente.</p>
          </>
        )}

        <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Crear Cuenta</button>
      </form>
    </div>
  )
}
