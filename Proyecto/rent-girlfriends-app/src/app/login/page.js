'use client'

import { login } from '../actions/auth'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState('')

  async function handleSubmit(formData) {
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Iniciar Sesión</h1>
      {error && <p className="error-msg">{error}</p>}
      <form action={handleSubmit}>
        <label>Email</label>
        <input type="email" name="email" required placeholder="tu@email.com" />
        
        <label>Contraseña</label>
        <input type="password" name="password" required placeholder="********" />
        
        <button type="submit" style={{ width: '100%' }}>Ingresar</button>
      </form>
    </div>
  )
}
