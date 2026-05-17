'use client'

import { createBooking } from '../../actions/bookings'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function NewBookingPage() {
  const searchParams = useSearchParams()
  const companionId = searchParams.get('companionId')
  const [error, setError] = useState('')

  if (!companionId) return <p>Error: No se especificó el acompañante.</p>

  async function handleSubmit(formData) {
    const res = await createBooking(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }} className="card">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Reservar Cita</h1>
      {error && <p className="error-msg">{error}</p>}
      <form action={handleSubmit}>
        <input type="hidden" name="companionId" value={companionId} />
        
        <label>Fecha y Hora de la cita</label>
        <input type="datetime-local" name="date" required />
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Nota: La reserva quedará pendiente hasta que el acompañante la apruebe.
        </p>

        <button type="submit" style={{ width: '100%' }}>Confirmar Reserva</button>
      </form>
    </div>
  )
}
